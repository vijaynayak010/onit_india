import { isTestModeEnabled } from "../test-mode/testModeConfig";

const DEFAULT_WS_URL = "wss://ohh9kczx4k.execute-api.ap-south-1.amazonaws.com/prod";

function uuidV4() {
  const browserCrypto = globalThis.crypto;
  if (typeof browserCrypto?.randomUUID === "function") {
    return browserCrypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof browserCrypto?.getRandomValues === "function") {
    browserCrypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return [...bytes]
    .map((byte, index) => `${[4, 6, 8, 10].includes(index) ? "-" : ""}${byte.toString(16).padStart(2, "0")}`)
    .join("");
}

function messageFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  const message = payload.message && typeof payload.message === "object"
    ? payload.message
    : payload;
  return message.id ? message : null;
}

class ChatRealtimeClient {
  socket = null;
  token = null;
  appType = "provider";
  connectPromise = null;
  reconnectTimer = null;
  reconnectAttempt = 0;
  intentionalClose = false;
  joinedConversations = new Set();
  pending = new Map();
  listeners = new Map();

  get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  subscribe(eventName, listener) {
    const listeners = this.listeners.get(eventName) || new Set();
    listeners.add(listener);
    this.listeners.set(eventName, listeners);
    return () => listeners.delete(listener);
  }

  emitLocal(eventName, payload) {
    this.listeners.get(eventName)?.forEach((listener) => listener(payload));
  }

  async connect({ token, appType = "provider" }) {
    if (isTestModeEnabled()) {
      this.token = token || 'mock_ws_token';
      this.appType = appType;
      this.connectPromise = Promise.resolve();
      return this.connectPromise;
    }
    if (!token) throw new Error("Missing chat WebSocket token");
    if (this.isConnected && this.token === token && this.appType === appType) return;
    if (this.connectPromise && this.token === token && this.appType === appType) {
      return this.connectPromise;
    }

    this.intentionalClose = false;
    if (this.socket) this.socket.close();
    this.token = token;
    this.appType = appType;

    const baseUrl = import.meta.env.VITE_WS_URL || DEFAULT_WS_URL;
    const url = new URL(baseUrl);
    url.searchParams.set("token", token);
    url.searchParams.set("appType", appType);

    this.connectPromise = new Promise((resolve, reject) => {
      const socket = new WebSocket(url.toString());
      this.socket = socket;

      const timeout = window.setTimeout(() => {
        socket.close();
        reject(new Error("Chat WebSocket connection timed out"));
      }, 10000);

      socket.addEventListener("open", () => {
        window.clearTimeout(timeout);
        this.connectPromise = null;
        this.reconnectAttempt = 0;
        this.joinedConversations.forEach((conversationId) => {
          this.sendRaw({ action: "conversation.join", conversationId });
        });
        this.emitLocal("socket.connected");
        resolve();
      }, { once: true });

      socket.addEventListener("message", (event) => this.handleMessage(event.data));
      socket.addEventListener("error", () => {
        if (socket.readyState !== WebSocket.OPEN) {
          window.clearTimeout(timeout);
          this.connectPromise = null;
          reject(new Error("Chat WebSocket connection failed"));
        }
      });
      socket.addEventListener("close", () => {
        window.clearTimeout(timeout);
        const wasCurrentSocket = this.socket === socket;
        if (!wasCurrentSocket) return;
        this.connectPromise = null;
        this.socket = null;
        this.rejectPending(new Error("Chat WebSocket disconnected"));
        this.emitLocal("socket.disconnected");
        if (!this.intentionalClose) this.scheduleReconnect();
      });
    });

    return this.connectPromise;
  }

  scheduleReconnect() {
    window.clearTimeout(this.reconnectTimer);
    const baseDelay = Math.min(30000, 1000 * (2 ** this.reconnectAttempt));
    const delay = baseDelay + Math.floor(Math.random() * 500);
    this.reconnectAttempt += 1;
    this.reconnectTimer = window.setTimeout(() => {
      if (!this.token) return;
      this.connect({ token: this.token, appType: this.appType }).catch(() => {});
    }, delay);
  }

  handleMessage(raw) {
    let envelope;
    try {
      envelope = JSON.parse(raw);
    } catch {
      return;
    }

    const { event, data, ackId } = envelope;
    if (ackId && this.pending.has(ackId)) {
      const pending = this.pending.get(ackId);
      this.pending.delete(ackId);
      window.clearTimeout(pending.timeout);
      if (event === "error") {
        const error = new Error(data?.message || "Chat request failed");
        error.code = data?.code;
        error.retryable = data?.retryable === true;
        pending.reject(error);
      } else {
        pending.resolve(data);
      }
      return;
    }

    if (event) this.emitLocal(event, data);
  }

  sendRaw(payload) {
    if (!this.isConnected) throw new Error("Chat WebSocket is not connected");
    this.socket.send(JSON.stringify(payload));
  }

  request(action, payload, timeoutMs = 8000) {
    const ackId = `req_${uuidV4()}`;
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pending.delete(ackId);
        reject(new Error(`Chat request timed out: ${action}`));
      }, timeoutMs);
      this.pending.set(ackId, { resolve, reject, timeout });
      try {
        this.sendRaw({ action, ackId, ...payload });
      } catch (error) {
        window.clearTimeout(timeout);
        this.pending.delete(ackId);
        reject(error);
      }
    });
  }

  joinConversation(conversationId) {
    if (!conversationId) return;
    const id = String(conversationId);
    const wasAlreadyJoined = this.joinedConversations.has(id);
    this.joinedConversations.add(id);
    if (this.isConnected && !wasAlreadyJoined) {
      this.sendRaw({ action: "conversation.join", conversationId });
    }
  }

  leaveConversation(conversationId) {
    if (!conversationId) return;
    this.joinedConversations.delete(String(conversationId));
    if (this.isConnected) {
      this.sendRaw({ action: "conversation.leave", conversationId });
    }
  }

  async sendMessage({ conversationId, content, fileId, clientMessageId }) {
    const id = clientMessageId || uuidV4();
    const response = await this.request("message.send", {
      conversationId,
      content,
      clientMessageId: id,
      ...(fileId ? { fileId } : {}),
    });
    return messageFromPayload(response);
  }

  markDelivered(conversationId, deliveredUpToMessageId) {
    return this.request("message.delivered", { conversationId, deliveredUpToMessageId }, 5000);
  }

  markRead(conversationId, readUpToMessageId) {
    return this.request("message.read", {
      conversationId,
      ...(readUpToMessageId ? { readUpToMessageId } : {}),
    }, 5000);
  }

  rejectPending(error) {
    this.pending.forEach(({ reject, timeout }) => {
      window.clearTimeout(timeout);
      reject(error);
    });
    this.pending.clear();
  }

  disconnect() {
    this.intentionalClose = true;
    window.clearTimeout(this.reconnectTimer);
    this.rejectPending(new Error("Chat WebSocket disconnected"));
    this.socket?.close();
    this.socket = null;
    this.token = null;
  }
}

export const chatRealtime = new ChatRealtimeClient();
export const createChatClientMessageId = uuidV4;
export { messageFromPayload };
