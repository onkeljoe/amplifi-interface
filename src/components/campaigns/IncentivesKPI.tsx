import React, { useState } from "react";
import styled from "styled-components";
import { Info } from "react-feather";
import { Row } from "components/Row";
import { TYPE } from "theme";
import { TokenLogo } from "components/Icons/Icons";
import { IncentivesAndKPIs, Box, InfoBox } from "./typesIncetivesKPIs";

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

const StyledInfoBox = styled.div<{ display: boolean }>`
  font-size: 12px;
  font-weight: 500;
  visibility: ${({ display }) => (display ? "visible" : "hidden")};
  opacity: ${({ display }) => (display ? "1" : "0")};
  position: absolute;
  top: -88px;
  left: 0;
  z-index: 5;
  background: #959595;
  border: 2px solid #959595;
  border-radius: 8px;
  padding: 9px;
  color: ${({ theme }) => theme.white};
  width: 216px;
  height: 64px;
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
          {each.extraInfo && <InfoBoxComponent data={each.extraInfo} />}
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

// todo: research how to make it more elegant (libraby? or smth)
export function InfoBoxComponent(props: { data: InfoBox }) {
  const [displayInfo, setDisplayInfo] = useState<boolean>(false);
  const { data } = props;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Info
        onClick={() => setDisplayInfo(!displayInfo)}
        style={{ cursor: "help" }}
        size={13}
      />
      <StyledInfoBox display={displayInfo}>
        {data.startText ? data.startText : null}
        {data.link ? (
          <span color='#FFD6CC'>
            <a href={data.link.url} target='_blank' rel='noreferrer'>
              {data.link.text}
            </a>
          </span>
        ) : null}
        {data.endText ? data.endText : null}
      </StyledInfoBox>
    </div>
  );
}
