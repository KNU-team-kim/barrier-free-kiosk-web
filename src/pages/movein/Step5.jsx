import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS, serviceOptionsMap } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import CheckboxList from "../../components/inputs/CheckboxList";
import { postMoveIn } from "../../api/moveIn";

export default function Step5() {
  const navigate = useNavigate();
  const { data, setField, buildMoveInPayload, reset } = useMoveInStore();

  const onPrev = () => {
    navigate("../step-4");
  };
  const onComplete = async () => {
    const payload = buildMoveInPayload();
    console.log("[MoveIn] request payload:", payload);

    const res = await postMoveIn(payload);
    console.log("[MoveIn] response:", res);

    reset();
    navigate("../complete");
  };

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
          options={Object.values(serviceOptionsMap)}
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
