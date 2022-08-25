import React from "react";
import { ChevronRight } from "react-feather";
import styled from "styled-components";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import { RowFixed } from "../Row";

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && "0.4"};
`;

function Breadcrumb({ title, history }: { title: string; history: any }) {
  return (
    <RowFixed>
      <ArrowWrapper
        onClick={() => {
          if (!history) return;
          history?.length === 1 ? history.push("/") : history.goBack();
        }}
        style={{ alignItems: "flex-start" }}
      >
        <TYPE.body fontWeight='600'>{title}</TYPE.body>
      </ArrowWrapper>
      <ChevronRight size={16} />
      <TYPE.body>{title}</TYPE.body>
    </RowFixed>
  );
}

export default Breadcrumb;
