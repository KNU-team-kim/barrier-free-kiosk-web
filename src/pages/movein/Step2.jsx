import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  MOVEIN_STEPS,
  reasonMap,
  reverseReasonMap,
} from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
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
            options={Object.values(reasonMap)}
            value={data.reasonCategoryLabel || ""}
            onChange={(label) => {
              const code = reverseReasonMap[label] || "";
              setField("reasonCategory", code); // 서버용 enum 저장
              setField("reasonCategoryLabel", label); // 화면 표시용 (선택사항)
            }}
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
