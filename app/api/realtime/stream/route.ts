import { NextRequest } from "next/server";
import { eventBus, SystemEvent } from "@/lib/events/eventBus";
import { verifyToken, TokenPayload } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Extract token from query param, header, or cookie
  const { searchParams } = new URL(req.url);
  const tokenFromQuery = searchParams.get("token");
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("auth_token")?.value;

  let token: string | null = null;
  if (tokenFromQuery) {
    token = tokenFromQuery;
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  let user: TokenPayload | null = null;
  if (token) {
    try {
      user = verifyToken(token);
    } catch {
      // Allow unauthenticated connection with PUBLIC scope only
      user = null;
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Initial connection ACK
      const initMessage = `data: ${JSON.stringify({
        type: "CONNECTED",
        timestamp: new Date().toISOString(),
        userScope: user ? `ROLE_${user.role}` : "PUBLIC",
      })}\n\n`;
      controller.enqueue(encoder.encode(initMessage));

      // 2. Real-time event listener
      const eventListener = (event: SystemEvent) => {
        try {
          // Scope filtering
          if (event.scope === "PUBLIC") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            return;
          }

          if (user) {
            if (user.role === "ADMIN") {
              // Admin receives all events
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
              return;
            }

            if (event.scope === `ROLE_${user.role}`) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
              return;
            }

            if (event.scope === "USER" && event.targetUserId === user.userId) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
              return;
            }
          }
        } catch (err) {
          console.error("[SSE_SEND_ERROR]", err);
        }
      };

      eventBus.on("event", eventListener);

      // 3. Keep-alive heartbeat every 15s to keep TCP connection open
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      // 4. Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        eventBus.off("event", eventListener);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for Nginx
    },
  });
}
