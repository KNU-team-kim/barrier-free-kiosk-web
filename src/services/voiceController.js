// src/services/voiceController.js
import mcpWS from "./mcpWebSocketClient";
import { routeByStepName } from "./stepRouter";
import { injectByStepName } from "./formInjector";
import { useVoiceModeStore } from "../store/voiceModeStore";
import { use } from "react";

/**
 * VoiceController (최소 오케스트레이션)
 * - WS 연결 이벤트 구독
 * - 서버 메시지 수신 시: 라우팅 → 폼 주입 → 캡션 기록 → (옵션) TTS 큐
 * - 사용자 메시지 전송 헬퍼(sendUserMessage)
 *
 * 외부 주입:
 * - navigate: react-router의 navigate 함수
 * - enqueueTTS: TTS 엔진의 큐 적재 함수(옵션)
 */
const voiceController = (() => {
  let navigate = null;
  let enqueueTTS = null;
  let unsubs = [];

  function _onConnected() {
    const { enabled, setWSConnected, setWSReconnecting } =
      useVoiceModeStore.getState();
    if (!enabled) {
      console.log(
        "[VoiceController: _onConnected] connected but disabled. Disconnecting..."
      );
    }
    setWSConnected(true);
    setWSReconnecting(false);
  }

  function _onReconnecting({ delay }) {
    const { enabled, setWSReconnecting } = useVoiceModeStore.getState();
    if (!enabled) {
      console.log(
        "[VoiceController: _onReconnecting] reconnecting but disabled."
      );
    }
    setWSReconnecting(true);
    // 필요 시 delay 활용 로깅 가능
  }

  function _onDisconnected() {
    const { setWSConnected } = useVoiceModeStore.getState();
    setWSConnected(false);
  }

  function _onError(err) {
    // 최소: 콘솔만
    console.warn("[VoiceController] WS error:", err);
  }

  function _onMessage({ message, step_name, data }) {
    const { enabled, pushCaption } = useVoiceModeStore.getState();
    if (!enabled) {
      console.log(
        "[VoiceController] received message while disabled. Ignored."
      );
      return;
    }
    console.log("[VoiceController] _onMessage:", { message, step_name, data });

    // 1) 라우팅
    if (step_name && navigate) {
      console.log("[VoiceController] routing:", step_name);
      routeByStepName(navigate, step_name);
    }

    // 2) 폼 주입
    if (step_name && typeof data !== "undefined") {
      console.log("[VoiceController] injecting:", step_name, "=>", data);
      injectByStepName(step_name, data);
    }

    // 3) 캡션(시스템)
    pushCaption("system", message);

    // 4) (옵션) TTS 큐 적재
    if (typeof enqueueTTS === "function") {
      console.log("[VoiceController] enqueueTTS:", message);
      enqueueTTS(message);
    }
  }

  return {
    /**
     * 초기화: 이벤트 구독 및 연결 시작
     * @param {{ navigate: Function, enqueueTTS?: Function }} deps
     */
    init(deps = {}) {
      console.log("[VoiceController] init()");
      navigate = deps.navigate || null;
      enqueueTTS =
        typeof deps.enqueueTTS === "function" ? deps.enqueueTTS : null;

      // 이벤트 구독
      unsubs.push(mcpWS.on("connected", _onConnected));
      unsubs.push(mcpWS.on("reconnecting", _onReconnecting));
      unsubs.push(mcpWS.on("disconnected", _onDisconnected));
      unsubs.push(mcpWS.on("error", _onError));
      unsubs.push(mcpWS.on("message", _onMessage));

      // 연결 시작
      // mcpWS.connect();
    },

    // 음성모드 시작
    start() {
      const s = useVoiceModeStore.getState();
      if (!s.enabled) s.setEnabled(true);
      mcpWS.connect();
    },

    // 음성모드 정지
    stop() {
      const s = useVoiceModeStore.getState();
      s.setEnabled(false);
      try {
        mcpWS.disconnect();
      } catch (_) {}
    },

    /**
     * 정리: 이벤트 해제 및 연결 종료(옵션)
     */
    destroy({ disconnect = false } = {}) {
      unsubs.forEach((off) => {
        try {
          off();
        } catch (_) {}
      });
      unsubs = [];
      if (disconnect) mcpWS.disconnect();
      navigate = null;
      enqueueTTS = null;
    },

    /**
     * 외부에서 navigate 교체(라우터 재마운트 등 대비)
     */
    setNavigate(fn) {
      navigate = typeof fn === "function" ? fn : null;
    },

    /**
     * 외부에서 TTS 큐 주입기 교체
     */
    setEnqueueTTS(fn) {
      enqueueTTS = typeof fn === "function" ? fn : null;
    },

    /**
     * 사용자 메시지 전송 헬퍼
     * - 캡션에 사용자 발화 기록 후 WS로 전송
     */
    sendUserMessage(text) {
      const { enabled } = useVoiceModeStore.getState();
      if (!enabled) return;

      const t = String(text || "").trim();
      if (!t) return;
      console.log("[VoiceController] sendUserMessage →", t); // ★ 여기
      const { pushCaption } = useVoiceModeStore.getState();
      pushCaption("user", t);
      mcpWS.sendMessage(t);
    },
  };
})();

export default voiceController;
