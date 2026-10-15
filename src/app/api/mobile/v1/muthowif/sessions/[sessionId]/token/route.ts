import { AccessToken } from "livekit-server-sdk";

import { requireMuthowifSession } from "@/lib/mobile/auth";
import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";
import { assertMuthowifSessionBroadcastable } from "@/lib/mobile/muthowif-live-policy";
import { findAssignedMuthowifSession } from "@/lib/mobile/muthowif-panel";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { account, user } = await requireMuthowifSession(request);
    const session = await findAssignedMuthowifSession(user.id, (await params).sessionId);
    assertMuthowifSessionBroadcastable(session.status);
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_WS_URL;
    if (!apiKey || !apiSecret || !serverUrl) throw new MobileApiError(503, "LIVE_NOT_CONFIGURED", "Siaran belum dapat dihubungkan. Silakan coba kembali.");
    const token = new AccessToken(apiKey, apiSecret, {
      identity: `muthowif-${account.id}`,
      name: user.name,
      ttl: "8h",
      metadata: JSON.stringify({ role: "muthowif", userId: user.id, departureId: session.departureId }),
    });
    token.addGrant({ room: session.roomName, roomJoin: true, canSubscribe: true, canPublish: true, canPublishData: true });
    return mobileData({ token: await token.toJwt(), serverUrl, roomName: session.roomName });
  } catch (error) {
    return mobileError(error, "muthowif-live-token");
  }
}
