import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const { pilgrim } = await requireMobileSession(request);
    return mobileData({
      id: pilgrim.id,
      fullName: pilgrim.fullName,
      whatsapp: pilgrim.whatsapp,
      email: pilgrim.email,
      gender: pilgrim.gender,
      birthDate: pilgrim.birthDate,
      nationality: pilgrim.nationality,
      passportNumber: pilgrim.passportNumber,
      passportExpiry: pilgrim.passportExpiry,
    });
  } catch (error) {
    return mobileError(error, "me");
  }
}
