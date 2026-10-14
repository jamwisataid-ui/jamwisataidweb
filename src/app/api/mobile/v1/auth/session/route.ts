import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    return mobileData({ user: { id: pilgrim.id, fullName: pilgrim.fullName, whatsapp: pilgrim.whatsapp, email: pilgrim.email } });
  } catch (error) {
    return mobileError(error, "session");
  }
}
