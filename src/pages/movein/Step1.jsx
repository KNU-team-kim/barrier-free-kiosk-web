import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMoveInStore } from "../../store/moveInStore";
import TextInput from "../../components/inputs/TextInput";
import NumberInput from "../../components/inputs/NumberInput";
import ProcessLayout from "../../layouts/ProcessLayout";
import { MOVEIN_STEPS } from "../../features/movein/config";
import { checkMoveIn } from "../../api/moveIn";
import { useVoiceModeStore } from "../../store/voiceModeStore";
import { useEffect, useRef } from "react";

export default function Step1() {
  const navigate = useNavigate();
  const { data, setField, getFullPhone } = useMoveInStore();
  const focusTarget = useVoiceModeStore((s) => s.focusTarget);
  const clearFocusTarget = useVoiceModeStore((s) => s.clearFocusTarget);

  // input ref
  const nameRef = useRef(null);
  const phone1Ref = useRef(null);

  const onNext = async () => {
    const data = await checkValidUser();
    if (data) {
      navigate("../step-2");
    } else {
      alert("유효하지 않은 사용자 정보입니다. 다시 확인해 주세요.");
    }
  };

  const checkValidUser = async () => {
    const res = await checkMoveIn({
      phoneNumber: getFullPhone(),
      name: data.applicantName,
    });
    return res;
  };

  useEffect(() => {
    if (!focusTarget) return;

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

    if (focusTarget === "movein.name") {
      console.log("focusing name");
      attemptFocus(nameRef);
    } else if (focusTarget === "movein.phone_number") {
      console.log("focusing phone number");
      attemptFocus(phone1Ref);
    }
  }, [focusTarget, clearFocusTarget]);

  return (
    <ProcessLayout
      title="전입신고를 시작합니다"
      steps={MOVEIN_STEPS}
      current={1}
      onNext={onNext}
    >
      <FormWrap>
        {/* 성명 블록 */}
        <FieldBlock>
          <FieldLabel htmlFor="applicantName">신청인 성명</FieldLabel>
          <FieldControl>
            <TextInput
              id="applicantName"
              ariaLabel="신청인 성명"
              value={data.applicantName}
              onChange={(v) => setField("applicantName", v)}
              maxLength={30}
              ref={nameRef}
            />
          </FieldControl>
        </FieldBlock>

        {/* 휴대전화 블록 */}
        <FieldBlock>
          <FieldLabel>휴대전화번호</FieldLabel>
          <FieldControl>
            <PhoneRow>
              <NumberInput
                ariaLabel="전화번호 앞자리"
                value={data.phone1}
                onChange={(v) => setField("phone1", v)}
                maxLength={3}
                ref={phone1Ref}
              />
              <Dash aria-hidden>-</Dash>
              <NumberInput
                ariaLabel="전화번호 중간자리"
                value={data.phone2}
                onChange={(v) => setField("phone2", v)}
                maxLength={4}
              />
              <Dash aria-hidden>-</Dash>
              <NumberInput
                ariaLabel="전화번호 끝자리"
                value={data.phone3}
                onChange={(v) => setField("phone3", v)}
                maxLength={4}
              />
            </PhoneRow>
          </FieldControl>
        </FieldBlock>
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
  font-weight: 500;
  color: ${({ theme }) => theme.colors.highlightSub};
`;

const FieldControl = styled.div`
  min-width: 0;
`;

const PhoneRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  min-width: 0;
`;

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.highlightSub};
  font-size: clamp(48px, 2vw, 64px);
  line-height: 1;
`;
