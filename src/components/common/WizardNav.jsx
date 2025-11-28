import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { useVoiceModeStore } from "../../store/voiceModeStore";
import voiceController from "../../services/voiceController";

export default function WizardNav({ onPrev, onNext, onComplete }) {
  const enabled = useVoiceModeStore((s) => s.enabled);

  const handleVoiceExit = () => {
    console.log("[WizardNav] Stopping Voice Mode...");
    voiceController.stop();
  };

  return (
    <NavWrap>
      {enabled && (
        <VoiceExitButton
          type="button"
          onClick={handleVoiceExit}
          aria-label="음성 모드 종료"
        >
          <span>음성 종료</span>
        </VoiceExitButton>
      )}
      <NavButtons>
        <Link to="/" aria-label="홈으로">
          <HomeButton type="button">홈</HomeButton>
        </Link>
        {onPrev ? (
          <PrimaryButton
            type="button"
            onClick={onPrev}
            aria-label="이전 단계로"
          >
            <FaAngleLeft aria-hidden="true" />
            <span>이전</span>
          </PrimaryButton>
        ) : (
          <></>
        )}
        {onNext ? (
          <PrimaryButton
            type="button"
            onClick={onNext}
            aria-label="다음 단계로"
          >
            <span>다음</span>
            <FaAngleRight aria-hidden="true" />
          </PrimaryButton>
        ) : (
          <></>
        )}
        {onComplete ? (
          <CompleteButton type="button" onClick={onComplete} aria-label="완료">
            <span>완료</span>
            <FaCheck aria-hidden="true" />
          </CompleteButton>
        ) : (
          <></>
        )}
      </NavButtons>
    </NavWrap>
  );
}

const NavWrap = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap; // 공간이 부족할 때 자동으로 줄바꿈
  width: 100%;
  min-width: 0;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  min-width: 0;
  margin-left: auto; /* 오른쪽으로 정렬 */
`;

const HomeButton = styled.button`
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  font-size: clamp(38px, 1.8vw, 42px);
  font-weight: 400;

  background: transparent;
  color: ${({ theme }) => theme.colors.textContent};
  border: 1px solid ${({ theme }) => theme.colors.highlightSub};
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  border: none;
  font-weight: 400;
  font-size: clamp(38px, 1.8vw, 42px);

  background: ${({ theme }) => theme.colors.highlightSub};
  color: ${({ theme }) => theme.colors.textHighlight};
`;

const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  border: none;
  font-weight: 400;
  font-size: clamp(38px, 1.8vw, 42px);

  background: ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.textHighlight};
`;

const VoiceExitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  border: none;
  font-weight: 400;
  font-size: clamp(38px, 1.8vw, 42px);
  background: ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.textHighlight};
`;
