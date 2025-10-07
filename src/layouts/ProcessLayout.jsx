import styled from "styled-components";
import PageTitle from "../components/common/PageTitle";
import WizardNav from "../components/common/WizardNav";
import StepIndicator from "../components/common/StepIndicator";

export default function ProcessLayout({
  title,
  children,
  steps,
  current,
  onNext,
  onPrev,
  onComplete,
  homeTo,
  rightSlot,
}) {
  return (
    <Shell>
      <HeaderRow>{title ? <PageTitle>{title}</PageTitle> : null}</HeaderRow>

      <BodyRow>
        <LeftCol>
          <ScrollableArea role="region" aria-label="입력 영역">
            {children}
          </ScrollableArea>

          <NavRow>
            <WizardNav
              onNext={onNext}
              onPrev={onPrev}
              onComplete={onComplete}
              homeTo={homeTo}
            />
          </NavRow>
        </LeftCol>

        <RightCol>
          {rightSlot ??
            (steps && current != null ? (
              <StepIndicator steps={steps} current={current} />
            ) : null)}
        </RightCol>
      </BodyRow>
    </Shell>
  );
}

const Shell = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr; /* Row1: Header, Row2: Body */
  row-gap: 20px;
  padding: 64px 48px;
  min-width: 0;
`;

const HeaderRow = styled.header`
  min-width: 0;
`;

const BodyRow = styled.section`
  display: grid;
  grid-template-columns: 1fr auto; /* Column1: Content, Column2: Right */
  column-gap: 24px;
  min-height: 0;
  min-width: 0;
`;

const LeftCol = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; /* Row1: Content, Row2: Nav */
  row-gap: 20px;
  min-width: 0;
  min-height: 0;
`;

const ScrollableArea = styled.div`
  overflow: auto;
  min-height: 0;
  min-width: 0;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const RightCol = styled.aside`
  align-self: start;
  justify-self: end;
  min-width: 0;
`;
