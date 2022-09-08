import React from "react";
import styled from "styled-components";
import { Row } from "components/Row";
import { TYPE } from "theme";
import { TokenLogo } from "components/Icons/Icons";
import { Info } from "components/QuestionHelper";
import { IncentivesAndKPIs, Box } from "./typesIncentivesKPIs";

const MainWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: row;
  @media (max-width: 2200px) {
    flex-direction: column;
  }
`;

const TwoBigBoxesWrapper = styled.div`
  display: flex;
  gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-wrap: wrap;
  `}
`;

const Wrapper = styled.div`
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
  min-height: 34px;
  box-sizing: border-box;
`;

export default function IncentivesKPI(props: {
  data: IncentivesAndKPIs;
  isOverflow: boolean | undefined;
}) {
  const column: boolean = props.isOverflow ?? false;
  return (
    <MainWrapper>
      <TwoBigBoxesWrapper
        style={column ? { flexDirection: "column" } : { flexDirection: "row" }}
      >
        <IncentivesORKPIs data={props.data.incentives} name='incentives' />
        <IncentivesORKPIs data={props.data.bonus} name='bonus' />
      </TwoBigBoxesWrapper>
      <IncentivesORKPIs data={props.data.kPIs} name='KPIs' />
    </MainWrapper>
  );
}

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
const Boxes = (props: { data: Array<Box> }) => (
  <>
    {props.data.map((each, i, arr) => (
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
    ))}
  </>
);

export function IncentivesORKPIs(props: {
  data: Array<Box>;
  name: "incentives" | "KPIs" | "bonus";
}) {
  const titles = {
    incentives: "Promoter Incentives",
    bonus: "Promoters Offer",
    KPIs: "Events & Actions - KPIs",
  };

  return (
    <Wrapper>
      {/* todo: add color to color scheme */}
      <TYPE.custom color='#959595' fontSize={12}>
        {titles[props.name]}
      </TYPE.custom>
      <MobileWrapper>
        <Boxes data={props.data} />
      </MobileWrapper>
    </Wrapper>
  );
}
