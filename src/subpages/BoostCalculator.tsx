import React, { useEffect, useState } from "react";
import snapshot from "@snapshot-labs/snapshot.js";
import axios from "axios";
import { LoadingRows } from "components/Loader";
import toast from "components/Toast";
import { useActiveWeb3React } from "hooks";
import useCountdown from "hooks/useCountdown";
import useCRE8RPrice from "hooks/useCRE8RPrice";
import styled from "styled-components";
import { nFormatter } from "utils/format";
import { calcProjectedPayouts } from "./data/projectedPayouts";
import useBribe from "./hooks/useBribe";
import { calcChange, formatChange } from "./math";

const {
  PREV_BLOCKNUMBER,
  CURR_BLOCKNUMBER,
  AMP_PRICE_USD,
  PAYOUT_PER_TOTAL_PERCENT_USD,
  DATE_START,
  PROPOSAL_ID,
} = {
  PREV_BLOCKNUMBER: 45482115,
  CURR_BLOCKNUMBER: 46000928,
  AMP_PRICE_USD: 0.01,
  PAYOUT_PER_TOTAL_PERCENT_USD: 32032.9 / 100,
  DATE_START: "Sep 1, 2022 3:00:00 GMT-07:00",
  PROPOSAL_ID:
    "0xa043b7eea5b8714c80f8c7c0caf7b6246e3ee20f1474ce717ee3301d848bed2d",
};

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const lastPayoutUri = `https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-${PREV_BLOCKNUMBER}.json`;
const client = new snapshot.Client712(hub);

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
`;

const VoteButton = styled.a`
  background-image: ${({ theme }) => theme.special};
  margin: 5px;
  font-size: 12px;
  padding: 10px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: #fff;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    margin: 8px 10px 12px;
    background-position: right center;
    cursor: pointer;
  }
`;

function BoostCalculator() {
  const { library, account } = useActiveWeb3React();
  const { cre8rPrice } = useCRE8RPrice();
  const {
    cre8rScore: pastCS,
    beetsScore: pastBS,
    beetsScoreBreakdown,
  } = useBribe(account, PREV_BLOCKNUMBER); //has a blocknumber default
  const {
    cre8rScore: currentCS,
    beetsScore: currentBS,
    cre8rScoreBreakdown,
  } = useBribe(account, CURR_BLOCKNUMBER); // what year would this be?
  const cre8rChange =
    pastCS && (currentCS || currentCS == 0) && calcChange(pastCS, currentCS);
  const beetsChange =
    pastBS && (currentBS || currentBS == 0) && calcChange(pastBS, currentBS);
  const [lastPayout, setLastPayout] = useState([]);

  const accountLastPayout: any =
    lastPayout && lastPayout.find((i: any) => i.address == account);
  console.log(accountLastPayout);
  let projectedPayout;
  if (account && beetsScoreBreakdown && pastCS && currentCS && cre8rPrice) {
    projectedPayout = calcProjectedPayouts(
      account,
      {
        numOfFBeetsOfAccount:
          beetsScoreBreakdown?.beetsScore / beetsScoreBreakdown?.fBeetsPrice,
        lastHoldingsUSD: pastCS / cre8rPrice,
        currentHoldingsUSD: currentCS / cre8rPrice,
        lastPayoutUSD:
          (accountLastPayout && accountLastPayout.lastWeekPayoutInCRE8R) || 0,
      },
      cre8rPrice,
      PAYOUT_PER_TOTAL_PERCENT_USD
    );
  }
  const loaded =
    (pastCS || pastCS == 0) &&
    (pastBS || pastBS == 0) &&
    (cre8rChange || cre8rChange == 0) &&
    (beetsChange || beetsChange == 0);
  const activeText = "Vote 100% For CRE8R In F-Major";
  const countdownText = useCountdown(
    DATE_START,
    "Vote 100% For CRE8R In F-Major"
  );
  const active = activeText === countdownText;
  useEffect(() => {
    axios.get(lastPayoutUri).then((res) => {
      if (res.status === 200) {
        setLastPayout(res.data);
      }
    });
  }, []);

  if (!account) {
    return (
      <>
        <div>Connect a wallet that voted to view your Boosted Bribes VP</div>
      </>
    );
  }
  return (
    <>
      {/* TODO: Get snapshot query: https://docs.snapshot.org/snapshot.js */}
      {!loaded ? (
        <>
          <LoadingRows>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </LoadingRows>
        </>
      ) : (
        <>
          <VoteButton
            onClick={() => {
              if (!account || !library || !active) return;
              (client as any)
                .vote(library as any, account, {
                  space: "beets.eth",
                  proposal: PROPOSAL_ID,
                  type: "weighted",
                  choice: { "43": 1 },
                })
                .then((receipt: any) => {
                  console.log(receipt);
                  toast.success(
                    "Vote is successful! Thank you for voting for CRE8R-FTM."
                  );
                })
                .catch((err: any) => console.log(err));
            }}
          >
            {countdownText}
          </VoteButton>
          {/* <div>
        <h1>Bribe Tiers</h1>
      </div> */}
          <Table>
            <caption>
              Bribe Payout Calculator *Assumes 100% Vote On CRE8R-FTM
            </caption>
            <tr>
              <th>Bribe Tier</th>
              <th>Holdings Increase Requirement</th>
              <th>CRE8R Payout</th>
              <th>Status</th>
              <th>Holdings Increase Requirement For Bonus $AMP</th>
              <th>AMP Payout</th>
              <th>Status</th>
            </tr>
            <tr className='basic_bribe'>
              <td>
                Basic Bribe
                <p className='smalldesc'>
                  ${`${PAYOUT_PER_TOTAL_PERCENT_USD}`} per 1% of Beets vote
                </p>
              </td>
              <td>
                Basic Bribe is used in calculations only. To increase it you
                gotta get more FBEETS.
              </td>
              <td>
                {projectedPayout &&
                  `$${nFormatter(projectedPayout.debug[0].basicBribe, 1)}`}
              </td>
              <td> </td>
              <td></td>
              <td></td>
              <td>⌛</td>
            </tr>
            <tr className='basic_boosted'>
              <td>
                Basic Boosted
                <p className='smalldesc'>For New Voters</p>
              </td>
              <td>
                <p className='smalldesc'>
                  LP 3x Projected Basic Bribe - Get 1.1x
                </p>
                {projectedPayout &&
                  `LP at least $${nFormatter(
                    projectedPayout.debug[0].basicBribe * 3,
                    1
                  )}`}
              </td>

              <td>
                {projectedPayout &&
                  `$${nFormatter(
                    projectedPayout.debug[0].basicBribe * 1.1,
                    1
                  )}`}
              </td>
              <td>
                {!loaded ? (
                  "🔄"
                ) : projectedPayout && projectedPayout.debug[0].basicBoost ? (
                  <span style={{ color: "green" }}>✔</span>
                ) : (
                  <>❌</>
                )}
              </td>
              <td>
                <div>
                  {/* <div>10% - 210% 🚀</div>  */}
                  {projectedPayout &&
                    cre8rPrice &&
                    `Earn up to ${nFormatter(
                      (projectedPayout.debug[0].basicBribe * 1.1) /
                        AMP_PRICE_USD,
                      1
                    )} $AMP ($${nFormatter(
                      projectedPayout.debug[0].basicBribe * 1.1,
                      1
                    )})`}
                </div>
                <div>
                  <a href='https://beets.fi/#/pool/0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140'>
                    {projectedPayout &&
                      `LP at least $${nFormatter(
                        projectedPayout.debug[0].basicBribe * 6,
                        1
                      )}`}
                  </a>
                </div>
              </td>

              <td>
                {/* <p className="smalldesc">6x Current Holdings</p> */}
                {/* cre8r payout * 2000 = amp payout */}

                <div>
                  {projectedPayout &&
                    cre8rPrice &&
                    `${nFormatter(
                      projectedPayout.debug[0].basicBoost2AmpInUSD /
                        AMP_PRICE_USD,
                      1
                    )} $AMP ($${nFormatter(
                      projectedPayout.debug[0].basicBoost2AmpInUSD,
                      1
                    )})`}{" "}
                </div>
              </td>

              <td>
                {!loaded ? (
                  "🔄"
                ) : projectedPayout &&
                  projectedPayout.debug[0].basicBoost2AmpInUSD ? (
                  <span style={{ color: "green" }}>✔</span>
                ) : (
                  <>❌</>
                )}
              </td>
            </tr>
            <tr className='boosted_bribe'>
              <td>
                Boosted Bribe
                <p className='smalldesc'>For Compounders</p>
              </td>
              <td>
                <p className='smalldesc'>
                  Just compound last weeks bribe{" "}
                  {accountLastPayout &&
                    cre8rPrice &&
                    `($${nFormatter(
                      accountLastPayout.payoutCre8r * cre8rPrice,
                      1
                    )})`}
                </p>
                {projectedPayout &&
                  !projectedPayout.debug[0].boostedBribe &&
                  currentCS &&
                  pastCS &&
                  cre8rPrice &&
                  accountLastPayout &&
                  pastCS + accountLastPayout.lastWeekPayoutInCRE8R >
                    currentCS &&
                  `You were paid $${nFormatter(
                    accountLastPayout.lastWeekPayoutInCRE8R * cre8rPrice,
                    1
                  )} CRE8R last week but you forgot to compound to get this boost you gotta buy ${
                    currentCS -
                      pastCS -
                      accountLastPayout.lastWeekPayoutInCRE8R >
                    0
                      ? `and buy $${
                          currentCS -
                          pastCS -
                          accountLastPayout.lastWeekPayoutInCRE8R
                        } more CRE8R holdings`
                      : null
                  }`}
                {/* {nFormatter(amountUSDForBoostedBribe!, 1)} */}
              </td>
              <td>
                {projectedPayout &&
                  `$${nFormatter(
                    projectedPayout.debug[0].basicBribe * 1.25,
                    1
                  )}`}{" "}
                25% 🚀
              </td>
              <td>
                {!loaded ? (
                  "🔄"
                ) : projectedPayout && projectedPayout.debug[0].boostedBribe ? (
                  <span style={{ color: "green" }}>✔</span>
                ) : (
                  <>❌</>
                )}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr className='boosted_bonus'>
              <td>
                Boosted Bonus
                <p className='smalldesc'>For Increasoooors</p>
              </td>
              <td>
                <p className='smalldesc'>
                  LP 35% of current holdings and get 1.6x Basic Bribe
                </p>
                Increase CRE8R Holdings by $
                {pastCS && nFormatter(pastCS * 0.35, 1)}
              </td>
              <td>
                {projectedPayout &&
                  `$${nFormatter(
                    projectedPayout.debug[0].basicBribe * 1.6,
                    1
                  )}`}{" "}
                60% 🚀
              </td>
              <td>
                {!loaded ? (
                  "🔄"
                ) : projectedPayout && projectedPayout.debug[0].boostedBonus ? (
                  <span style={{ color: "green" }}>✔</span>
                ) : (
                  <>❌</>
                )}
              </td>

              <td>
                {/* 60% - 320% 🚀 */}
                <div>
                  Earn up to{" "}
                  {pastCS &&
                    cre8rPrice &&
                    `${nFormatter(
                      pastCS / AMP_PRICE_USD,
                      1
                    )} $AMP ($${nFormatter(pastCS, 1)})`}
                </div>
                <div>
                  <a href='https://beets.fi/#/pool/0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140'>
                    {" "}
                    Increase CRE8R Holdings by $
                    {pastCS && `${nFormatter(pastCS * 2, 1)}`}
                  </a>
                </div>
              </td>
              <td>
                {projectedPayout &&
                  cre8rPrice &&
                  `${nFormatter(
                    projectedPayout.debug[0].boostedBonus2AmpInUSD /
                      AMP_PRICE_USD,
                    1
                  )} $AMP ($${nFormatter(
                    projectedPayout.debug[0].boostedBonus2AmpInUSD,
                    1
                  )})`}
              </td>

              <td>
                {!loaded ? (
                  "🔄"
                ) : projectedPayout &&
                  projectedPayout.debug[0].boostedBonus2AmpInUSD ? (
                  <span style={{ color: "green" }}>✔</span>
                ) : (
                  <>❌</>
                )}
              </td>
            </tr>
            <tr className='payout-row'>
              <td>Totals</td>
              <td></td>
              <td>
                {(projectedPayout &&
                  `$${nFormatter(projectedPayout.debug[0].payoutUSD, 1)}`) ||
                  "🔄"}
              </td>
              <td></td>
              <td></td>
              <td>
                {projectedPayout &&
                  cre8rPrice &&
                  `${nFormatter(
                    Math.max(
                      projectedPayout.debug[0].basicBoost2AmpInUSD,
                      projectedPayout.debug[0].boostedBonus2AmpInUSD
                    ) / AMP_PRICE_USD,
                    1
                  )} $AMP ($${nFormatter(
                    Math.max(
                      projectedPayout.debug[0].basicBoost2AmpInUSD,
                      projectedPayout.debug[0].boostedBonus2AmpInUSD
                    ),
                    1
                  )})`}
              </td>
              <td></td>
            </tr>
          </Table>
          <div>Last Holdings Block Number: {PREV_BLOCKNUMBER}</div>
          <div>
            <div>
              <h1>Your Stats at Block Number: {PREV_BLOCKNUMBER}</h1>
            </div>
            <div>
              Your CRE8R Holdings across Fantom Pools and Vaults:{" "}
              {pastCS && (
                <span style={{ color: "" }}>${nFormatter(pastCS, 1)}</span>
              )}
            </div>
            <div>
              Your FBeets Dollar Value:{" "}
              {pastBS != undefined && (
                <span style={{ color: "" }}> ${nFormatter(pastBS, 1)}</span>
              )}
            </div>
          </div>
          <div>
            <div>
              <h1>Your Stats at the Latest Block</h1>
            </div>
            <div>
              Your CRE8R Holdings across Fantom Pools and Vaults:{" "}
              {(cre8rChange || cre8rChange == 0) && currentCS && (
                <span style={{ color: cre8rChange >= 0 ? "green" : "red" }}>
                  ${nFormatter(currentCS, 1)} {`(${formatChange(cre8rChange)})`}
                </span>
              )}
            </div>
            <div>
              Your Beets VP:{" "}
              {(beetsChange || beetsChange == 0) && currentBS && (
                <span style={{ color: beetsChange >= 0 ? "green" : "red" }}>
                  {" "}
                  ${nFormatter(currentBS, 1)} {`(${formatChange(beetsChange)})`}
                </span>
              )}
            </div>
            <div>
              <h2>CRE8R holdings breakdown</h2>
              {cre8rScoreBreakdown &&
                cre8rScoreBreakdown.map((i: any) => {
                  return (
                    <div key={i.symbol} style={{ marginBottom: 10 }}>
                      <div>symbol: {i.symbol}</div>
                      <div>number of tokens: {nFormatter(i.numTokens, 1)}</div>
                      <div>one token price: ${i.priceUSD.toFixed(4)}</div>
                      <div>total value: ${i.valueUSD.toFixed(2)}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default BoostCalculator;
