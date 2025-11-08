import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ProcessLayout from "../../layouts/ProcessLayout";
import {
  buildingTypeMap,
  householdFormationTypeMap,
  MOVEIN_STEPS,
  SIGUNGU,
} from "../../features/movein/config";

import { useMoveInStore } from "../../store/moveInStore";
import LabelText from "../../components/common/LabelText";
import SelectInput from "../../components/inputs/SelectInput";
import NumberInput from "../../components/inputs/NumberInput";
import TextInput from "../../components/inputs/TextInput";
import RadioList from "../../components/inputs/RadioList";
import { useMemo } from "react";

export default function Step4() {
  const navigate = useNavigate();
  const { data, setNewAddrField, setNewAddrState } = useMoveInStore();
  const {
    sido,
    sigungu,
    roadName,
    buildingType,
    mainBuildingNumber,
    subBuildingNumber,
    detail,
    sedaeju,
  } = data.newAddr;

  const onPrev = () => navigate("../step-3");
  const onNext = () => navigate("../step-5");

  const sidoOptions = useMemo(() => Object.keys(SIGUNGU || {}), []);
  const sigunguOptions = useMemo(
    () => (sido ? SIGUNGU[sido] || [] : []),
    [sido]
  );

  const changeSido = (e) => {
    const next = e.target.value;
    setNewAddrState({ sido: next, sigungu: "" });
  };
  const changeSigungu = (e) => setNewAddrField("sigungu", e.target.value);

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
          <SelectInput
            placeholder="시도 선택"
            ariaLabel="시도 선택"
            value={sido}
            onChange={changeSido}
            options={sidoOptions}
          />
          <SelectInput
            placeholder="시군구 선택"
            ariaLabel="시군구 선택"
            value={sigungu}
            onChange={changeSigungu}
            options={sigunguOptions}
            disabled={!sido}
          />
          <TextInput
            placeholder="도로명 입력"
            value={roadName}
            onChange={(v) => setNewAddrField("roadName", v)}
            ariaLabel="도로명 주소 입력"
            maxLength={20}
          />
        </Section>
        <Section>
          <Subtitle>건축물 구분</Subtitle>
          <SelectInput
            value={buildingType}
            onChange={(e) => setNewAddrField("buildingType", e.target.value)}
            options={Object.values(buildingTypeMap)}
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
              value={mainBuildingNumber}
              onChange={(v) => setNewAddrField("mainBuildingNumber", v)}
              ariaLabel="본번"
              maxLength={5}
            />
            <NumberInput
              value={subBuildingNumber}
              onChange={(v) => setNewAddrField("subBuildingNumber", v)}
              ariaLabel="부번"
              maxLength={5}
            />
          </TwoCol>
        </Section>
        <Section>
          <Subtitle>그 외 주소</Subtitle>
          <TextInput
            value={detail}
            onChange={(v) => setNewAddrField("detail", v)}
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
            options={Object.values(householdFormationTypeMap)}
            value={sedaeju || ""}
            onChange={(v) => setNewAddrField("sedaeju", v)}
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
