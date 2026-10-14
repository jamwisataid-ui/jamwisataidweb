import { mobileData, mobileError, MobileApiError, requestMetadata, zodFieldErrors } from "@/lib/mobile/api";
import { rotateMobileSession } from "@/lib/mobile/auth";
import { refreshSchema } from "@/lib/mobile/validation";

export async function POST(request: Request) {
  try {
    const parsed = refreshSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new MobileApiError(400, "VALIDATION_ERROR", "Refresh token tidak valid.", zodFieldErrors(parsed.error));
    return mobileData({ tokens: await rotateMobileSession(parsed.data.refreshToken, requestMetadata(request)) });
  } catch (error) {
    return mobileError(error, "refresh");
  }
}
