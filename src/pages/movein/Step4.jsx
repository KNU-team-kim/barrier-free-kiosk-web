import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ProcessLayout from "../../layouts/ProcessLayout";
import {
  BUILDING_TYPES,
  HOUSEHOLD_FORMATION_TYPE,
  MOVEIN_STEPS,
} from "../../features/movein/config";

import { useMoveInStore } from "../../store/moveInStore";
import ActionButton from "../../components/common/ActionButton";
import LabelText from "../../components/common/LabelText";
import SelectInput from "../../components/inputs/SelectInput";
import NumberInput from "../../components/inputs/NumberInput";
import TextInput from "../../components/inputs/TextInput";
import RadioList from "../../components/inputs/RadioList";
import { ensureDaumPostcode } from "../../services/daumPostcode";

export default function Step4() {
  const navigate = useNavigate();
  const { data, setField } = useMoveInStore();

  const {
    baseAddress = "",
    buildingType = "", // "지상" | "지하"
    mainNumber = "", // 본번
    subNumber = "", // 부번
    extraAddress = "",
    householdMethod = "", // 세대 구성 방법
  } = data;

  const onPrev = () => navigate("../step-3");
  const onNext = () => navigate("../step-5");

  const openAddressSearch = async () => {
    try {
      await ensureDaumPostcode();
      new window.daum.Postcode({
        oncomplete: function (data) {
          // 도로명/지번 우선순위는 서비스 정책에 맞게 조정 가능
          const addr = data.roadAddress || data.jibunAddress || "";
          if (addr) setField("baseAddress", addr);
        },
      }).open();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProcessLayout
      title="이사 후 거주지 정보를 입력해주세요"
      steps={MOVEIN_STEPS}
      current={4}
      onPrev={onPrev}
      onNext={onNext}
    >
      <FormWrap>
        <Section>
          <Subtitle>기본주소</Subtitle>
          <AddressDisplay aria-live="polite">
            {baseAddress ? (
              baseAddress
            ) : (
              <Hidden aria-hidden>히든 스페이스</Hidden>
            )}
          </AddressDisplay>
          <ActionButton onClick={openAddressSearch}>주소 검색</ActionButton>
        </Section>
        <Section>
          <Subtitle>건축물 구분</Subtitle>
          <SelectInput
            value={buildingType}
            onChange={(e) => setField("buildingType", e.target.value)}
            options={BUILDING_TYPES}
            ariaLabel="건축물 구분 선택"
            placeholder="선택"
          />
        </Section>
        <Section>
          <TwoColLabel>
            <Subtitle>본번</Subtitle>
            <Subtitle>부번</Subtitle>
          </TwoColLabel>
          <TwoCol>
            <NumberInput
              value={mainNumber}
              onChange={(v) => setField("mainNumber", v)}
              ariaLabel="본번"
              maxLength={5}
            />
            <NumberInput
              value={subNumber}
              onChange={(v) => setField("subNumber", v)}
              ariaLabel="부번"
              maxLength={5}
            />
          </TwoCol>
        </Section>
        <Section>
          <Subtitle>그 외 주소</Subtitle>
          <TextInput
            value={extraAddress}
            onChange={(v) => setField("extraAddress", v)}
            ariaLabel="그 외 주소 입력"
            maxLength={20}
          />
        </Section>
        <Note>
          상세한 주소가 있다면 그 외 주소란에 반드시 기재(미기재시 전입신고가
          반려될 수 있음)
          <br />
          (건축물의 이름, 동 번호 및 호수까지 작성하고 호수가 없는 경우 총수를
          작성)
        </Note>
        <Divider role="separator" aria-hidden />
        <Section>
          <LabelText>세대 구성 방법</LabelText>
          <RadioList
            options={HOUSEHOLD_FORMATION_TYPE}
            value={householdMethod || ""}
            onChange={(v) => setField("householdMethod", v)}
            name="household-method"
            legend="세대 구성 방법"
            gap={30}
          />
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
  gap: 15px;
`;

const Subtitle = styled.h2`
  font-size: clamp(38px, 1.4vw, 42px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.dark};
  margin: 0;
  padding-left: 12px;
  line-height: 1;
`;

const AddressDisplay = styled.div`
  width: 100%;
  padding: 30px 24px;
  outline: none;
  border: 3px solid transparent;
  border-radius: 24px;
  font-size: clamp(40px, 1.4vw, 44px);
  font-weight: 500;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.colors.label};
  color: ${({ theme }) => theme.colors.black};
  line-height: 1;

  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const Hidden = styled.span`
  visibility: hidden;
`;

const TwoColLabel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  align-items: end;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const Note = styled.div`
  font-size: clamp(36px, 1.1vw, 42px);
  color: ${({ theme }) => theme.colors.gray};
  line-height: 1.2;
  padding-left: 12px;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const Divider = styled.hr`
  height: 1px;
  border: 0;
  background: ${({ theme }) => theme.colors.lightGray};
`;
