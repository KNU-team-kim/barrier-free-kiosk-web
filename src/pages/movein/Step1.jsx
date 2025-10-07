import styled from "styled-components";
import PageTitle from "../../components/common/PageTitle";
import StepIndicator from "../../components/common/StepIndicator";
import WizardNav from "../../components/common/WizardNav";
import { useNavigate } from "react-router-dom";

const steps = [
  "기본정보",
  "전입사유",
  "이사 전 거주지 정보",
  "이사 후 거주지 정보",
  "기타 서비스 신청",
];

export default function Step1() {
  const navigate = useNavigate();
  const onNext = () => navigate("../step-2");

  return (
    <Shell>
      <HeaderRow>
        <PageTitle>전입신고를 시작합니다</PageTitle>
      </HeaderRow>

      <BodyRow>
        <LeftCol>
          <ScrollableArea role="region" aria-label="입력 영역">
            {/* TODO: 여기 추후 Form 넣기 */}
          </ScrollableArea>
          <NavRow>
            <WizardNav onNext={onNext} />
          </NavRow>
        </LeftCol>
        <RightCol>
          <StepIndicator steps={steps} current={1} />
        </RightCol>
      </BodyRow>
    </Shell>
  );
}

// 페이지 전체를 감싸는 그리드
const Shell = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr; // Row1: Header, Row2: Body
  row-gap: 20px; // Header, Body 간 간격
  padding: 36px 24px; // 페이지 레이아웃 패딩
  // box-sizing: border-box; // width=내용+padding+border 합산
  min-width: 0; // overflow 방지, grid 내부에서 자식이 부모보다 커지는거 방지.
`;

// Header
const HeaderRow = styled.header`
  min-width: 0;
`;

// Body: 2컬럼 그리드
const BodyRow = styled.section`
  display: grid;
  grid-template-columns: 1fr auto; /// Column1: Content, Column2: StepIndicator
  column-gap: 24px; // 컬럼 간 간격
  min-height: 0; // 내부 스크롤 허용을 위한 필수값
  min-width: 0;
`;

// Body Column1: 2행 그리드
const LeftCol = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; // Row1: Content, Row2: Nav
  row-gap: 20px;
  min-width: 0;
  min-height: 0;
`;

// Content Scrollable Area
const ScrollableArea = styled.div`
  overflow: auto;
  min-height: 0; // grid 자식이 스크롤하려면 필요
  min-width: 0;
`;

// 네비게이션 행: 우측 정렬, 하단.
const NavRow = styled.div`
  display: flex;
  justify-content: flex-end; // 우측 정렬
  align-items: center;
`;

// Col 2: StepIndicator, 상단 우측 정렬
const RightCol = styled.aside`
  align-self: start; // 상단 정렬
  justify-self: end; // 우측 붙이기
  // max-width: 360px; // 과도한 확대 대비
  min-width: 0;
`;
