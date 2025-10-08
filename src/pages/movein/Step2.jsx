import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import { REASON_OPTIONS } from "../../features/movein/config";
import RadioList from "../../components/inputs/RadioList";

export default function Step2() {
  const navigate = useNavigate();
  const { data, setField } = useMoveInStore();

  const onNext = () => {
    navigate("../step-3");
  };
  const onPrev = () => {
    navigate("../step-1");
  };

  return (
    <ProcessLayout
      title="전입사유를 선택해주세요"
      steps={MOVEIN_STEPS}
      current={2}
      onNext={onNext}
      onPrev={onPrev}
    >
      <FormWrap>
        <Section aria-labelledby="reason-legend">
          <RadioList
            options={REASON_OPTIONS}
            value={data.reasonCategory || ""}
            onChange={(v) => setField("reasonCategory", v)}
            name="movein-reason"
            legend="전입 사유"
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
  gap: 40px;
  min-width: 0;
`;

const Section = styled.section`
  min-width: 0;
`;
