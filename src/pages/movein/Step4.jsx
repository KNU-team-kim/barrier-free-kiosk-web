import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";

export default function Step4() {
  const navigate = useNavigate();
  const { data, setField /*, validateStep1*/ } = useMoveInStore();

  const onNext = () => {
    // if (!validateStep1()) return;
    navigate("../step-5");
  };
  const onPrev = () => {
    navigate("../step-3");
  };

  return (
    <ProcessLayout
      title="이사 후 거주지 정보를 입력해주세요"
      steps={MOVEIN_STEPS}
      current={4}
      onNext={onNext}
      onPrev={onPrev}
    >
      <FormWrap></FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 40px;
  min-width: 0;
`;
