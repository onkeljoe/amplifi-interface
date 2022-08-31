import React from "react";
import styled from "styled-components";
import { Row } from "components/Row";
import { incomingHighlightes } from "./typesIncetivesKPIs";
import HighlightBox from "../HighlightBox/HighlightBox";

const Break = styled.div`
  width: 1px;
  background-color: #d9d9d9;
  margin-left: 14px;
  margin-right: 7px;
  height: 26px;
`;

export default function Highlights(props: { data: incomingHighlightes }) {
  const { data } = props;

  return (
    <Row
      alignItems='flex-start'
      style={{
        borderBottom: "1px solid #D7D7D7",
        marginBottom: "18px",
        padding: "22px 0 18px 0",
      }}
    >
      {data.map((each, i, arr) => (
        <>
          <HighlightBox data={each} key={each.type} />
          {renderBreak(arr, i)}
        </>
      ))}
    </Row>
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
