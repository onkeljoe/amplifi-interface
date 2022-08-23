
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { AutoColumn } from "../Column";
import {
  TYPE,
  BlankInternalLink,
  OnlyAboveExtraSmall,
  OnlyAboveSmall,
  OnlyAboveLarge,
} from "../../theme";
import Row, { AutoRow, RowBetween, RowFixed } from "../Row";
import EmptyProfile from "../../assets/images/emptyprofile.png";
import { shortenAddress } from "../../utils";
import useENSName from "../../hooks/useENSName";
import {
  useActiveProtocol,
  useGlobalData,
  useGovernanceToken,
  useFilterActive,
  useTopDelegates,
  useUserDelegatee,
  useVerifiedDelegates,
  DelegateData,
  useMaxFetched,
} from "../../state/governance/hooks";
import {
  WrappedListLogo,
  RoundedProfileImage,
  DelegateButton,
  EmptyWrapper,
} from "../governance/styled";
import Card from "../Card";
import { useActiveWeb3React } from "../../hooks";
import {
  useToggleModal,
  useModalDelegatee,
} from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/actions";
import { Percent, JSBI } from "@uniswap/sdk";
import { LoadingRows } from "../Loader";
import { BIG_INT_ZERO } from "../../constants";
import { useTokenBalance } from "../../state/wallet/hooks";
import {
  useAllIdentities,
  useTwitterProfileData,
} from "../../state/social/hooks";
import { nameOrAddress } from "../../utils/getName";
import { FETCHING_INTERVAL } from "../../state/governance/reducer";
import Toggle from "components/Toggle";
import useList from "hooks/useList";

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

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;
const Arrow = styled.div<{ faded?: boolean }>`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
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

export default function PayoutList({ hideZero, title, url }: { hideZero: boolean, title?: string, url: string }) {
  const { chainId, account } = useActiveWeb3React();
  const [filter, setFilter] = useFilterActive();
  const [activeProtocol] = useActiveProtocol();

  const [page, setPage] = useState(1);
  const [maxFetched, setMaxFetched] = useMaxFetched();
  const boostedBribeList = useList(
    {
      idOrUrl: url, // config.airdrop.excel.id,
      source: "url-json",
      type: "payout"
    }
  );
  const data = []

  //refactor to useMemo
  if (boostedBribeList) {
    boostedBribeList.sort((a : any, b: any) => {
      return b.basicBoost2AmpInUSD - a.basicBoost2AmpInUSD 
    })
    for (let i = 0; i < boostedBribeList.length; i++) {
      console.log(boostedBribeList[i].address)
      data.push(
        {
        autonomous: true,
        delegatedVotes: boostedBribeList[i].basicBoost2AmpInUSD.toFixed(2),
        payoutUSD: boostedBribeList[i].payoutUSD.toFixed(2),
        delegatedVotesRaw: 12,
        EOA: true,
        handle: '132443',
        id: boostedBribeList[i].address,
        votePercent:1,
        votes: [
          {
            id: "Sdfsdf",
            support:true,
            votes: 1
          }
        ],
      })
    }
  }

  const PayoutRow = ({ d, index }: { d: any; index: number }) => {
    const name = null
    const percentOfVotes = 1
    const votes = d.delegatedVotes
    const payoutCre8rUSD = d.payoutUSD
    return (
      <AutoColumn>
        <DataRow>
          <AutoRow gap="10px" style={{ flexWrap: "nowrap" }}>
            <HiddenBelow1080>
              <FixedRankWidth>
                <NoWrap>{(page - 1) * FETCHING_INTERVAL + (index + 1)}</NoWrap>
              </FixedRankWidth>
            </HiddenBelow1080>
            <BlankInternalLink to={activeProtocol?.id + "/" + d.id}>
              <AccountLinkGroup gap="10px" width="initial">
                <HiddenBelow1080>
                  <WrappedListLogo
                    src={EmptyProfile}
                    alt="profile"
                    style={{ opacity: "0.2" }}
                  />
                </HiddenBelow1080>
                <AutoColumn gap="6px">
                  <ResponsiveText style={{ fontWeight: 500 }}>
                    {shortenAddress(d.id)}
                  </ResponsiveText>
                  {false ? (
                    <TYPE.black fontSize="12px">
                      {shortenAddress(d.id)}
                    </TYPE.black>
                  ) : (
                    <TYPE.black fontSize="12px" style={{ opacity: "0.6" }}>
                      {true ? "👤 EOA" : " 📜 Smart Contract"}
                    </TYPE.black>
                  )}
                </AutoColumn>
              </AccountLinkGroup>
            </BlankInternalLink>
          </AutoRow>
          <NoWrap textAlign="end">{votes !== "0.00" ? 1 : 0}</NoWrap>
          <NoWrap textAlign="end">{!payoutCre8rUSD
                ? "0 $AMP IN USD"
                : payoutCre8rUSD + (true ? " $CRE8R IN USD" : " $CRE8R IN USD")}</NoWrap>
          <Row style={{ justifyContent: "flex-end" }}>
            <VoteText textAlign="end">
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

  return activeProtocol && activeProtocol.id !== 'CRE8R' ? (
    <Card padding="20px">
      <EmptyWrapper>
        <TYPE.body style={{ marginBottom: "8px" }}>No payouts yet.</TYPE.body>
        <TYPE.subHeader>
          <i>Rewards for participating will appear here</i>
        </TYPE.subHeader>
      </EmptyWrapper>
    </Card>
  ) : (
    <Card padding="0">
      <OnlyAboveLarge>
        <RowBetween style={{ marginBottom: "32px", alignItems: "flex-start" }}>
          <TYPE.body fontSize="16px" fontWeight="600">
            {title}
          </TYPE.body>
          <OnlyAboveSmall>
            <RowFixed>
              <Toggle isActive={filter} toggle={() => setFilter(!filter)} />
            </RowFixed>
          </OnlyAboveSmall>
        </RowBetween>
      </OnlyAboveLarge>
      <AutoColumn gap="0">
        <DataRow>
          <ColumnLabel>Rank</ColumnLabel>
          <ColumnLabel textAlign="end">Proposals Voted</ColumnLabel>
          <ColumnLabel textAlign="end">Total CRE8R Rewards</ColumnLabel>
          <ColumnLabel textAlign="end">Total AMP Bonus</ColumnLabel>
        </DataRow>
        <Break />
        {true ? (
          data.map((j, i) => {
            return (
              <PayoutRow 
              index={i}
              //ts-ignore
              d={j} 
              key={j.id}
            />)
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
