import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MOVEIN_STEPS, SIGUNGU } from "../../features/movein/config";
import ProcessLayout from "../../layouts/ProcessLayout";
import { useMoveInStore } from "../../store/moveInStore";
import { useMemo } from "react";
import { fetchPreviousAddress } from "../../services/moveInApi";
import SelectInput from "../../components/inputs/SelectInput";
import ActionButton from "../../components/common/ActionButton";
import LabelText from "../../components/common/LabelText";

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
  const onSearch = async () => {
    const phone = getFullPhone();
    if (!applicantName || !phone || !sido || !sigungu) {
      setPrevAddrState({
        error: "성명/휴대폰/시도/시군구를 모두 선택/입력해주세요.",
        result: null,
      });
      return;
    }
    setPrevAddrState({ loading: true, error: null, result: null });
    try {
      const dataRes = await fetchPreviousAddress({
        name: applicantName,
        phone,
        sido,
        sigungu,
      });
      if (dataRes?.address) {
        setPrevAddrState({
          result: { address: dataRes.address },
          loading: false,
        });
      } else {
        setPrevAddrState({ result: { notFound: true }, loading: false });
      }
    } catch (err) {
      setPrevAddrState({
        error: err.message || "조회 중 오류가 발생했습니다.",
        loading: false,
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
