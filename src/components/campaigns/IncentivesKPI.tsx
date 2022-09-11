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
const MobileWrapper = styled(Row)`
  //  this is the wrapper for the mobile view
  gap: 12px;
  background-color: #0bc811;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  align-items: center;
  `}
`;

const ThreeBigBoxesWrapper = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`;

const Wrapper = styled.div`
  // this is the main wrapper for all of the orange boxes
  // what is this?
  display: flex;
  flex-direction: column; // this makes the heading and the orange boxes stack :)
  // align-items: stretch; // this is making them full width!!
  /* background-over: linear-gradient(90deg, #008552 0%, #9ebd13 100%); */
  /* background-image: url(https://www.toptal.com/designers/subtlepatterns/uploads/circuit.png); */
  background-color: #fe3700 !important;

  background-image: url("https://www.transparenttextures.com/patterns/maze-white.png");

  gap: 9px;
  padding: 15px 13px;
  /* border: 2px solid #959595;*/
  border-radius: 10px;
  flex: 50%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex: 100%;
  align-items: center;
  `}
`;

const BoxesWrapper = styled.div`
  // this is wrapping every box :( which is not really what we
  display: flex;
  flex-flow: row wrap;
  gap: 2px;
  justify-content: space-between;
  flex: 1;
  flex-basis: 100%;
  /* align-items: stretch;
  align-content: stretch; */
`;

const StyledBox = styled.div`
  // this is the orange rounded box BUT there are other wrappers around it causing issues?
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  display: flex;
  padding: 7px 12px;
  border-radius: 10px;
  white-space: nowrap;
  align-items: center;
  align-content: stretch;
  /* width: 300px; */
  box-sizing: border-box;
  /* background-color: #FFBC7D !important; */
  // css gradient

  background-color: #ffbc7d76;
  flex-grow: 1;
  flex-basis: 100%;
  justify-content: space-between;
  /* flex-grow: 1; */
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: space-between;
  `};
`;

const IconAndText = styled.div`
  gap: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #000000;
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
      <ThreeBigBoxesWrapper style={{ flexDirection: "row" }}>
        <IncentivesORKPIs data={props.data.incentives} name='incentives' />
        <IncentivesORKPIs data={props.data.bonus} name='bonus' />
        <IncentivesORKPIs data={props.data.kPIs} name='KPIs' />
      </ThreeBigBoxesWrapper>
    </MainWrapper>
  );
}

const Boxes = (props: { data: Array<Box> }) => (
  <BoxesWrapper style={{ flexFlow: "row wrap" }}>
    {props.data.map((each, i, arr) => (
      <StyledBox key={i}>
        <IconAndText>
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
          <TYPE.custom color='#000000' fontSize={13}>
            {each.text}
          </TYPE.custom>
        </IconAndText>
        {each.extraInfo && <Info data={each.extraInfo} />}
      </StyledBox>
    ))}
  </BoxesWrapper>
);

export function IncentivesORKPIs(props: {
  data: Array<Box>;
  name: "incentives" | "KPIs" | "bonus";
}) {
  const titles = {
    incentives: "Promoter Incentives 💸",
    bonus: "Promoters Offer 🤝",
    KPIs: "Events & Actions - KPIs 🎯",
  };

  return (
    <Wrapper>
      {/* todo: add color to color scheme */}
      <TYPE.custom color='#000000' fontSize={15} fontWeight={600}>
        {titles[props.name]}
      </TYPE.custom>

      <Boxes data={props.data} />
    </Wrapper>
  );
}
