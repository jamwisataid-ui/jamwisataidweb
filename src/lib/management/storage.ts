import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function configuration() {
  const endpoint = process.env.R2_ENDPOINT?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Penyimpanan dokumen private belum dikonfigurasi.");
  }
  return { endpoint, accessKeyId, secretAccessKey, bucket };
}

function client() {
  const config = configuration();
  return {
    bucket: config.bucket,
    s3: new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    }),
  };
}

export function validatePrivateUpload(mimeType: string, sizeBytes: number) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) throw new Error("File harus berupa JPG, PNG, WebP, atau PDF.");
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_UPLOAD_BYTES) {
    throw new Error("Ukuran file maksimal 10 MB.");
  }
}

export function validatePrivateFile(bytes: Uint8Array, mimeType: string, sizeBytes: number) {
  validatePrivateUpload(mimeType, sizeBytes);
  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const isValid = mimeType === "image/jpeg"
    ? startsWith(0xff, 0xd8, 0xff)
    : mimeType === "image/png"
      ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
      : mimeType === "image/webp"
        ? startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
        : mimeType === "application/pdf"
          ? startsWith(0x25, 0x50, 0x44, 0x46, 0x2d)
          : false;
  if (!isValid) throw new Error("Isi file tidak sesuai dengan tipe JPG, PNG, WebP, atau PDF yang dipilih.");
}

export function privateObjectKey(scope: "pilgrims" | "payments" | "documents" | "settings", entityId: string, extension = "bin") {
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `private/${scope}/${entityId}/${randomUUID()}.${safeExtension}`;
}

export async function createPrivateDownloadUrl(objectKey: string, fileName?: string) {
  const { s3, bucket } = client();
  return getSignedUrl(s3, new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ResponseContentDisposition: fileName ? `attachment; filename="${fileName.replace(/["\r\n]/g, "")}"` : undefined,
  }), { expiresIn: 600 });
}

export async function putPrivateObject(objectKey: string, body: Uint8Array, contentType: string) {
  const { s3, bucket } = client();
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: objectKey, Body: body, ContentType: contentType }));
}

export async function deletePrivateObject(objectKey: string) {
  const { s3, bucket } = client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
}
