import styled from "styled-components";

export default function RadioList({
  options,
  value,
  onChange,
  name,
  legend,
  gap = 30,
  "aria-labelledby": ariaLabelledBy,
  ref,
  isActive = false,
}) {
  // options가 string 배열이면 {value,label}로 변환
  const items = (options ?? []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <Fieldset role="radiogroup" aria-labelledby={ariaLabelledBy}>
      {legend ? <Legend>{legend}</Legend> : null}
      <List
        ref={ref || null}
        style={{ gap: `${gap}px` }}
        data-active={isActive ? "true" : "false"}
      >
        {items.map((opt) => {
          const id = `${name}-${opt.value}`;
          return (
            <Item key={opt.value}>
              <Row>
                <RadioCol>
                  <RadioInput
                    id={id}
                    type="radio" // radio 타입 지정
                    name={name}
                    checked={value === opt.value}
                    onChange={() => onChange?.(opt.value)}
                    aria-checked={value === opt.value}
                  />
                </RadioCol>
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

// fieldset -> 여러개의 input을 그룹화
const Fieldset = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
`;

// legend -> fieldset의 제목
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
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 10px;
    outline: none;
  }
`;

// gap, list 정렬을 안정적으로 제어하기 위해 사용
// list에 들어간 gap은 바로아래 자식끼리 계산됨
// 그래서 라디오의 각 항목이 gap을 가질려면 gap의 직접 자식이 되어야함.
// 근데 없어도 되긴하네..?
const Item = styled.div`
  min-width: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; // 라디오, 라벨
  column-gap: 12px;
  align-items: center; // 행 높이가 커져도 라디오가 세로 중앙에 위치
  min-width: 0;
`;

const RadioCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RadioInput = styled.input`
  width: 40px;
  height: 40px;

  border: 1px solid ${({ theme }) => theme.colors.highlightNormal};
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  &:checked {
    border: 1px solid ${({ theme }) => theme.colors.highlightNormal};
    accent-color: ${({ theme }) => theme.colors.highlight};
  }
`;

const LabelCol = styled.div`
  min-width: 0;
`;

const Label = styled.label`
  display: inline-block;
  font-size: clamp(40px, 1.5vw, 48px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highlightSub};
  line-height: 1.3;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
