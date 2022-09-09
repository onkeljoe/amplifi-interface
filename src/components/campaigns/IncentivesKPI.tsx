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
  align-items: center;
  `}
`;

const BoxesWrapper = styled(Row)`
  gap: 12px;
  width: unset;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 100%;
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 100%;
  justify-content: center;
  `}
`;

const ANDWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
display: none;
`}
`;

export default function IncentivesKPI(props: { data: IncentivesAndKPIs }) {
  const [isOverflow, setIsOverflow] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        setIsOverflow(ref.current?.scrollWidth > ref.current?.clientWidth);
      }
    };
    checkOverflow();
  }, [props.data]);
  return (
    <MainWrapper ref={ref}>
      <TwoBigBoxesWrapper
        style={
          isOverflow ? { flexDirection: "column" } : { flexDirection: "row" }
        }
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
    <ANDWrapper>
      <TYPE.custom color='#959595' fontSize={12}>
        AND
      </TYPE.custom>
    </ANDWrapper>
  );
}

const Boxes = (props: { data: Array<Box> }) => (
  <>
    {props.data.map((each, i, arr) => (
      <BoxesWrapper key={i}>
        <StyledBox>
          {each.icon && (
            <TokenLogo
              name={each.icon}
              customURL={
                each.iconImage && each.iconImage.link
                  ? each.iconImage.link
                  : undefined
              }
            />
          )}
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
