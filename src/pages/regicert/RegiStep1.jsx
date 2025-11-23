import { useNavigate } from "react-router-dom";
import ProcessLayout from "../../layouts/ProcessLayout";
import { MOVEIN_STEPS } from "../../features/regicert/config";
import styled from "styled-components";
import { useRegiCertStore } from "../../store/regiCertStore";
import NumberInput from "../../components/inputs/NumberInput";
import NumericPad from "../../components/inputs/NumericPad";
import { useEffect, useRef } from "react";
import { checkRegistration } from "../../api/resident";
import { useVoiceModeStore } from "../../store/voiceModeStore";
import voiceController from "../../services/voiceController";

export default function RegiStep1() {
  const navigate = useNavigate();
  const { data, setField, getFullID } = useRegiCertStore();

  const onNext = async () => {
    if (voiceEnabled) {
      const fullID = getFullID();
      voiceController.sendUserMessage(fullID);
    } else {
      const data = await checkValidID();
      if (data) {
        navigate("../step-2");
      } else {
        alert("유효하지 않은 주민등록번호입니다. 다시 확인해 주세요.");
      }
    }
  };

  const checkValidID = async () => {
    const fullID = getFullID();
    const data = await checkRegistration({ registrationNumber: fullID });
    return data;
  };

  const frontRef = useRef(null);
  const backRef = useRef(null);

  const voiceEnabled = useVoiceModeStore((s) => s.enabled);
  const lockSTT = useVoiceModeStore((s) => s.lockSTT);
  const unlockSTT = useVoiceModeStore((s) => s.unlockSTT);

  const focusTarget = useVoiceModeStore((s) => s.focusTarget);
  const clearFocusTarget = useVoiceModeStore((s) => s.clearFocusTarget);

  useEffect(() => {
    if (!voiceEnabled) return;
    lockSTT();
    // VoiceController에서 registration_number 스텝일 때
    // focusTarget을 'regi.registration_number'로 세팅해줬으므로,
    // 그 신호를 보고 앞자리 input에 포커스
    if (focusTarget === "regi.registration_number") {
      // ref가 준비될 때까지 재시도하는 함수 (최대 3번)
      const attemptFocus = (ref, maxAttempts = 3, delay = 50) => {
        let attempts = 0;
        const tryFocus = () => {
          if (ref.current) {
            ref.current.focus();
            clearFocusTarget(); // 포커스 성공 후에 clearFocusTarget 호출
            return true;
          }
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(tryFocus, delay);
          } else {
            // 최대 재시도 횟수 도달 시에도 clearFocusTarget 호출
            clearFocusTarget();
          }
          return false;
        };
        tryFocus();
      };
      attemptFocus(frontRef);
    }

    return () => {
      unlockSTT();
    };
  }, [focusTarget, clearFocusTarget, lockSTT, unlockSTT, voiceEnabled]);

  const focusByTotalLen = (totalLen) => {
    if (totalLen <= 5) {
      frontRef.current?.focus();
    } else {
      backRef.current?.focus();
    }
  };

  const handleInput = (digit) => {
    const full = (data.idFront || "") + (data.idBack || "");
    if (full.length >= 13) return;

    const next = (full + digit).slice(0, 13);
    const nextFront = next.slice(0, 6);
    const nextBack = next.slice(6);

    setField("idFront", nextFront);
    setField("idBack", nextBack);

    focusByTotalLen(next.length); // 포커스 이동
  };

  const handleDelete = () => {
    const full = (data.idFront || "") + (data.idBack || "");
    if (full.length === 0) return;

    const next = full.slice(0, -1);
    const nextFront = next.slice(0, 6);
    const nextBack = next.slice(6);

    setField("idFront", nextFront);
    setField("idBack", nextBack);

    focusByTotalLen(next.length); // 포커스 이동
  };

  return (
    <ProcessLayout
      title="주민등록등본(초본) 발급을 시작합니다"
      steps={MOVEIN_STEPS}
      current={1}
      onNext={onNext}
    >
      <FormWrap>
        <FieldBlock>
          <FieldLabel>주민등록번호</FieldLabel>
          <FieldControl>
            <IDRow>
              <NumberInput
                inputRef={frontRef}
                ariaLabel="주민등록번호 앞자리"
                value={data.idFront}
                onChange={(v) => {
                  const sanitized = (v || "").slice(0, 6);
                  setField("idFront", sanitized);
                  // 6자 되면 자동으로 뒷칸으로
                  if (sanitized.length === 6) backRef.current?.focus();
                }}
                maxLength={6}
                align="center"
              />
              <Dash aria-hidden>-</Dash>
              <NumberInput
                inputRef={backRef}
                ariaLabel="주민등록번호 뒷자리"
                value={data.idBack}
                onChange={(v) => {
                  const sanitized = (v || "").slice(0, 7);
                  setField("idBack", sanitized);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("[RegiStep1] Enter pressed on back ID input");
                    onNext();
                  }
                }}
                onBackspaceAtStart={() => {
                  // 선택: 뒷칸이 비어 있고 백스페이스 → 앞칸으로
                  if (!data.idBack) frontRef.current?.focus();
                }}
                maxLength={7}
                align="center"
                type="password"
              />
            </IDRow>
          </FieldControl>
        </FieldBlock>
        <NumericPad onInput={handleInput} onDelete={handleDelete} />
      </FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 40px;
  min-width: 0;
`;

const FieldBlock = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

const FieldLabel = styled.label`
  font-size: clamp(38px, 1.6vw, 48px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.dark};
`;

const FieldControl = styled.div`
  min-width: 0;
`;
const IDRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  min-width: 0;
`;

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.dark};
  font-size: clamp(48px, 2vw, 64px);
  line-height: 1;
`;
