import React from "react";
import styled from "styled-components";
import {
  TYPE,
  USDCLogo,
  ETHLogo,
  AmplifiLogo,
  CRE8RLogo,
  HighlightIcon,
} from "theme";
import { Row } from "components/Row";
import Column from "components/Column";
import { Money, Calendar, Referree, Icon } from "./typesIncetivesKPIs";
import { InfoBoxComponent } from "./IncentivesKPI";

type incomingHighlightes = Array<Money | Calendar | Referree>;

const Break = styled.div`
  width: 1px;
  background-color: #d9d9d9;
  margin-left: 14px;
  margin-right: 7px;
  height: 26px;
`;

const BoxContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export default function Highlights(props: { data: incomingHighlightes }) {
  const { data } = props;

  // todo: make this boxes as unique components in separate file so we have clearer code in here
  // even make it one component which will have the layout logic for money calendar etc in it depending on type
  const Boxes = data.map((each, i, arr) => {
    switch (each.type) {
      case "money":
        return (
          <BoxContainer>
            <HighlightIcon type='money' />
            <Column style={{ gap: "2px" }}>
              <Row gap='22px'>
                <TYPE.black fontWeight={500} fontSize={12}>
                  {each.mainText}
                </TYPE.black>
                <Row gap='2px'>
                  {(each as Money).payoutTokens.map((eachToken) =>
                    renderLogo(eachToken)
                  )}
                </Row>
              </Row>
              <Row>
                <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                  {each.subText}
                </TYPE.custom>
              </Row>
            </Column>
            {renderBreak(arr, i)}
          </BoxContainer>
        );
      case "calendar":
        return (
          <BoxContainer>
            <HighlightIcon type='calendar' />
            <Column style={{ gap: "2px" }}>
              <Row gap='7px'>
                <TYPE.black fontWeight={500} fontSize={12}>
                  {each.mainText}
                </TYPE.black>
                {each.infoBox && <InfoBoxComponent data={each.infoBox} />}
              </Row>
              <Row>
                <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                  {each.subText}
                </TYPE.custom>
              </Row>
            </Column>
            {renderBreak(arr, i)}
          </BoxContainer>
        );
      case "referree":
        return (
          <BoxContainer>
            <HighlightIcon type='referree' />
            <Column style={{ gap: "2px" }}>
              <Row gap='7px'>
                <Row gap='2px' width='fit-content'>
                  {(each as Referree).giveTokens.map((eachToken) =>
                    renderLogo(eachToken)
                  )}
                </Row>
                <TYPE.black fontWeight={500} fontSize={12}>
                  {each.mainText}
                </TYPE.black>
                {each.infoBox && <InfoBoxComponent data={each.infoBox} />}
              </Row>
              <Row>
                <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                  {each.subText}
                </TYPE.custom>
              </Row>
            </Column>
            {renderBreak(arr, i)}
          </BoxContainer>
        );
      default:
        return (
          <BoxContainer>
            <HighlightIcon type='money' />
            {renderBreak(arr, i)}
          </BoxContainer>
        );
    }
  });

  return (
    <Row
      alignItems='flex-start'
      style={{
        borderBottom: "1px solid #D7D7D7",
        marginBottom: "18px",
        padding: "22px 0 18px 0",
      }}
    >
      {Boxes}
    </Row>
  );

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

  function renderBreak(arr: incomingHighlightes, i: number) {
    if (arr.length === 1) {
      return;
    }
    if (!arr[i + 1]) {
      return;
    }
    return <Break />;
  }
}
