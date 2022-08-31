import React, { useMemo } from "react";
import { withRouter } from "react-router-dom";
import { BodyWrapper } from "./AppBody";
import {
  useActiveProtocol,
  useDelegateInfo,
  useGovernanceToken,
  useAllProposals,
  useAllProposalStates,
  useUserDelegatee,
} from "../state/governance/hooks";
import { RouteComponentProps } from "react-router-dom";
import { useActiveWeb3React } from "../hooks";
import { ChainId, Token, JSBI } from "@uniswap/sdk";
import Card, { GreyCard, OutlineCard } from "../components/Card";
import { useProtocolUpdate } from "../hooks/useProtocolUpdate";
import styled from "styled-components";
import { RowBetween, AutoRow, RowFixed } from "../components/Row";
import { CheckCircle, XCircle, ChevronRight } from "react-feather";
import { AutoColumn } from "../components/Column";
import EmptyProfile from "../assets/images/emptyprofile.png";
import {
  RoundedProfileImage,
  WrappedListLogo,
  ProposalStatusSmall,
  DelegateButton,
  EmptyWrapper,
} from "../components/governance/styled";
import {
  getTwitterProfileLink,
  getEtherscanLink,
  shortenAddress,
  isAddress,
} from "../utils";
import {
  TYPE,
  ExternalLink,
  GreenIcon,
  RedIcon,
  StyledInternalLink,
  OnlyAboveSmall,
} from "../theme";
import {
  useIdentity,
  useTwitterProfileData,
  useAllIdentities,
} from "../state/social/hooks";
import { useTokenBalance } from "state/wallet/hooks";
import Loader from "../components/Loader";
import { enumerateProposalState } from "../data/governance";
import CopyHelper from "../components/AccountDetails/Copy";
import { useIsEOA } from "../hooks/useIsEOA";
import { useIsAave } from "../hooks/useContract";
import { useToggleModal, useModalDelegatee } from "../state/application/hooks";
import { ApplicationModal } from "../state/application/actions";
import { BIG_INT_ZERO } from "../constants";
import useENS from "../hooks/useENS";
import { nameOrAddress } from "../utils/getName";
import { useUserPayout, usePricesUSD } from "state/campaigns/hooks";
import { BigNumber } from "ethers";
import { PayoutToken } from "data/payouts";
import {
  getPayoutsFromUser,
  NormalizedPayoutToken,
  normalizePayout,
  normalizePayouts,
} from "utils/payouts";

interface Total {
  amountUSD: number;
  amountNum: string;
}

type Breakdown = Array<{
  symbol: string;
  total: Total;
}>;

const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
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

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr 1fr;
  `};
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg4};
  height: 1px;
`;

const ResponsiveDataText = styled(TYPE.black)`
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

const ResponsiveBodyText = styled(TYPE.black)`
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`;

function localNumber(val: number) {
  return parseFloat(parseFloat(val.toString()).toFixed(0)).toLocaleString();
}

function PayoutInfo({
  match: {
    params: { protocolID },
  },
}: RouteComponentProps<{ protocolID?: string }>) {
  // if valid protocol id passed in, update global active protocol
  useProtocolUpdate(protocolID);

  const { chainId, account } = useActiveWeb3React();

  const [activeProtocol] = useActiveProtocol();

  const formattedAddress = isAddress(account || undefined);

  const isEOA = useIsEOA(account || undefined);

  // get social data from Sybil list
  const identity = useIdentity(account);
  const twitterHandle = identity?.twitter?.handle;
  const twitterData = useTwitterProfileData(twitterHandle);
  const [allIdentities] = useAllIdentities();

  // ens name if they have it
  const ensName = useENS(formattedAddress ? formattedAddress : null)?.name;

  const nameShortened = nameOrAddress(
    formattedAddress ? formattedAddress : undefined,
    allIdentities,
    true,
    undefined,
    ensName
  );

  const userPayoutResponse = useUserPayout(
    "0x069e85d4f1010dd961897dc8c095fbb5ff297434" || undefined
  );
  const userPayouts = userPayoutResponse?.data;
  const pricesUSD = usePricesUSD();

  const userTokens = useMemo<
    | {
        totalUSD: number;
        breakdown: Breakdown;
      }
    | undefined
  >(() => {
    if (!userPayouts || !userPayouts.user || pricesUSD === undefined)
      return undefined;
    let totalUSD = 0;
    const breakdown: Breakdown = [];
    const payoutsSum = getPayoutsFromUser(userPayouts, pricesUSD);

    for (const payout of payoutsSum) {
      const p = payout[1];
      breakdown.push({
        symbol: p.symbol,
        total: {
          amountNum: p.amountNum,
          amountUSD: p.amountUSD,
        },
      });
      totalUSD += p.amountUSD;
    }
    console.log({
      totalUSD: totalUSD,
      breakdown,
    });
    return {
      totalUSD: totalUSD,
      breakdown,
    };
  }, [userPayouts, pricesUSD]);

  return (
    <BodyWrapper>
      {account ? (
        <AutoColumn gap='lg'>
          <GreyCard>
            <RowBetween>
              <AutoRow gap='10px'>
                {twitterData?.profileURL ? (
                  <RoundedProfileImage>
                    <img src={twitterData.profileURL} alt='profile' />
                  </RoundedProfileImage>
                ) : (
                  <WrappedListLogo src={EmptyProfile} />
                )}
                <AutoColumn gap='2px'>
                  <RowFixed>
                    <ExternalLink
                      href={
                        twitterHandle
                          ? getTwitterProfileLink(twitterHandle)
                          : getEtherscanLink(
                              chainId || 1,
                              formattedAddress || account,
                              "address"
                            )
                      }
                    >
                      <TYPE.black>
                        {nameShortened === formattedAddress
                          ? ensName ?? formattedAddress
                          : nameShortened}
                      </TYPE.black>
                    </ExternalLink>
                    {!twitterHandle && (
                      <CopyHelper toCopy={formattedAddress || account} />
                    )}
                  </RowFixed>
                  {twitterHandle ||
                  nameShortened !== shortenAddress(account) ? (
                    <RowFixed>
                      <ExternalLink
                        href={getEtherscanLink(
                          chainId || 1,
                          formattedAddress || account,
                          "address"
                        )}
                      >
                        <TYPE.black fontSize='12px'>
                          {shortenAddress(account)}
                        </TYPE.black>
                      </ExternalLink>
                      <CopyHelper toCopy={formattedAddress || account} />
                    </RowFixed>
                  ) : (
                    <TYPE.black fontSize='12px'>
                      {isEOA === true
                        ? "👤 EOA"
                        : isEOA === false && "📜 Smart Contract"}
                    </TYPE.black>
                  )}
                </AutoColumn>
              </AutoRow>
            </RowBetween>
          </GreyCard>
          <GreyCard>
            <DataRow>
              <AutoColumn gap='sm'>
                <TYPE.main fontSize='14px'>{`Total Earnings`}</TYPE.main>
                <ResponsiveDataText>
                  {userTokens ? <>~${userTokens.totalUSD}</> : <Loader />}
                </ResponsiveDataText>
              </AutoColumn>
            </DataRow>
          </GreyCard>
          <GreyCard>
            <AutoColumn gap='lg'>
              <TYPE.main fontSize='16px'>Payout History</TYPE.main>
              <Break />
              {userPayouts &&
              userPayouts.user &&
              userPayouts.user.payouts.length > 0 ? (
                userPayouts.user.payouts
                  .map(({ campaign, tokens, status }, i) => {
                    return (
                      <div key={i}>
                        <RowBetween
                          key={i + "proposal id"}
                          style={{ alignItems: "flex-start" }}
                        >
                          <AutoColumn
                            gap='sm'
                            style={{ maxWidth: "500px" }}
                            justify='flex-start'
                          >
                            <StyledInternalLink
                              to={
                                "/proposals/" +
                                activeProtocol?.id +
                                "/" +
                                "proposal id"
                              }
                            >
                              <ResponsiveBodyText style={{ maxWidth: "240px" }}>
                                {campaign.slug}
                              </ResponsiveBodyText>
                            </StyledInternalLink>
                            {true && (
                              <RowFixed>
                                <ProposalStatusSmall status={"status"}>
                                  {status}
                                </ProposalStatusSmall>
                              </RowFixed>
                            )}
                          </AutoColumn>
                          <AutoColumn
                            gap='sm'
                            justify='flex-start'
                            style={{ height: "100%" }}
                          >
                            <RowFixed>
                              <div style={{ paddingRight: "5px" }}>
                                {tokens.map(
                                  ({
                                    token: { name, decimals, symbol },
                                    amountNum,
                                    amountUSD,
                                  }) => {
                                    BigNumber;
                                    return (
                                      <div key={"1"}>
                                        {amountNum !== null &&
                                          decimals !== null &&
                                          `${BigNumber.from(amountNum).div(
                                            BigNumber.from(
                                              Math.pow(10, decimals)
                                            )
                                          )} ${symbol}`}
                                        {amountUSD && `$${amountUSD} ${symbol}`}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                              {true ? (
                                <GreenIcon>
                                  <CheckCircle />
                                </GreenIcon>
                              ) : (
                                <RedIcon>
                                  <XCircle />
                                </RedIcon>
                              )}
                            </RowFixed>
                          </AutoColumn>
                        </RowBetween>
                        {i !== 0 && <Break style={{ marginTop: "24px" }} />}
                      </div>
                    );
                  })
                  .reverse()
              ) : userPayouts && userPayouts.user ? (
                <TYPE.body>No past rewards</TYPE.body>
              ) : (
                <Loader />
              )}
            </AutoColumn>
          </GreyCard>
        </AutoColumn>
      ) : (
        // <Loader />
        <Card padding='20px'>
          <EmptyWrapper>
            <TYPE.body style={{ marginBottom: "8px" }}>
              Connect your wallet to view your payouts
            </TYPE.body>
            <TYPE.subHeader></TYPE.subHeader>
          </EmptyWrapper>
        </Card>
      )}
    </BodyWrapper>
  );
}

export default withRouter(PayoutInfo);
