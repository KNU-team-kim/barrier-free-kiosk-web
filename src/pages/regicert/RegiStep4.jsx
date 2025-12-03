import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS } from "../../features/regicert/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import LabelText from "../../components/common/LabelText";
import { useRegiCertStore } from "../../store/regiCertStore";
import { postRegistration } from "../../api/resident";

export default function RegiStep4() {
  const navigate = useNavigate();
  const { data, buildRegiCertPayload, reset } = useRegiCertStore();

  const onPrev = () => {
    navigate("../step-3");
  };
  const onComplete = async () => {
    const payload = buildRegiCertPayload();
    console.log("[RegiCert] request payload:", payload);

    const res = await postRegistration(payload);
    console.log("[RegiCert] response:", res);

    reset();
    navigate("../complete");
  };

  return (
    <ProcessLayout
      title="신청 내용과 수수료를 확인해주세요"
      steps={MOVEIN_STEPS}
      current={4}
      onPrev={onPrev}
      onComplete={onComplete}
    >
      <FormWrap>
        <Section>
          <LabelText>신청 내용</LabelText>
          <DetailContent>
            <Subtitle>발급 항목</Subtitle>
            <Content>주민등록등본(초본)</Content>
          </DetailContent>
          <DetailContent>
            <Subtitle>신청 부수</Subtitle>
            <Content>{data.copies || 0} 부</Content>
          </DetailContent>
        </Section>
        <Divider role="separator" aria-hidden />
        <Section>
          <LabelText>수수료 납부</LabelText>
          <DetailContent>
            <Subtitle>총 수수료</Subtitle>
            <Content>{(data.copies || 0) * 200} 원</Content>
          </DetailContent>
        </Section>
      </FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 60px;
  min-width: 0;
`;

const Section = styled.section`
  display: grid;
  gap: 40px;
`;

const DetailContent = styled.div`
  display: grid;
  gap: 30px;
  min-width: 0;
`;

const Subtitle = styled.h2`
  font-size: clamp(38px, 1.4vw, 42px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.highlightSub};
  margin: 0;
  padding-left: 12px;
  line-height: 1;
`;

const Content = styled.div`
  font-size: clamp(40px, 1.2vw, 44px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textContent};
  padding-left: 12px;
  line-height: 1;
`;

const Divider = styled.hr`
  height: 1px;
  border: 0;
  background: ${({ theme }) => theme.colors.highlightNormal};
`;
