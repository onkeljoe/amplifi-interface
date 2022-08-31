import React, { useState } from "react";
import styled from "styled-components";
import { Info } from "react-feather";
import { Row } from "components/Row";
import { TYPE, TokenLogo } from "theme";
import { IncentivesAndKPIs, Box, InfoBox } from "./typesIncetivesKPIs";

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
  top: -88px;
  left: 0;
  z-index: 5;
  background-color: ${({ theme }) => theme.white};
  padding: 7px 12px;
  border: 2px solid #959595;
  color: ${({ theme }) => theme.primary1};
  border-color: ${({ theme }) => theme.black};
  width: 216px;
  height: 78px;
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
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
      <>
        <StyledBox>
          {each.icon && <TokenLogo name={each.icon} />}
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
          <a href={data.link.url} target='_blank' rel='noreferrer'>
            {data.link.text}
          </a>
        ) : null}
        {data.endText ? data.endText : null}
      </StyledInfoBox>
    </div>
  );
}
