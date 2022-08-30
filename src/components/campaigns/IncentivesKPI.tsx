import React, { useState } from "react";
import styled from "styled-components";
import { Info } from "react-feather";
import { Row } from "components/Row";
import { TYPE } from "theme";
import USDC from "../../assets/svg/usdc-logo.svg";
import Amplifi from "../../assets/images/amplifi-logo-no-text.png";
import CRE8R from "../../assets/images/cre8r-logo.png";
import ETH from "../../assets/svg/eth-logo.svg";
import { IncentivesAndKPIs, Box, Icon, InfoBox } from "./typesIncetivesKPIs";

const Wrapper = styled.div<{ name: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  padding: 15px 20px;
  border: 2px solid #959595;
  border-radius: 26px;
  width: ${({ name }) => (name === "KPIs" ? "100%" : "fit-content")};
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
  visibility: ${({ display }) => (display ? "visible" : "hidden")};
  opacity: ${({ display }) => (display ? "1" : "0")};
  transition: scale 0.4s;
  position: absolute;
  top: calc(-100% - 24px);
  left: calc(-100% - 48px);
  z-index: 5;
  background-color: ${({ theme }) => theme.white};
  padding: 7px 12px;
  border-radius: 26px;
  border: 2px solid #959595;
  color: ${({ theme }) => theme.primary1};
  border-color: ${({ theme }) => theme.black};
`;

const USDCLogo = styled.div`
  width: 13px;
  height: 13px;
  background-image: url(${USDC});
  background-size: cover;
  outline: none;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.25));
`;

const ETHLogo = styled(USDCLogo)`
  background-image: url(${ETH});
`;

const AmplifiLogo = styled(USDCLogo)`
  background-image: url(${Amplifi});
  border-radius: 50%;
`;

const CRE8RLogo = styled(USDCLogo)`
  background-image: url(${CRE8R});
  border-radius: 50%;
`;

export default function IncentivesKPI(props: { data: IncentivesAndKPIs }) {
  return (
    <Row gap='12px'>
      <IncentivesORKPIs data={props.data.incentives} name='incentives' />
      <IncentivesORKPIs data={props.data.KPIs} name='KPIs' />
    </Row>
  );
}

export function IncentivesORKPIs(props: {
  data: Array<Box>;
  name: "incentives" | "KPIs";
}) {
  // checks which logo to render
  function renderLogo(name: Icon) {
    switch (name) {
      case "ETH":
        return <ETHLogo />;
      case "USDC":
        return <USDCLogo />;
      case "AMP":
        return <AmplifiLogo />;
      case "CRE8R":
        return <CRE8RLogo />;
      default:
        return <AmplifiLogo />;
    }
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

  function InfoBoxComponent(props: { data: InfoBox }) {
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
          onMouseEnter={() => setDisplayInfo(true)}
          onMouseLeave={() => setDisplayInfo(false)}
          style={{ cursor: "help" }}
          size={13}
        />
        <StyledInfoBox display={displayInfo}>
          {data.startText ? data.startText : null}
          {data.link ? (
            <a href={data.link.url} target='_blank' rel='noreferrer'>
              {data.link.text}
            </a>
          ) : null}
          {data.endText ? data.endText : null}
        </StyledInfoBox>
      </div>
    );
  }

  // variable for all the boxes of incentives or KPIs and neccessary "AND"s
  const Boxes = props.data.map((each, i, arr) => {
    return (
      <>
        <StyledBox>
          {each.icon && renderLogo(each.icon)}
          <TYPE.custom color='#ffffff' fontSize={12}>
            {each.text}
          </TYPE.custom>
          {each.extraInfo && <InfoBoxComponent data={each.extraInfo} />}
        </StyledBox>
        {renderAND(arr, i)}
      </>
    );
  });

  return (
    <Wrapper name={props.name}>
      <TYPE.custom color='#959595' fontSize={12}>
        {props.name === "incentives"
          ? "For every referral you will get"
          : "Referral is generated when user"}
      </TYPE.custom>
      <Row gap='12px'>{Boxes}</Row>
    </Wrapper>
  );
}
