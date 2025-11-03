import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS, SIGUNGU } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import { useMemo } from "react";
import SelectInput from "../../components/inputs/SelectInput";
import ActionButton from "../../components/common/ActionButton";
import LabelText from "../../components/common/LabelText";
import { getMoveInAddress } from "../../api/moveIn";

export default function Step3() {
  const navigate = useNavigate();
  const { data, setPrevAddrField, setPrevAddrState, getFullPhone } =
    useMoveInStore();
  const { applicantName } = data;
  const { sido, sigungu, loading, error, result } = data.prevAddr;

  const onNext = () => {
    // if (!validateStep1()) return;
    navigate("../step-4");
  };
  const onPrev = () => {
    navigate("../step-2");
  };

  const sidoOptions = useMemo(() => Object.keys(SIGUNGU || {}), []);
  const sigunguOptions = useMemo(
    () => (sido ? SIGUNGU[sido] || [] : []),
    [sido]
  );

  const changeSido = (e) => {
    const next = e.target.value;
    setPrevAddrState({ sido: next, sigungu: "" });
  };
  const changeSigungu = (e) => setPrevAddrField("sigungu", e.target.value);

  // Step3 컴포넌트 내부에 추가/교체
  const onSearch = async () => {
    const name = (applicantName || "").trim();
    const phoneNumber = getFullPhone();

    if (!name) {
      alert("신청자 이름을 먼저 입력해 주세요.");
      return;
    }
    if (!phoneNumber) {
      alert("휴대폰 번호를 먼저 입력해 주세요.");
      return;
    }

    try {
      setPrevAddrState({ loading: true, error: null, result: null });
      // 주소 조회
      const data = await getMoveInAddress({ name, phoneNumber });
      // data: { sido, sigungu, roadName, buildingNumber, detail }

      if (!data || (!data.sido && !data.sigungu && !data.roadName)) {
        // 응답이 비정상/빈 케이스: notFound 처리
        setPrevAddrState({ loading: false, result: { notFound: true } });
        return;
      }

      // 화면용 address 문자열 생성
      const addressStr = [
        data.sido,
        data.sigungu,
        data.roadName,
        data.buildingNumber ? String(data.buildingNumber) : "",
        data.detail || "",
      ]
        .filter(Boolean)
        .join(" ");

      // store에 반영 (시/도·시군구 셀렉트도 동기화)
      setPrevAddrState({
        loading: false,
        error: null,
        result: { address: addressStr },
        sido: data.sido || "",
        sigungu: data.sigungu || "",
      });
    } catch (e) {
      console.error(e);
      setPrevAddrState({
        loading: false,
        error: e,
        result: { notFound: true },
      });
    }
  };

  return (
    <ProcessLayout
      title="이사 전 거주지 정보를 입력해주세요"
      steps={MOVEIN_STEPS}
      current={3}
      onNext={onNext}
      onPrev={onPrev}
    >
      <FormWrap>
        <Section aria-labelledby="addr-check-title">
          <Subtitle id="addr-check-title">주소확인</Subtitle>

          <Column>
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
            <ActionButton onClick={onSearch} disabled={loading}>
              주소 조회
            </ActionButton>
          </Column>
        </Section>
        <Divider role="separator" aria-hidden />
        <Section aria-labelledby="addr-result-title">
          <LabelText>기본 주소</LabelText>
          {result?.notFound ? (
            <AddressCard>
              <AddressValue>
                신청 민원인의 정보가 해당 시군구에 존재하지 않습니다.
              </AddressValue>
            </AddressCard>
          ) : result?.address ? (
            <AddressCard>
              <AddressValue>{result.address}</AddressValue>
            </AddressCard>
          ) : null}
        </Section>
      </FormWrap>
    </ProcessLayout>
  );
}

const FormWrap = styled.div`
  display: grid;
  gap: 40px;
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

const Column = styled.div`
  display: grid;
  gap: 15px;
  align-content: start;
`;

const Divider = styled.hr`
  height: 1px;
  border: 0;
  background: ${({ theme }) => theme.colors.lightGray};
`;

const AddressCard = styled.div`
  display: grid;
  gap: 8px;
`;

const AddressValue = styled.div`
  font-size: clamp(40px, 1.6vw, 48px);
  font-weight: 500;
  padding-top: 15px;
  color: ${({ theme }) => theme.colors.deepDark};
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
