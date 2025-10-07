import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMoveInStore } from "../../store/moveInStore";
import TextInput from "../../components/inputs/TextInput";
import NumberInput from "../../components/inputs/NumberInput";
import ProcessLayout from "../../layouts/ProcessLayout";
import { MOVEIN_STEPS } from "../../features/movein/config";

export default function Step1() {
  const navigate = useNavigate();
  const { data, setField /*, validateStep1*/ } = useMoveInStore();

  const onNext = () => {
    // if (!validateStep1()) return;
    navigate("../step-2");
  };

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
  color: ${({ theme }) => theme.colors.dark};
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
  color: ${({ theme }) => theme.colors.dark};
  font-size: clamp(48px, 2vw, 64px);
  line-height: 1;
`;
