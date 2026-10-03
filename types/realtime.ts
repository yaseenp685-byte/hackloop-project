export type RealtimeConnectionState =
  | "CONNECTING"
  | "LIVE"
  | "RECONNECTING"
  | "OFFLINE";

export type RealtimeEventType =
  | "HACKATHON_CREATED"
  | "HACKATHON_UPDATED"
  | "STATUS_CHANGED"
  | "REGISTRATION_UPDATE"
  | "ANNOUNCEMENT_PUBLISHED"
  | "VERIFICATION_UPDATED"
  | "SYSTEM_HEARTBEAT";

export interface RealtimeEventPayload<T = unknown> {
  id: string;
  type: RealtimeEventType;
  entityType: "HACKATHON" | "INSTITUTION" | "COMPANY" | "REGISTRATION" | "ANNOUNCEMENT";
  entityId: string;
  timestamp: string;
  data: T;
  message?: string;
}

export type RealtimeSubscriptionCallback<T = unknown> = (payload: RealtimeEventPayload<T>) => void;
