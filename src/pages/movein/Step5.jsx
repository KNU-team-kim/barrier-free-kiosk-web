import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import { SERVICE_OPTIONS } from "../../features/movein/config";
import CheckboxList from "../../components/inputs/CheckboxList";

export default function Step5() {
  const navigate = useNavigate();
  const { data, setField } = useMoveInStore();

  const onPrev = () => {
    navigate("../step-4");
  };
  const onComplete = () => {};

  return (
    <ProcessLayout
      title="전입 신고와 함께 신청가능한 서비스"
      steps={MOVEIN_STEPS}
      current={5}
      onPrev={onPrev}
      onComplete={onComplete}
    >
      <FormWrap>
        <CheckboxList
          options={SERVICE_OPTIONS}
          values={data.services || []}
          onChange={(next) => setField("services", next)}
          name="movein-services"
          legend="부가 서비스 선택"
          gap={30}
        />
      </FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 40px;
  min-width: 0;
`;
