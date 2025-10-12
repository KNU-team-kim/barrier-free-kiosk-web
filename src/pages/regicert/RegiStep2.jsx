import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  CERT_TYPE,
  CERT_TYPE_DETAILED_OPTION,
  MOVEIN_STEPS,
} from "../../features/resicert/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useRegiCertStore } from "../../store/regiCertStore";
import RadioList from "../../components/inputs/RadioList";
import CheckboxList from "../../components/inputs/CheckboxList";

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
            options={CERT_TYPE}
            value={data.certType || ""}
            onChange={(v) => {
              setField("certType", v);
              if (v !== "선택 발급") {
                setField("certDetails", []);
              }
            }}
            name="cert-type"
            legend="발급형태 선택"
            gap={30}
            aria-labelledby="reason-legend"
          />
        </Section>
        {data.certType === "선택 발급" && (
          <>
            <OptionSection>
              <CheckboxList
                options={CERT_TYPE_DETAILED_OPTION}
                values={data.certDetails || []}
                onChange={(v) => setField("certDetails", v)}
                name="cert-details"
                legend="포함할 정보 선택"
                gap={20}
              />
            </OptionSection>
          </>
        )}
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
