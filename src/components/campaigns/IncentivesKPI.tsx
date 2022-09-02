import React from "react";
import styled from "styled-components";
import { Row } from "components/Row";
import { TYPE } from "theme";
import { TokenLogo } from "components/Icons/Icons";
import { Info } from "components/QuestionHelper";
import { IncentivesAndKPIs, Box } from "./typesIncetivesKPIs";

const MainWrapper = styled.div`
  display: flex;
  gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-wrap: wrap;
  `}
`;

const Wrapper = styled.div<{ name: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  padding: 15px 20px;
  border: 2px solid #959595;
  border-radius: 26px;
  flex: 50%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex: 100%;
  align-items: center;
  `}
`;

const MobileWrapper = styled(Row)`
  gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  align-items: flex-start;
  `}
`;

const BoxesWrapper = styled(Row)`
  gap: 12px;
  width: unset;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  `}
`;

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 7px 12px;
  border-radius: 59px;
  white-space: nowrap;
`;

export default function IncentivesKPI(props: { data: IncentivesAndKPIs }) {
  return (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <MainWrapper>
        <IncentivesORKPIs data={props.data.incentives} name='incentives' />
        <IncentivesORKPIs data={props.data.bonus} name='bonus' />
      </MainWrapper>
      <IncentivesORKPIs data={props.data.KPIs} name='KPIs' />
    </div>
  );
}

export function IncentivesORKPIs(props: {
  data: Array<Box>;
  name: "incentives" | "KPIs" | "bonus";
}) {
  // checks if AND word needed or is it an end of the array
  function renderAND(arr: Array<Box>, i: number) {
    if (arr.length === 1) {
      return;
    }
    if (!arr[i + 1]) {
      return;
    }
    return (
      <TYPE.custom color='#959595' fontSize={12}>
        AND
      </TYPE.custom>
    );
  }

  // variable for all the boxes of incentives or KPIs and neccessary "AND"s
  const Boxes = props.data.map((each, i, arr) => {
    return (
      <BoxesWrapper key={each.icon}>
        <StyledBox>
          {each.icon && <TokenLogo name={each.icon} />}
          <TYPE.custom color='#ffffff' fontSize={12}>
            {each.text}
          </TYPE.custom>
          {each.extraInfo && <Info data={each.extraInfo} />}
        </StyledBox>
        {renderAND(arr, i)}
      </BoxesWrapper>
    );
  });

  return (
    <Wrapper name={props.name}>
      <TYPE.custom color='#959595' fontSize={12}>
        {props.name === "incentives" && "For each referral you recieve"}
        {props.name === "bonus" && "Referrals bonus"}
        {props.name === "KPIs" && "Referral is generated when user"}
      </TYPE.custom>
      <MobileWrapper>{Boxes}</MobileWrapper>
    </Wrapper>
  );
}
