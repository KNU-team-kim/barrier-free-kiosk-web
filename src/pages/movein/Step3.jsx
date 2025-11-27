import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS, SIGUNGU } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import { useEffect, useMemo, useRef } from "react";
import SelectInput from "../../components/inputs/SelectInput";
import ActionButton from "../../components/common/ActionButton";
import LabelText from "../../components/common/LabelText";
import { getMoveInAddress } from "../../api/moveIn";
import { useVoiceModeStore } from "../../store/voiceModeStore";

export default function Step3() {
  const navigate = useNavigate();
  const { data, setPrevAddrField, setPrevAddrState, getFullPhone } =
    useMoveInStore();
  const { applicantName } = data;
  const { sido, sigungu, loading, result } = data.prevAddr;

  // input ref
  const sidoRef = useRef(null);
  const sigunguRef = useRef(null);

  const focusTarget = useVoiceModeStore((s) => s.focusTarget);
  const clearFocusTarget = useVoiceModeStore((s) => s.clearFocusTarget);

  const onNext = () => {
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
      const data = await getMoveInAddress({ name, phoneNumber });

      if (!data || (!data.sido && !data.sigungu && !data.roadName)) {
        setPrevAddrState({ loading: false, result: { notFound: true } });
        return;
      }

      // 화면용 address 문자열 생성
      const addressStr = [
        data.sido,
        data.sigungu,
        data.roadName,
        data.mainBuildingNumber ? String(data.mainBuildingNumber) : "",
        data.subBuildingNumber ? String(data.subBuildingNumber) : "",
        data.detail || "",
      ]
        .filter(Boolean)
        .join(" ");

      // store에 반영 (시/도·시군구 셀렉트도 동기화)
      setPrevAddrState({
        sido: data.sido || "",
        sigungu: data.sigungu || "",
        roadName: data.roadName || "",
        mainBuildingNumber: data.mainBuildingNumber || null,
        subBuildingNumber: data.subBuildingNumber || null,
        detail: data.detail || "",
        loading: false,
        error: null,
        result: { address: addressStr },
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

  useEffect(() => {
    if (!focusTarget) return;

    // ref가 준비될 때까지 재시도하는 함수 (최대 3번)
    const attemptFocus = (ref, maxAttempts = 3, delay = 50) => {
      let attempts = 0;
      const tryFocus = () => {
        if (ref.current) {
          ref.current.focus();
          clearFocusTarget(); // 포커스 성공 후에 clearFocusTarget 호출
          return true;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryFocus, delay);
        } else {
          // 최대 재시도 횟수 도달 시에도 clearFocusTarget 호출
          clearFocusTarget();
        }
        return false;
      };
      tryFocus();
    };

    if (focusTarget === "movein.before_sido") {
      attemptFocus(sidoRef);
    } else if (focusTarget === "movein.before_sigungu") {
      attemptFocus(sigunguRef);
    }
  }, [focusTarget, clearFocusTarget]);

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
              ref={sidoRef}
            />
            <SelectInput
              placeholder="시군구 선택"
              ariaLabel="시군구 선택"
              value={sigungu}
              onChange={changeSigungu}
              options={sigunguOptions}
              disabled={!sido}
              ref={sigunguRef}
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
  color: ${({ theme }) => theme.colors.highlightSub};
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
  ${({ theme }) => theme.colors.highlightNormal};
`;

const AddressCard = styled.div`
  display: grid;
  gap: 8px;
`;

const AddressValue = styled.div`
  font-size: clamp(40px, 1.6vw, 48px);
  font-weight: 500;
  padding-top: 15px;
  color: ${({ theme }) => theme.colors.textContent};
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
