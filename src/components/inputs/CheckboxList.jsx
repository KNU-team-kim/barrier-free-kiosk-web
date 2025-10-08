import styled from "styled-components";

export default function CheckboxList({
  options,
  values = [],
  onChange,
  name,
  legend,
  gap = 30,
  "aria-labelledby": ariaLabelledBy,
}) {
  const items = (options ?? []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const toggle = (val) => {
    const has = values.includes(val);
    const next = has ? values.filter((v) => v !== val) : [...values, val];
    onChange?.(next);
  };

  return (
    <Fieldset role="group" aria-labelledby={ariaLabelledBy}>
      {legend ? <Legend>{legend}</Legend> : null}
      <List style={{ gap: `${gap}px` }}>
        {items.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = values.includes(opt.value);
          return (
            <Item key={opt.value}>
              <Row>
                <BoxCol>
                  <CheckboxInput
                    id={id}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    aria-checked={checked}
                  />
                </BoxCol>
                <LabelCol>
                  <Label htmlFor={id}>{opt.label}</Label>
                </LabelCol>
              </Row>
            </Item>
          );
        })}
      </List>
    </Fieldset>
  );
}

const Fieldset = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
`;

const Legend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
`;

const List = styled.div`
  display: grid;
`;

const Item = styled.div`
  min-width: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; /* 체크박스, 라벨 */
  column-gap: 12px;
  align-items: start; /* 상단 정렬 */
  min-width: 0;
`;

const BoxCol = styled.div`
  display: flex;
  align-items: flex-start; /* 상단 붙임 */
  justify-content: center;
`;

const CheckboxInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  position: relative;

  &:checked {
    background-color: ${({ theme }) => theme.colors.highlight};
  }
  &:checked::after {
    content: "";
    position: absolute;
    top: 9px;
    left: 12px;
    width: 10px;
    height: 18px;
    border: solid white;
    border-width: 0 4px 4px 0;
    border-radius: 2px;
    transform: rotate(45deg);
    transform-origin: center;
  }
`;

const LabelCol = styled.div`
  min-width: 0;
`;

const Label = styled.label`
  display: inline-block;
  margin-top: -3px; // line-height때문에 checkbox랑 살짝 안맞음.
  font-size: clamp(40px, 1.4vw, 48px);
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.3;
  white-space: normal; // 줄바꿈 허용
  overflow-wrap: break-word; // 단어 단위로 줄바꿈
  word-break: keep-all; // 한글 등은 가능한 공백 기준으로 줄바꿈
`;
