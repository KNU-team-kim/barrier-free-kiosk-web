import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  certTypeMap,
  MOVEIN_STEPS,
  reverseCertTypeMap,
} from "../../features/regicert/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useRegiCertStore } from "../../store/regiCertStore";
import RadioList from "../../components/inputs/RadioList";

export default function RegiStep2() {
  const navigate = useNavigate();
  const { data, setField } = useRegiCertStore();

  const onPrev = () => navigate("../step-1");
  const onNext = () => {
    navigate("../step-3");
  };
  return (
    <ProcessLayout
      title="신청 내용을 선택해주세요"
      steps={MOVEIN_STEPS}
      current={2}
      onNext={onNext}
      onPrev={onPrev}
    >
      <FormWrap>
        <Label>발급형태</Label>
        <Section aria-labelledby="reason-legend">
          <RadioList
            options={Object.values(certTypeMap)}
            value={data.certTypeLabel || ""}
            onChange={(v) => {
              const code = reverseCertTypeMap[v] || "";
              setField("certType", code); // 서버용 enum 저장
              setField("certTypeLabel", v); // 화면 표시용
            }}
            name="cert-type"
            legend="발급형태 선택"
            gap={30}
            aria-labelledby="reason-legend"
          />
        </Section>
      </FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 20px;
  min-width: 0;
`;

const Section = styled.section`
  min-width: 0;
`;

const Label = styled.label`
  font-size: clamp(38px, 1.6vw, 48px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.dark};
`;

const OptionSection = styled.section`
  margin-left: 50px;
  min-width: 0;
`;
