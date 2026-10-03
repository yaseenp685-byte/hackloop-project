import { EventEmitter } from "events";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger/logger";

export type EventScope = "PUBLIC" | "ROLE_STUDENT" | "ROLE_ORGANIZER" | "ROLE_ADMIN" | "USER";

export interface SystemEvent<T = any> {
  id: string;
  type: string;
  entityType: string;
  entityId: string;
  scope: EventScope;
  targetUserId?: string;
  timestamp: string;
  payload: T;
}

class EventBusManager extends EventEmitter {
  private static instance: EventBusManager;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  public static getInstance(): EventBusManager {
    if (!EventBusManager.instance) {
      EventBusManager.instance = new EventBusManager();
    }
    return EventBusManager.instance;
  }

  /**
   * Publishes an event to both the persistent EventOutbox and active in-memory listeners
   * Flow requirement: Call this AFTER database commit succeeds!
   */
  public async publish<T = any>(params: {
    type: string;
    entityType: string;
    entityId: string;
    payload: T;
    scope?: EventScope;
    targetUserId?: string;
  }): Promise<SystemEvent<T>> {
    const event: SystemEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: params.type,
      entityType: params.entityType,
      entityId: params.entityId,
      scope: params.scope || "PUBLIC",
      targetUserId: params.targetUserId,
      timestamp: new Date().toISOString(),
      payload: params.payload,
    };

    try {
      // 1. Persist to outbox for audit and reliable delivery
      await prisma.eventOutbox.create({
        data: {
          id: event.id,
          eventType: event.type,
          entityType: event.entityType,
          entityId: event.entityId,
          payload: JSON.stringify(event.payload),
          status: "PROCESSED",
          scope: event.scope,
          processedAt: new Date(),
        },
      });
    } catch (err) {
      logger.warn("Could not write event to persistent outbox table", "EventBus", err);
    }

    // 2. Broadcast in-memory to active SSE stream connections
    this.emit("event", event);
    this.emit(event.type, event);

    logger.info(`Event published: [${event.type}] for ${event.entityType}#${event.entityId}`, "EventBus");
    return event;
  }
}

export const eventBus = EventBusManager.getInstance();
