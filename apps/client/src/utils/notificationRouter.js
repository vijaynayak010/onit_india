/**
 * notificationRouter.js
 *
 * Resolves the navigation route when a notification is tapped.
 * Uses Method 3 (payload metadata) + Method 5 (config routing table).
 *
 * Entity extraction order (from notification_doc_shreya_4june2026.md):
 *   taskId       → most task services (Services 4–13, 15–16)
 *   assignmentId → execution services (Services 8–12) — resolved to taskId for routing
 *   interestId   → interest flow (Services 5–6) — resolved to taskId for routing
 *   conversationId → chat service (Service 14)
 *   transactionId  → wallet/payment service (Service 18)
 */

import {
  NOTIFICATION_ROUTE_MAP,
  NOTIFICATION_FALLBACK_ROUTE,
} from "../config/notificationRoutes";

/**
 * Extract routing entities from the notification payload.
 * Handles multiple payload shapes defensively (backend may nest differently).
 */
function asRecord(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "") || null;
}

function extractEntities(notification) {
  const p = asRecord(notification.payload);
  const data = asRecord(notification.data);
  const metadata = asRecord(p.metadata || data.metadata);
  const nestedNotification = asRecord(p.notification || data.notification);

  return {
    // Primary routing entity — present in Services 4–13, 15–16
    taskId: firstDefined(
      p.taskId,
      data.taskId,
      metadata.taskId,
      nestedNotification.taskId,
      p.task?.id,
      data.task?.id,
      p.taskAssignment?.taskId,
      data.taskAssignment?.taskId,
      p.assignment?.taskId,
      data.assignment?.taskId,
    ),

    // Execution-phase entity — Services 8–12
    // Note: assignmentId maps to active-task page using taskId, not assignmentId
    assignmentId: firstDefined(p.assignmentId, data.assignmentId, metadata.assignmentId, p.assignment?.id, data.assignment?.id),

    // Interest flow entity — Services 5–6
    // Note: interestId in request; taskId used for routing destination
    interestId: firstDefined(p.interestId, data.interestId, metadata.interestId, p.interest?.id, data.interest?.id),

    // Chat entity — Service 14
    conversationId: firstDefined(p.conversationId, data.conversationId, metadata.conversationId, p.conversation?.id, data.conversation?.id),

    // Payment entity — Service 18
    transactionId: firstDefined(p.transactionId, data.transactionId, metadata.transactionId, p.transaction?.id, data.transaction?.id),
  };
}

/**
 * Inject extracted entities into a route path template.
 * e.g. "/:role/active-task/:taskId" → "/provider/active-task/task_abc123"
 */
function buildRoute(pathTemplate, paramKeys, entities, role, roleOverride) {
  const resolvedRole = roleOverride || role;
  let path = pathTemplate.replace(":role", resolvedRole);

  for (const key of paramKeys) {
    const value = entities[key];
    if (!value) {
      // Required entity missing in payload — fall back to dashboard
      console.warn(
        `[NotificationRouter] Payload missing entity "${key}" for route "${pathTemplate}". ` +
        `Check if backend is sending this in notification payload.`
      );
      return `/${resolvedRole}/dashboard`;
    }
    path = path.replace(`:${key}`, value);
  }

  return path;
}

/**
 * Main resolver — call this when a notification is tapped.
 *
 * @param {object} notification  Full notification object from API/socket
 * @param {string} userRole      user.role from AuthContext ("PROVIDER" | "PERFORMER")
 * @returns {string}             Final route to navigate to
 *
 * @example
 * const route = resolveNotificationRoute(notification, user.role);
 * navigate(route);
 */
export function resolveNotificationRoute(notification, userRole) {
  if (!notification) return "/";

  const role = String(userRole || "").toUpperCase() === "PROVIDER" ? "provider" : "performer";
  const type = String(notification.type || "").toUpperCase().trim();
  const entities = extractEntities(notification);

  // Step 1: Exact type match in config
  const config = NOTIFICATION_ROUTE_MAP[type];
  if (config) {
    return buildRoute(config.path, config.params, entities, role, config.roleOverride);
  }

  // Step 2: No config match — smart fallback using available entities
  // (handles future backend types not yet in config)
  if (entities.taskId) {
    console.warn(`[NotificationRouter] Unknown type "${type}" — using taskId fallback.`);
    return `/${role}/active-task/${entities.taskId}`;
  }
  if (entities.conversationId) {
    console.warn(`[NotificationRouter] Unknown type "${type}" — using conversationId fallback.`);
    return `/${role}/chats`;
  }
  if (entities.transactionId) {
    console.warn(`[NotificationRouter] Unknown type "${type}" — using transactionId fallback.`);
    return `/${role}/wallet`;
  }

  // Step 3: Nothing matched — go to dashboard
  console.warn(`[NotificationRouter] No route for type "${type}". Add it to notificationRoutes.js`);
  return NOTIFICATION_FALLBACK_ROUTE.replace(":role", role);
}
