import React, { useState } from "react";
import Toggle from "components/Toggle";
import useList from "hooks/useList";
import styled from "styled-components";
import EmptyProfile from "../../assets/images/emptyprofile.png";
import {
  useActiveProtocol,
  useFilterActive,
} from "../../state/governance/hooks";
import { FETCHING_INTERVAL } from "../../state/governance/reducer";
import {
  BlankInternalLink,
  OnlyAboveLarge,
  OnlyAboveSmall,
  TYPE,
} from "../../theme";
import { shortenAddress } from "../../utils";
import Card from "../Card";
import { AutoColumn } from "../Column";
import { EmptyWrapper, WrappedListLogo } from "../governance/styled";
import { LoadingRows } from "../Loader";
import Row, { AutoRow, RowBetween, RowFixed } from "../Row";

const ColumnLabel = styled(TYPE.darkGray)`
  white-space: no-wrap;
  font-size: 15px;
`;

const NoWrap = styled(TYPE.black)`
  white-space: nowrap;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 132px 1fr 1fr;
  // grid-column-gap: 1rem;

  position: relative;
  margin: 6px 0;
  border-left: 3px solid transparent;

  :hover::after {
    content: "";
    border-left: 3px solid ${({ theme }) => theme.primary1};
    position: absolute;
    margin-left: calc(-2rem - 4px);
    height: 100%;
    width: 1px;
  }

  &:first-child {
    :hover {
      border-left: 3px solid transparent;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    grid-template-columns: 1fr 1fr 1fr;
     > *:nth-child(2){
      display: none;
    }
  `};

  @media (max-width: 1370px) {
    grid-template-columns: 2fr 1fr 1fr;
    padding: 0 0.5rem;
    > *:nth-child(2) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 2fr 1fr 1.2fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr 1fr;
    margin: 0;
    padding: 0 1rem;
    > *:nth-child(3) {
      display: none;
    }
  `};
`;
 
const AccountLinkGroup = styled(AutoRow)`
  :hover {
    /* opacity: 0.5; */
    /* border-radius: 8px; */
  }

  flex-wrap: nowrap;
`;

const VoteText = styled(NoWrap)`
  width: 120px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

const FixedRankWidth = styled.div`
  width: 12px;
  text-align: right;
  margin-right: 0px;
`;

const HiddenBelow1080 = styled.span`
  @media (max-width: 1080px) {
    display: none;
  }
`;

const ResponsiveText = styled(TYPE.black)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 12px 0;
`;

export default function PayoutList({
  title,
  description,
  url,
  dataConverter,
}: {
  hideZero: boolean;
  title?: string;
  description?: string;
  url: string;
  dataConverter: any;
}) {
  const [filter, setFilter] = useFilterActive();
  const [activeProtocol] = useActiveProtocol();

  const [page] = useState(1);
  const boostedBribeList = useList({
    idOrUrl: url, // config.airdrop.excel.id,
    source: "url-json",
    type: "payout",
  });
  let data;

  //refactor to useMemo
  if (boostedBribeList) {
    data = dataConverter(boostedBribeList);
  }

  const PayoutRow = ({ d, index }: { d: any; index: number }) => {
    const votes = d.delegatedVotes;
    const payoutCre8rUSD = d.payoutUSD;
    return (
      <AutoColumn>
        <DataRow>
          <AutoRow gap='10px' style={{ flexWrap: "nowrap" }}>
            <HiddenBelow1080>
              <FixedRankWidth>
                <NoWrap>{(page - 1) * FETCHING_INTERVAL + (index + 1)}</NoWrap>
              </FixedRankWidth>
            </HiddenBelow1080>
            <BlankInternalLink to={activeProtocol?.id + "/" + d.id}>
              <AccountLinkGroup gap='10px' width='initial'>
                <HiddenBelow1080>
                  <WrappedListLogo
                    src={EmptyProfile}
                    alt='profile'
                    style={{ opacity: "0.2" }}
                  />
                </HiddenBelow1080>
                <AutoColumn gap='6px'>
                  <ResponsiveText style={{ fontWeight: 500 }}>
                    {shortenAddress(d.id)}
                  </ResponsiveText>
                  {false ? (
                    <TYPE.black fontSize='12px'>
                      {shortenAddress(d.id)}
                    </TYPE.black>
                  ) : (
                    <TYPE.black fontSize='12px' style={{ opacity: "0.6" }}>
                      {true ? "👤 EOA" : " 📜 Smart Contract"}
                    </TYPE.black>
                  )}
                </AutoColumn>
              </AccountLinkGroup>
            </BlankInternalLink>
          </AutoRow>
          <NoWrap textAlign='end'>{/* {votes !== "0.00" ? 1 : 0} */}</NoWrap>
          <NoWrap textAlign='end'>
            {!payoutCre8rUSD
              ? "0 $AMP IN USD"
              : payoutCre8rUSD + (true ? " $CRE8R IN USD" : " $CRE8R IN USD")}
          </NoWrap>
          <Row style={{ justifyContent: "flex-end" }}>
            <VoteText textAlign='end'>
              {!votes
                ? "0 $AMP IN USD"
                : votes + (true ? " $AMP IN USD" : " $AMP IN USD")}
            </VoteText>
          </Row>
        </DataRow>
        <Break />
      </AutoColumn>
    );
  };

  return activeProtocol && activeProtocol.id !== "CRE8R" ? (
    <Card padding='20px'>
      <EmptyWrapper>
        <TYPE.body style={{ marginBottom: "8px" }}>No payouts yet.</TYPE.body>
        <TYPE.subHeader>
          <i>Rewards for participating will appear here</i>
        </TYPE.subHeader>
      </EmptyWrapper>
    </Card>
  ) : (
    <Card padding='0'>
      <OnlyAboveLarge>
        <RowBetween style={{ marginBottom: "32px", alignItems: "flex-start" }}>
          <div>
            <TYPE.body fontSize='16px' fontWeight='600'>
              {title}
            </TYPE.body>
            {description && (
              <TYPE.body fontSize='10px' fontWeight={"400"} paddingTop={"10px"}>
                {description}
              </TYPE.body>
            )}
          </div>
          <OnlyAboveSmall>
            <RowFixed>
              <Toggle isActive={filter} toggle={() => setFilter(!filter)} />
            </RowFixed>
          </OnlyAboveSmall>
        </RowBetween>
      </OnlyAboveLarge>
      <AutoColumn gap='0'>
        <DataRow>
          <ColumnLabel>Rank</ColumnLabel>
          <ColumnLabel textAlign='end'>{/* Proposals Voted */}</ColumnLabel>
          <ColumnLabel textAlign='end'>Total CRE8R Rewards</ColumnLabel>
          <ColumnLabel textAlign='end'>Total AMP Bonus</ColumnLabel>
        </DataRow>
        <Break />
        {data ? (
          data.map((j: any, i: any) => {
            return (
              <PayoutRow
                index={i}
                //ts-ignore
                d={j}
                key={j.id}
              />
            );
          })
        ) : (
          <LoadingRows>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRows>
        )}
      </AutoColumn>
    </Card>
  );
}
