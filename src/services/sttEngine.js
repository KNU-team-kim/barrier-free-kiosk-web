// src/services/sttEngine.js
import { useVoiceModeStore } from "../store/voiceModeStore";

/**
 * 간단 STT 엔진 (webkitSpeechRecognition 래퍼)
 * - interim/final 분리
 * - onFinal/onInterim 콜백으로 외부 통지
 * - 자동 재시작 없음(필요 시 VoiceController에서 정책 결정)
 */
const stt = (() => {
  const Recog = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null;

  // 외부 콜백
  let onFinal = null;
  let onInterim = null;

  function _setListening(v) {
    const { setSTTListening } = useVoiceModeStore.getState();
    setSTTListening(!!v);
  }
  function _setInterim(text) {
    const { setSTTInterim } = useVoiceModeStore.getState();
    setSTTInterim(text);
    if (typeof onInterim === "function") onInterim(text);
  }
  function _setFinal(text) {
    const { setSTTFinal, clearSTT } = useVoiceModeStore.getState();
    setSTTFinal(text);
    if (typeof onFinal === "function") onFinal(text);
    // final 사용처(WS 전송 등)에서 처리 후 필요 시 초기화
    setTimeout(() => clearSTT(), 0);
  }

  function _ensure() {
    if (!Recog) return null;
    if (recog) return recog;
    recog = new Recog();
    recog.lang = "ko-KR";
    recog.continuous = true;
    recog.interimResults = true;

    recog.onstart = () => {
      console.log("[STT] onstart");
      _setListening(true);
    };
    recog.onend = () => {
      console.log("[STT] onend");
      _setListening(false);
    };
    recog.onerror = (e) => {
      console.error("[STT] onerror:", e);
      _setListening(false);
    };

    recog.onresult = (e) => {
      let interim = "",
        finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0]?.transcript || "";
        if (res.isFinal) finalText += t;
        else interim += t;
      }
      if (interim) {
        console.log("[STT] interim:", interim.trim());
        _setInterim(interim.trim());
      }
      if (finalText) {
        console.log("[STT] final:", finalText.trim());
        _setFinal(finalText.trim());
      }
    };

    return recog;
  }

  return {
    isSupported() {
      return !!Recog;
    },

    /** 콜백 설정: { onFinal(text), onInterim(text) } */
    setHandlers(handlers = {}) {
      onFinal =
        typeof handlers.onFinal === "function" ? handlers.onFinal : null;
      onInterim =
        typeof handlers.onInterim === "function" ? handlers.onInterim : null;
    },

    start() {
      const r = _ensure();
      if (!r) return false;
      try {
        r.start();
        return true;
      } catch {
        return false;
      }
    },

    stop() {
      if (!recog) return;
      try {
        recog.stop();
      } catch (_) {}
    },

    /** 언어 변경(옵션) */
    setLang(lang = "ko-KR") {
      const r = _ensure();
      if (r) r.lang = lang;
    },
  };
})();

export default stt;
