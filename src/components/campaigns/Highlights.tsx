import React from "react";
import styled from "styled-components";
import { Row } from "components/Row";
import { incomingHighlightes } from "./typesIncentivesKPIs";
import HighlightBox from "../HighlightBox/HighlightBox";

const Break = styled.div`
  width: 1px;
  background-color: #d9d9d9;
  margin-left: 14px;
  margin-right: 7px;
  height: 26px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: none;
  `}
`;

const ComponentWrapper = styled(Row)`
  align-items: flex-start;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 18px;
  padding: 22px 0 18px 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  justify-content: center;
  `}
`;

export default function Highlights(props: { data: incomingHighlightes }) {
  const { data } = props;

  return (
    <ComponentWrapper>
      {data.map((each, i, arr) => (
        <>
          <HighlightBox data={each} key={each.type} />
          {renderBreak(arr, i)}
        </>
      ))}
    </ComponentWrapper>
  );

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
