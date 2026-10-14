import { revokeMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function POST(request: Request) {
  try {
    const header = request.headers.get("authorization");
    if (header?.startsWith("Bearer ")) await revokeMobileSession(header.slice(7).trim());
    return mobileData({ success: true });
  } catch (error) {
    return mobileError(error, "logout");
  }
}
