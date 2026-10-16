import { AccessToken } from "livekit-server-sdk";

import { requireMobileSession } from "@/lib/mobile/auth";
import { MobileApiError, mobileData, mobileError } from "@/lib/mobile/api";
import { findAuthorizedLiveSession } from "@/lib/mobile/live-muthowif";
import { assertLiveSessionJoinable } from "@/lib/mobile/live-session-policy";
import { readLiveListenerCount } from "@/lib/mobile/livekit-room";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { account, pilgrim } = await requireMobileSession(request);
    const { sessionId } = await params;
    const { session } = await findAuthorizedLiveSession(pilgrim.id, sessionId);

    const activeListenerCount = await readLiveListenerCount(session.roomName);
    assertLiveSessionJoinable({ ...session, listenerCount: activeListenerCount ?? session.listenerCount });

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_WS_URL;
    if (!apiKey || !apiSecret || !serverUrl) {
      throw new MobileApiError(503, "LIVE_NOT_CONFIGURED", "Siaran belum dapat dihubungkan. Silakan coba kembali.");
    }

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: `jamaah-${account.id}`,
      name: pilgrim.fullName,
      ttl: "5m",
      metadata: JSON.stringify({ pilgrimId: pilgrim.id, departureId: session.departureId }),
    });
    accessToken.addGrant({
      room: session.roomName,
      roomJoin: true,
      canSubscribe: true,
      canPublish: false,
      canPublishData: false,
    });

    return mobileData({
      token: await accessToken.toJwt(),
      serverUrl,
      roomName: session.roomName,
      session: { id: session.id, title: session.title, muthowifName: session.muthowifName },
    });
  } catch (error) {
    return mobileError(error, "live-muthowif-token");
  }
}
