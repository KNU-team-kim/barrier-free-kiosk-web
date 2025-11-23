import mcpWS from "./mcpWebSocketClient";
import { routeByStepName, getPathByStepName } from "./stepRouter";
import {
  injectMoveInByStepName,
  injectRegiCertByStepName,
} from "./formInjector";
import { useVoiceModeStore } from "../store/voiceModeStore";

const FOCUS_TARGET_MAP = {
  // move-in step 1
  name: "movein.name",
  phone_number: "movein.phone_number",

  // move-in step3
  before_sido: "movein.before_sido",
  before_sigungu: "movein.before_sigungu",

  // move-in step4
  after_sido: "movein.after_sido",
  after_sigungu: "movein.after_sigungu",
  after_road_name: "movein.after_road_name",
  after_building_type: "movein.after_building_type",
  after_building_number_main: "movein.after_building_number_main",
  after_building_number_sub: "movein.after_building_number_sub",
  after_detail_address: "movein.after_detail_address",
  after_sedaeju: "movein.after_sedaeju",

  // regi-cert step 1
  registration_number: "regi.registration_number",
};

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

  const { setFocusTarget } = useVoiceModeStore.getState();

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

  function _onReconnecting() {
    const { enabled, setWSReconnecting } = useVoiceModeStore.getState();
    if (!enabled) {
      console.log(
        "[VoiceController: _onReconnecting] reconnecting but disabled."
      );
    }
    setWSReconnecting(true);
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

    let path = null;
    if (step_name) {
      path = getPathByStepName(step_name);
    }

    // 1) 라우팅
    if (step_name && navigate && path) {
      console.log("[VoiceController] routing:", step_name);
      routeByStepName(navigate, step_name);
    }

    // 포커스 타겟 설정 (컴포넌트 마운트를 위해 지연)
    // Todo: 컴포넌트 마운트 타이밍 이슈로 인해, setTimeout을 사용함으로써 해결. 추후 자세히 정리하기
    const focusTarget =
      FOCUS_TARGET_MAP[String(step_name).trim().toLowerCase()];
    if (focusTarget) {
      console.log("[VoiceController] setFocusTarget:", focusTarget);
      // 라우팅이 발생한 경우 컴포넌트 마운트를 위해 약간 지연
      if (step_name && navigate && path) {
        // React Router의 navigate는 비동기이므로 다음 렌더 사이클까지 대기
        setTimeout(() => {
          setFocusTarget(focusTarget);
        }, 100);
      } else {
        // 이미 같은 페이지에 있는 경우 즉시 설정
        setFocusTarget(focusTarget);
      }
    }

    // 2) 폼 주입
    if (step_name && typeof data !== "undefined" && path) {
      if (path.startsWith("/move-in/")) {
        console.log(
          "[VoiceController] injecting(move-in):",
          step_name,
          "=>",
          data
        );
        injectMoveInByStepName(step_name, data);
      } else if (path.startsWith("/regi-cert/")) {
        console.log(
          "[VoiceController] injecting(regi-cert):",
          step_name,
          "=>",
          data
        );
        injectRegiCertByStepName(step_name, data);
      }
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
    },

    // 음성모드 시작
    start() {
      const s = useVoiceModeStore.getState();
      if (!s.enabled) s.setEnabled(true);
      mcpWS.connect();
    },

    // 음성모드 정지
    async stop() {
      const s = useVoiceModeStore.getState();
      s.setEnabled(false);

      // STT 중지
      try {
        const stt = (await import("./sttEngine")).default;
        stt.stop();
        console.log("[VoiceController] STT stopped");
      } catch (e) {
        console.warn("[VoiceController] failed to stop STT:", e);
      }

      // TTS 중지 및 큐 비우기
      try {
        const tts = (await import("./ttsEngine")).default;
        tts.stopAll();
        console.log("[VoiceController] TTS stopped");
      } catch (e) {
        console.warn("[VoiceController] failed to stop TTS:", e);
      }

      // WebSocket 연결 종료
      try {
        mcpWS.disconnect();
        console.log("[VoiceController] WebSocket disconnected");
      } catch {
        // Ignore disconnect errors
      }
    },

    /**
     * 정리: 이벤트 해제 및 연결 종료(옵션)
     */
    destroy({ disconnect = false } = {}) {
      unsubs.forEach((off) => {
        try {
          off();
        } catch {
          // Ignore unsubscribe errors
        }
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
