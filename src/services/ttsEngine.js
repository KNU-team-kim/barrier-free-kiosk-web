// src/services/ttsEngine.js
import { useVoiceModeStore } from "../store/voiceModeStore";

/**
 * 간단 TTS 엔진 (speechSynthesis)
 * - FIFO 큐로 순차 재생
 * - speaking/queueLength 상태는 voiceModeStore로 동기화
 */
const tts = (() => {
  const synth = window.speechSynthesis;
  const state = {
    queue: [],
    opts: { lang: "ko-KR", rate: 1, pitch: 1, volume: 1 },
    playing: false,
  };

  function _updateStore() {
    const { setTTSSpeaking, setTTSQueueLength } = useVoiceModeStore.getState();
    setTTSSpeaking(state.playing);
    setTTSQueueLength(state.queue.length);
  }

  async function _playNext() {
    if (!synth) return;
    if (state.playing) return;
    const text = state.queue.shift();
    _updateStore();
    if (!text) return;

    try {
      const stt = (await import("./sttEngine")).default;
      stt.stop();
      console.log("[TTS] speaking started → STT stopped");
    } catch (e) {
      console.warn("[TTS] failed to stop STT:", e);
    }
    console.log("[TTS] playNext:", text);

    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = state.opts.lang;
    u.rate = state.opts.rate;
    u.pitch = state.opts.pitch;
    u.volume = state.opts.volume;

    state.playing = true;
    _updateStore();

    u.onend = () => {
      state.playing = false;
      _updateStore();

      setTimeout(async () => {
        try {
          const stt = (await import("./sttEngine")).default;
          stt.start();
          console.log("[TTS] finished speaking → STT restarted");
        } catch (e) {
          console.warn("[TTS] failed to restart STT:", e);
        }
      }, 500); // 0.5초 지연 (필요 시 조정)

      // 다음 항목 자동 재생
      _playNext();
    };
    u.onerror = () => {
      state.playing = false;
      _updateStore();
      _playNext();
    };

    console.log("[TTS] speak()");
    synth.speak(u);
  }

  return {
    /** 큐에 추가 후 필요 시 재생 시작 */
    enqueue(text) {
      const { enabled } = useVoiceModeStore.getState();
      if (!enabled) {
        console.log("[TTS: enqueue] enqueue ignored, voice mode disabled");
        return;
      }
      console.log("[TTS] enqueue:", text);
      if (!text) return;
      state.queue.push(String(text));
      _updateStore();
      _playNext();
    },

    /** 즉시 모두 중지 및 큐 비우기 */
    stopAll() {
      try {
        window.speechSynthesis?.cancel();
      } catch (_) {}
      state.queue = [];
      state.playing = false;
      _updateStore();
    },

    /** 음성 옵션 설정: { lang, rate, pitch, volume } */
    setOptions(opts = {}) {
      state.opts = { ...state.opts, ...opts };
    },

    /** 현재 큐 길이 반환(편의) */
    size() {
      return state.queue.length;
    },
  };
})();

export default tts;
