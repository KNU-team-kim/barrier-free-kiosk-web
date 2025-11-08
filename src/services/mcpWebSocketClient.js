// src/services/mcpWebSocketClient.js

// 사용 예시(요약):
// import mcpWS from "./mcpWebSocketClient";
// mcpWS.on("connected", () => console.log("WS connected"));
// mcpWS.on("message", (msg) => console.log("server:", msg));
// mcpWS.connect();
// mcpWS.sendMessage("안녕하세요");

const WS_URL = import.meta.env.VITE_MCP_WS_URL;

/**
 * 이벤트 버스 (간단한 on/off/emit)
 */
class Emitter {
  constructor() {
    this.handlers = new Map(); // event -> Set<fn>
  }
  on(event, fn) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event).add(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    const set = this.handlers.get(event);
    if (!set) return;
    set.delete(fn);
  }
  emit(event, payload) {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const fn of set) fn(payload);
  }
}

/**
 * MCP WebSocket 클라이언트
 * - 재연결(지수 백오프)
 * - 연결 전/중단 중 송신 큐
 * - 이벤트: connected / disconnected / reconnecting / reconnected / error / message / raw
 * - 송신: { message: "<텍스트>" }
 * - 수신: { message: string, step_name?: string, data?: any }
 */
class MCPWebSocketClient {
  constructor(url, options = {}) {
    this.url = url || WS_URL;
    this.emitter = new Emitter();
    this.ws = null;
    console.log("[MCPWebSocketClient] URL:", this.url);

    // 재연결 옵션
    this.enableReconnect = options.reconnect !== false;
    this.backoff = 1000; // 1s
    this.maxBackoff = options.maxBackoff || 15000; // 15s
    this._manuallyClosed = false;

    // 송신 큐 (연결 전/중단 시 보관)
    this.outbox = [];

    // 가시성 변화에 따라 재연결(옵션)
    this._handleVisibility = this._handleVisibility.bind(this);
    document.addEventListener("visibilitychange", this._handleVisibility);
  }

  on(event, fn) {
    return this.emitter.on(event, fn);
  }
  off(event, fn) {
    this.emitter.off(event, fn);
  }

  connect() {
    console.log("[MCPWebSocketClient] connect()");
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      console.log("[MCPWebSocketClient] already connected or connecting");
      return; // 이미 연결 중
    }
    this._manuallyClosed = false;

    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      this.emitter.emit("error", err);
      if (this.enableReconnect) this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log(
        "[MCPWebSocketClient] onopen, readyState=",
        this.ws.readyState
      );
      const firstConnect = this.backoff === 1000; // 초기값이면 사실상 첫 연결로 간주
      const wasReconnecting = !firstConnect && !this._manuallyClosed;

      // 백오프 리셋
      this.backoff = 1000;

      // 큐 비우기
      this._flushOutbox();

      this.emitter.emit("connected");
      if (wasReconnecting) this.emitter.emit("reconnected");
    };

    this.ws.onmessage = (evt) => {
      // 원본(raw) 먼저 알림 (디버깅용)
      this.emitter.emit("raw", evt.data);

      let payload = null;
      try {
        console.log("[WS] Received message:", evt.data);
        payload = JSON.parse(evt.data);
      } catch {
        // 서버가 text/plain을 보낼 수도 있으므로 안전히 처리
        payload = { message: String(evt.data) };
      }

      // 기대 포맷: { message: string, step_name?: string, data?: any }
      // message는 필수로 간주(계약)
      if (!payload || typeof payload.message !== "string") {
        // 계약 위반이더라도 raw로 디버깅 가능
        this.emitter.emit(
          "error",
          new Error("Invalid payload from MCP Server")
        );
        return;
      }

      console.log("[WS] parsed =", payload);
      this.emitter.emit("message", {
        message: payload.message,
        step_name: payload.step_name || null,
        data: payload.hasOwnProperty("data") ? payload.data : undefined,
        _raw: payload,
      });
    };

    this.ws.onerror = (err) => {
      console.error("[WS] onerror:", err);
      this.emitter.emit("error", err);
    };

    this.ws.onclose = (ev) => {
      console.warn("[WS] onclose code=", ev.code, "reason=", ev.reason);
      this.emitter.emit("disconnected");
      if (!this._manuallyClosed && this.enableReconnect) {
        this._scheduleReconnect();
      }
    };
  }

  disconnect() {
    this._manuallyClosed = true;
    try {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      }
    } catch (e) {
      // ignore
    }
    this.ws = null;
  }

  /**
   * 메시지 전송: { message: "<텍스트>" }
   * - 연결 전/재연결 중이면 큐에 적재
   */
  sendMessage(text) {
    const payload = { message: String(text ?? "") };
    console.log("[WS] sendMessage:", payload);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (e) {
        // 전송 실패 시 큐에 적재 후 재연결 시도
        this.outbox.push(payload);
        this.emitter.emit("error", e);
        if (this.enableReconnect) this._scheduleReconnect();
      }
    } else {
      this.outbox.push(payload);
      if (!this.ws && this.enableReconnect && !this._manuallyClosed) {
        // 끊겨 있으면 연결 시도
        this.connect();
      }
    }
  }

  /**
   * 연결 완료 시 큐 비우기
   */
  _flushOutbox() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    while (this.outbox.length) {
      const item = this.outbox.shift();
      try {
        this.ws.send(JSON.stringify(item));
      } catch (e) {
        this.emitter.emit("error", e);
        // 실패 시 다시 큐에 넣고 종료 (다음 재연결 때 재시도)
        this.outbox.unshift(item);
        break;
      }
    }
  }

  /**
   * 지수 백오프 재연결
   */
  _scheduleReconnect() {
    const delay = Math.min(this.backoff, this.maxBackoff);
    this.emitter.emit("reconnecting", { delay });

    setTimeout(() => {
      if (this._manuallyClosed) return;
      // 백오프 증가
      this.backoff = Math.min(this.backoff * 2, this.maxBackoff);
      this.connect();
    }, delay);
  }

  /**
   * 탭이 다시 활성화될 때 재연결 시도(선택 동작)
   */
  _handleVisibility() {
    if (document.visibilityState === "visible") {
      // 끊겨있으면 붙여본다
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        if (!this._manuallyClosed && this.enableReconnect) {
          this.connect();
        }
      }
    }
  }
}

// 싱글톤로 사용 권장(앱 내 단일 WS 세션)
const mcpWS = new MCPWebSocketClient(WS_URL, {
  reconnect: true,
  maxBackoff: 15000,
});

export default mcpWS;
