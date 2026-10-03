/**
 * REAL-TIME SERVICE LAYER
 * 
 * Provides an event-driven abstraction over WebSockets and Server-Sent Events (SSE).
 * Handles connection lifecycle: CONNECTING, LIVE, RECONNECTING, OFFLINE.
 * Dispatches granular event updates (hackathons, registrations, announcements, verifications)
 * without triggering full page reloads.
 */

import { RealtimeConnectionState, RealtimeEventPayload, RealtimeSubscriptionCallback } from "@/types/realtime";

class RealtimeManager {
  private static instance: RealtimeManager;
  private state: RealtimeConnectionState = "OFFLINE";
  private listeners: Set<(state: RealtimeConnectionState) => void> = new Set();
  private eventSubscribers: Map<string, Set<RealtimeSubscriptionCallback<any>>> = new Map();
  private lastUpdateTimestamp: Date | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private ws: WebSocket | null = null;

  private constructor() {
    // Lazily initialized in browser environment
    if (typeof window !== "undefined") {
      this.initConnection();
    }
  }

  public static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  public getState(): RealtimeConnectionState {
    return this.state;
  }

  public getLastUpdate(): Date | null {
    return this.lastUpdateTimestamp;
  }

  public onStateChange(callback: (state: RealtimeConnectionState) => void): () => void {
    this.listeners.add(callback);
    callback(this.state);
    return () => this.listeners.delete(callback);
  }

  private setState(newState: RealtimeConnectionState) {
    this.state = newState;
    if (newState === "LIVE") {
      this.lastUpdateTimestamp = new Date();
    }
    this.listeners.forEach((listener) => listener(newState));
  }

  /**
   * Initializes real-time connection.
   * If real WS URL is provided in env, connects to WebSocket.
   * Otherwise establishes controlled simulated live connection for frontend validation.
   */
  public initConnection(customWsUrl?: string) {
    const wsUrl = customWsUrl || process.env.NEXT_PUBLIC_WS_URL;

    if (wsUrl && typeof WebSocket !== "undefined") {
      this.setState("CONNECTING");
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.setState("LIVE");
        };

        this.ws.onmessage = (event) => {
          try {
            const payload: RealtimeEventPayload = JSON.parse(event.data);
            this.broadcastEvent(payload);
          } catch (err) {
            console.error("Failed to parse incoming real-time payload", err);
          }
        };

        this.ws.onclose = () => {
          this.setState("OFFLINE");
          this.scheduleReconnect();
        };

        this.ws.onerror = () => {
          this.setState("RECONNECTING");
        };
      } catch (err) {
        this.setState("OFFLINE");
      }
    } else {
      // Offline/local testing live heartbeat simulation
      this.setState("CONNECTING");
      setTimeout(() => {
        this.setState("LIVE");
      }, 600);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.setState("RECONNECTING");
    this.reconnectTimer = setTimeout(() => {
      this.initConnection();
    }, 4000);
  }

  /**
   * Subscribe to specific real-time event topics
   * @param eventType e.g. "HACKATHON_UPDATED", "ALL"
   */
  public subscribe<T = unknown>(eventType: string, callback: RealtimeSubscriptionCallback<T>): () => void {
    if (!this.eventSubscribers.has(eventType)) {
      this.eventSubscribers.set(eventType, new Set());
    }
    this.eventSubscribers.get(eventType)!.add(callback);

    return () => {
      const subs = this.eventSubscribers.get(eventType);
      if (subs) {
        subs.delete(callback);
      }
    };
  }

  /**
   * Broadcast an event to all subscribers and update last updated timestamp
   */
  public broadcastEvent<T = unknown>(payload: RealtimeEventPayload<T>) {
    this.lastUpdateTimestamp = new Date();
    // Notify specific type subscribers
    const typeSubs = this.eventSubscribers.get(payload.type);
    if (typeSubs) {
      typeSubs.forEach((cb) => cb(payload));
    }
    // Notify wildcard subscribers
    const wildcardSubs = this.eventSubscribers.get("*");
    if (wildcardSubs) {
      wildcardSubs.forEach((cb) => cb(payload));
    }
  }

  /**
   * Trigger manual simulation event for testing UI reactivity
   */
  public simulateEvent(type: "STATUS_CHANGED" | "REGISTRATION_UPDATE" | "ANNOUNCEMENT_PUBLISHED", data: any) {
    const payload: RealtimeEventPayload = {
      id: `rt-sim-${Date.now()}`,
      type,
      entityType: "HACKATHON",
      entityId: data.hackathonId || "hack-rvce-2026",
      timestamp: new Date().toISOString(),
      data,
      message: data.message || `Simulated real-time update: ${type}`,
    };
    this.broadcastEvent(payload);
  }

  /**
   * Disconnect or toggle offline mode for testing
   */
  public setOffline() {
    if (this.ws) {
      this.ws.close();
    }
    this.setState("OFFLINE");
  }

  public reconnect() {
    this.initConnection();
  }
}

export const realtimeService = RealtimeManager.getInstance();
