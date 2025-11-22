import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS } from "../../features/regicert/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useRegiCertStore } from "../../store/regiCertStore";
import NumberInput from "../../components/inputs/NumberInput";
import NumericPad from "../../components/inputs/NumericPad";
import { useRef } from "react";

export default function RegiStep3() {
  const navigate = useNavigate();
  const { data, setField } = useRegiCertStore();
  const inputRef = useRef(null);

  const onPrev = () => navigate("../step-2");
  const onNext = () => {
    navigate("../step-4");
  };

  const handleInput = (digit) => {
    const current = String(data.copies || "");
    // 최대 2자리로 제한 (99부까지)
    if (current.length >= 2) return;
    const next = current + digit;
    setField("copies", Number(next));
  };

  const handleDelete = () => {
    const current = String(data.copies || "");
    if (current.length === 0) return;
    const next = current.slice(0, -1);
    setField("copies", next === "" ? 0 : Number(next));
  };

  return (
    <ProcessLayout
      title="발급 부수를 입력해주세요"
      steps={MOVEIN_STEPS}
      current={3}
      onNext={onNext}
      onPrev={onPrev}
    >
      <FormWrap>
        <FieldBlock>
          <FieldControl>
            <NumberInput
              inputRef={inputRef}
              ariaLabel="발급부수"
              value={String(data.copies || "")}
              onChange={(v) => {
                const num = v === "" ? 0 : Number(v);
                setField("copies", num);
              }}
              maxLength={2}
              align="right"
              suffix="부"
            />
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

const FieldControl = styled.div`
  min-width: 0;
`;
