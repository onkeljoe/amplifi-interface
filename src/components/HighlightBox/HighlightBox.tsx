import React from "react";
import styled from "styled-components";
import { TYPE } from "theme";
import { Row } from "components/Row";
import Column from "components/Column";
import { TokenLogo, HighlightIcon } from "components/Icons/Icons";
import { Money, Calendar, Referree } from "../campaigns/typesIncentivesKPIs";
import { Info } from "components/QuestionHelper";

const BoxContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  `}
`;

export default function HighlightBox(props: {
  data: Money | Calendar | Referree;
}) {
  const { data } = props;
  switch (data.type) {
    case "money":
      return (
        <BoxContainer>
          <HighlightIcon type='money' />
          <Column style={{ gap: "2px" }}>
            <Row gap='22px'>
              <TYPE.black fontWeight={500} fontSize={12}>
                {data.mainText}
              </TYPE.black>
              <Row gap='2px'>
                {(data as Money).payoutTokens.map((eachToken) => (
                  <TokenLogo name={eachToken} key={eachToken} />
                ))}
              </Row>
            </Row>
            <Row>
              <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                {data.subText}
              </TYPE.custom>
            </Row>
          </Column>
        </BoxContainer>
      );
    case "calendar":
      return (
        <BoxContainer>
          <HighlightIcon type='calendar' />
          <Column style={{ gap: "2px" }}>
            <Row gap='7px'>
              <TYPE.black fontWeight={500} fontSize={12}>
                {data.mainText}
              </TYPE.black>
              {data.extraInfo && <Info data={data.extraInfo} />}
            </Row>
            <Row>
              <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                {data.subText}
              </TYPE.custom>
            </Row>
          </Column>
        </BoxContainer>
      );
    case "referree":
      return (
        <BoxContainer>
          <HighlightIcon type='referree' />
          <Column style={{ gap: "2px" }}>
            <Row gap='7px'>
              <Row gap='2px' width='fit-content'>
                {(data as Referree).giveTokens.map((eachToken) => (
                  <TokenLogo name={eachToken} key={eachToken} />
                ))}
              </Row>
              <TYPE.black fontWeight={500} fontSize={12}>
                {data.mainText}
              </TYPE.black>
              {data.extraInfo && <Info data={data.extraInfo} />}
            </Row>
            <Row>
              <TYPE.custom fontWeight={500} fontSize='8px' color='#959595'>
                {data.subText}
              </TYPE.custom>
            </Row>
          </Column>
        </BoxContainer>
      );
    default:
      return null;
  }
}
