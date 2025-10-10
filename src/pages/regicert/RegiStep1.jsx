import { useNavigate } from "react-router-dom";
import ProcessLayout from "../../layouts/ProcessLayout";
import { MOVEIN_STEPS } from "../../features/resicert/config";
import styled from "styled-components";
import { useRegiCertStore } from "../../store/regiCertStore";
import NumberInput from "../../components/inputs/NumberInput";
import NumericPad from "../../components/inputs/NumericPad";
import { useRef } from "react";

export default function RegiStep1() {
  const navigate = useNavigate();
  const { data, setField } = useRegiCertStore();

  const onNext = () => {
    navigate("../step-2");
  };

  const frontRef = useRef(null);
  const backRef = useRef(null);

  const focusByTotalLen = (totalLen) => {
    if (totalLen <= 5) {
      frontRef.current?.focus();
    } else {
      backRef.current?.focus();
    }
  };

  const handleInput = (digit) => {
    const full = (data.idFront || "") + (data.idBack || "");
    if (full.length >= 13) return;

    const next = (full + digit).slice(0, 13);
    const nextFront = next.slice(0, 6);
    const nextBack = next.slice(6);

    setField("idFront", nextFront);
    setField("idBack", nextBack);

    focusByTotalLen(next.length); // ✅ 포커스 이동
  };

  const handleDelete = () => {
    const full = (data.idFront || "") + (data.idBack || "");
    if (full.length === 0) return;

    const next = full.slice(0, -1);
    const nextFront = next.slice(0, 6);
    const nextBack = next.slice(6);

    setField("idFront", nextFront);
    setField("idBack", nextBack);

    focusByTotalLen(next.length); // ✅ 포커스 이동
  };

  return (
    <ProcessLayout
      title="주민등록등본(초본) 발급을 시작합니다"
      steps={MOVEIN_STEPS}
      current={1}
      onNext={onNext}
    >
      <FormWrap>
        <FieldBlock>
          <FieldLabel>주민등록번호</FieldLabel>
          <FieldControl>
            <IDRow>
              <NumberInput
                inputRef={frontRef}
                ariaLabel="주민등록번호 앞자리"
                value={data.idFront}
                onChange={(v) => {
                  const sanitized = (v || "").slice(0, 6);
                  setField("idFront", sanitized);
                  // 6자 되면 자동으로 뒷칸으로
                  if (sanitized.length === 6) backRef.current?.focus();
                }}
                maxLength={6}
                align="center"
              />
              <Dash aria-hidden>-</Dash>
              <NumberInput
                inputRef={backRef}
                ariaLabel="주민등록번호 뒷자리"
                value={data.idBack}
                onChange={(v) => {
                  const sanitized = (v || "").slice(0, 7);
                  setField("idBack", sanitized);
                }}
                onBackspaceAtStart={() => {
                  // 선택: 뒷칸이 비어 있고 백스페이스 → 앞칸으로
                  if (!data.idBack) frontRef.current?.focus();
                }}
                maxLength={7}
                align="center"
                type="password"
              />
            </IDRow>
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

const FieldLabel = styled.label`
  font-size: clamp(38px, 1.6vw, 48px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

const FieldControl = styled.div`
  min-width: 0;
`;
const IDRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  min-width: 0;
`;

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.dark};
  font-size: clamp(48px, 2vw, 64px);
  line-height: 1;
`;
