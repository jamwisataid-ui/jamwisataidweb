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
