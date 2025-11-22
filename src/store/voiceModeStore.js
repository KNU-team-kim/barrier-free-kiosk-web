// src/store/voiceModeStore.js
import { create } from "zustand";

/**
 * 음성모드 전역 상태 (필수 최소 구성)
 * - enabled: 음성모드 켜짐/꺼짐
 * - ws: WebSocket 연결 상태
 * - stt: STT 진행 상태 (interim/final)
 * - tts: TTS 진행 상태 (큐 길이/발화 중 여부)
 * - captions: 화면 자막 로그 [{ role: 'user'|'system', text, ts }]
 */
export const useVoiceModeStore = create((set, get) => ({
  // --- Core states ---
  enabled: false,

  ws: {
    connected: false,
    reconnecting: false,
  },

  stt: {
    listening: false,
    interim: "",
    final: "",
  },

  tts: {
    speaking: false,
    queueLength: 0,
  },

  captions: [],

  focusTarget: null,

  // --- Actions: Voice Mode ---
  setEnabled: (v) => set({ enabled: !!v }),
  toggleEnabled: () => set((s) => ({ enabled: !s.enabled })),

  // --- Actions: WS ---
  setWSConnected: (connected) =>
    set((s) => ({ ws: { ...s.ws, connected: !!connected } })),
  setWSReconnecting: (reconnecting) =>
    set((s) => ({ ws: { ...s.ws, reconnecting: !!reconnecting } })),

  // --- Actions: STT ---
  setSTTListening: (v) => set((s) => ({ stt: { ...s.stt, listening: !!v } })),
  setSTTInterim: (text) =>
    set((s) => ({ stt: { ...s.stt, interim: String(text || "") } })),
  setSTTFinal: (text) =>
    set((s) => ({ stt: { ...s.stt, final: String(text || "") } })),
  clearSTT: () => set((s) => ({ stt: { ...s.stt, interim: "", final: "" } })),

  // --- Actions: TTS ---
  setTTSSpeaking: (v) => set((s) => ({ tts: { ...s.tts, speaking: !!v } })),
  setTTSQueueLength: (n) =>
    set((s) => ({
      tts: { ...s.tts, queueLength: Math.max(0, Number(n) || 0) },
    })),

  // --- Actions: Captions ---
  pushCaption: (role, text) =>
    set((s) => ({
      captions: [
        ...s.captions,
        {
          role: role === "user" ? "user" : "system",
          text: String(text || ""),
          ts: Date.now(),
        },
      ].slice(-200), // 메모리 보호: 최근 200개만 유지
    })),
  clearCaptions: () => set({ captions: [] }),

  // --- Actions: Focus ---
  setFocusTarget: (target) => set({ focusTarget: target || null }),
  clearFocusTarget: () => set({ focusTarget: null }),

  // --- Utils ---
  resetVoiceState: () =>
    set({
      enabled: false,
      ws: { connected: false, reconnecting: false },
      stt: { listening: false, interim: "", final: "" },
      tts: { speaking: false, queueLength: 0 },
      captions: [],
      focusTarget: null,
    }),
}));
