import React from "react";
import { ChevronRight } from "react-feather";
import styled from "styled-components";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";

import { RouteComponentProps, withRouter } from "react-router-dom";
import { ProposalStatus } from "components/governance/styled";

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

const DetailText = styled.div`
  word-break: break-all;
`;

const MarkDownWrapper = styled.div`
  overflow: scroll;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 400px;
  `};
`;

const AddressWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 300px;
  `};
`;

function Breadcrumb({
  title,
  history,
  proposalID,
}: {
  title: string;
  history: any;
  proposalID?: string;
}) {
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
