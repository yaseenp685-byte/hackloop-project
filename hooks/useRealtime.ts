import { useState, useEffect } from "react";
import { realtimeService } from "@/services/realtimeService";
import { RealtimeConnectionState, RealtimeEventPayload } from "@/types/realtime";

export function useRealtime(eventType?: string) {
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>(
    realtimeService.getState()
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    realtimeService.getLastUpdate()
  );
  const [lastEvent, setLastEvent] = useState<RealtimeEventPayload | null>(null);
  const [relativeStatusLabel, setRelativeStatusLabel] = useState<string>("Connecting...");

  // Sync connection state
  useEffect(() => {
    const unsubscribeState = realtimeService.onStateChange((state) => {
      setConnectionState(state);
      setLastUpdated(realtimeService.getLastUpdate());
    });

    const unsubscribeEvents = realtimeService.subscribe(
      eventType || "*",
      (payload) => {
        setLastEvent(payload);
        setLastUpdated(new Date());
      }
    );

    return () => {
      unsubscribeState();
      unsubscribeEvents();
    };
  }, [eventType]);

  // Update relative status text every 5 seconds
  useEffect(() => {
    const updateLabel = () => {
      if (connectionState === "CONNECTING") {
        setRelativeStatusLabel("Connecting...");
        return;
      }
      if (connectionState === "RECONNECTING") {
        setRelativeStatusLabel("Reconnecting...");
        return;
      }
      if (connectionState === "OFFLINE") {
        setRelativeStatusLabel("Offline");
        return;
      }

      // Live state calculations
      if (!lastUpdated) {
        setRelativeStatusLabel("Live");
        return;
      }

      const diffSec = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (diffSec < 15) {
        setRelativeStatusLabel("Live • Updated just now");
      } else if (diffSec < 45) {
        setRelativeStatusLabel("Live • Updated 30 seconds ago");
      } else {
        const mins = Math.floor(diffSec / 60);
        setRelativeStatusLabel(`Live • Last updated ${mins}m ago`);
      }
    };

    updateLabel();
    const interval = setInterval(updateLabel, 5000);
    return () => clearInterval(interval);
  }, [connectionState, lastUpdated]);

  return {
    connectionState,
    isLive: connectionState === "LIVE",
    lastUpdated,
    lastEvent,
    statusLabel: relativeStatusLabel,
    simulateUpdate: (type: "STATUS_CHANGED" | "REGISTRATION_UPDATE" | "ANNOUNCEMENT_PUBLISHED", data: any) =>
      realtimeService.simulateEvent(type, data),
  };
}
