import styled from "styled-components";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaMicrophone,
} from "react-icons/fa";
import { useVoiceModeStore } from "../../store/voiceModeStore";

export function ScreenDownPanel({ children }) {
  return <Panel>{children}</Panel>;
}

export function ScreenDown({ pressed, onClick, label = "낮은화면용 버튼" }) {
  const enabled = useVoiceModeStore((s) => s.enabled);
  const ttsSpeaking = useVoiceModeStore((s) => s.tts.speaking);
  const sttListening = useVoiceModeStore((s) => s.stt.listening);

  // TTS가 말하고 있으면 말할 수 없음 (cannotSpeak), STT가 듣고 있으면 말할 수 있음 (canSpeak)
  const canSpeak = sttListening && !ttsSpeaking;

  return (
    <BigButton
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      pressed={pressed}
      $hasVoiceMode={enabled}
    >
      {enabled ? (
        <>
          <LabelWrapper $pressed={pressed}>
            {pressed ? (
              <FaAngleDoubleUp size={36} />
            ) : (
              <FaAngleDoubleDown size={36} />
            )}
            {label}
            {pressed ? (
              <FaAngleDoubleUp size={36} />
            ) : (
              <FaAngleDoubleDown size={36} />
            )}
          </LabelWrapper>
          <MicIndicator $canSpeak={canSpeak}>
            <OuterCircle $canSpeak={canSpeak}>
              <InnerCircle $canSpeak={canSpeak}>
                <FaMicrophone size="40%" />
              </InnerCircle>
            </OuterCircle>
          </MicIndicator>
        </>
      ) : (
        <>
          {pressed ? (
            <FaAngleDoubleUp size={36} />
          ) : (
            <FaAngleDoubleDown size={36} />
          )}
          {label}
          {pressed ? (
            <FaAngleDoubleUp size={36} />
          ) : (
            <FaAngleDoubleDown size={36} />
          )}
        </>
      )}
    </BigButton>
  );
}

const Panel = styled.div`
  display: grid; /* 중앙 정렬용 */
`;

const BigButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 40px;
  font-weight: 500;
  border-radius: ${({ pressed }) =>
    pressed ? "0 0 30px 30px" : "30px 30px 0 0"};
  position: relative;
  flex-direction: ${({ $hasVoiceMode }) => ($hasVoiceMode ? "column" : "row")};
`;

const LabelWrapper = styled.div`
  position: absolute;
  ${({ $pressed }) => ($pressed ? "bottom: 60px;" : "top: 60px;")}
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MicIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterCircle = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ theme, $canSpeak }) =>
    $canSpeak ? theme.colors.canSpeakOuter : theme.colors.cannotSpeakOuter};
  border: 1px solid
    ${({ theme, $canSpeak }) =>
      $canSpeak
        ? theme.colors.canSpeakHighlight
        : theme.colors.cannotSpeakHighlight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerCircle = styled.div`
  width: 80%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ theme, $canSpeak }) =>
    $canSpeak ? theme.colors.canSpeakInner : theme.colors.cannotSpeakInner};
  border: 1px solid
    ${({ theme, $canSpeak }) =>
      $canSpeak
        ? theme.colors.canSpeakHighlight
        : theme.colors.cannotSpeakHighlight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $canSpeak }) =>
    $canSpeak
      ? theme.colors.canSpeakHighlight
      : theme.colors.cannotSpeakHighlight};
`;
