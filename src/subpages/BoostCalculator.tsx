import axios from "axios";
import CRE8RPriceCard from "components/CRE8RPriceCard";
import { LoadingRows } from "components/Loader";
import { useActiveWeb3React } from "hooks";
import useCountdown from "hooks/useCountdown";
import React, { useEffect, useState } from "react";
import { useBlockNumber } from "state/application/hooks";
import styled from "styled-components";
import { nFormatter } from "utils/format";
import { nameOrAddress } from "utils/getName";
import useBribe, {
  BLOCKNUMBER,
  strategiesToUSDConverter,
} from "./hooks/useBribe";
import { calcChange, formatChange } from "./math";
import snapshot from "@snapshot-labs/snapshot.js";
import toast from "components/Toast";
import { calcProjectedPayouts } from "./data/projectedPayouts";
import useCRE8RPrice from "hooks/useCRE8RPrice";

const AMP_PRICE_USD = 0.001666666667;
const PAYOUT_PER_TOTAL_PERCENT_USD = 664.34;

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const lastPayoutUri =
  "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-43050170.json";
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
  const {cre8rPrice} = useCRE8RPrice();
  const { 
    cre8rScore: pastCS, 
    beetsScore: pastBS, 
    beetsScoreBreakdown, 
  } = useBribe(
    library,
    account
  ); //has a blocknumber default
  const {
    cre8rScore: currentCS,
    beetsScore: currentBS,
    cre8rScoreBreakdown,
  } = useBribe(library, account, 0, BLOCKNUMBER + 4000000000); // what year would this be?
  const cre8rChange =
    pastCS &&
    (currentCS || currentCS == 0) &&
    calcChange(pastCS, currentCS);
  const beetsChange =
    pastBS &&
    (currentBS || currentBS == 0) &&
    calcChange(pastBS, currentBS);
  const [lastPayout, setLastPayout] = useState([]);

  const accountLastPayout: any =
    lastPayout && lastPayout.filter((i: any) => i.address == account)[0];

  let projectedPayout;
  if (account && beetsScoreBreakdown && pastCS && currentCS && cre8rPrice) {
    projectedPayout = calcProjectedPayouts(
      account,
      {
        numOfFBeetsOfAccount: beetsScoreBreakdown?.beetsScore / beetsScoreBreakdown?.fBeetsPrice, 
        lastHoldingsUSD: pastCS / cre8rPrice, 
        currentHoldingsUSD: currentCS / cre8rPrice, 
        lastPayoutUSD: (accountLastPayout && accountLastPayout.lastWeekPayoutInCRE8R) || 0
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

  const countdownText = useCountdown(
    "Aug 4, 2022 3:00:00 GMT-07:00",
    "Vote 100% For CRE8R In F-Major"
  );

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
      {!loaded ? <>
        <LoadingRows>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LoadingRows>
      </> : <>
      <VoteButton
        onClick={() => {
          if (!account || !library) return;
          (client as any)
            .vote(library as any, account, {
              space: "beets.eth",
              proposal:
                "0xf161196029cb7848d69154c87884de87c5c7a6d41686c9e7346bdc39d3620325",
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
        <tr className="basic_bribe">
          <td>
            Basic Bribe
            <p className="smalldesc">${`${PAYOUT_PER_TOTAL_PERCENT_USD}`} per 1% of Beets vote</p>
          </td>
          <td>
            Basic Bribe is used in calculations only. To increase it you gotta
            get more FBEETS.
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
        <tr className="basic_boosted">
          <td>
            Basic Boosted
            <p className="smalldesc">For New Voters</p>
          </td>
          <td>
            <p className="smalldesc">LP 3x Projected Basic Bribe - Get 1.1x</p>
            {projectedPayout &&
              `LP at least $${nFormatter(
                projectedPayout.debug[0].basicBribe * 3,
                1
              )}`}
          </td>

          <td>
            {projectedPayout &&
              `$${nFormatter(projectedPayout.debug[0].basicBribe * 1.1, 1)}`}
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
                  (projectedPayout.debug[0].basicBribe * 1.1) / AMP_PRICE_USD,
                  1
                )} $AMP ($${nFormatter(
                  projectedPayout.debug[0].basicBribe * 1.1,
                  1
                )})`}
            </div>
            <div>
              <a href="https://beets.fi/#/pool/0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140">
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
                  projectedPayout.debug[0].basicBoost2AmpInUSD / AMP_PRICE_USD,
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
        <tr className="boosted_bribe">
          <td>
            Boosted Bribe
            <p className="smalldesc">For Compounders</p>
          </td>
          <td>
            <p className="smalldesc">
              Just compound last weeks bribe{" "}
              {accountLastPayout &&
                cre8rPrice &&
                `($${nFormatter(
                  accountLastPayout.lastWeekPayoutInCRE8R * cre8rPrice,
                  1
                )})`}
            </p>
            {currentCS &&
              pastCS &&
              cre8rPrice &&
              accountLastPayout &&
              pastCS + accountLastPayout.lastWeekPayoutInCRE8R > currentCS &&
              `You were paid $${nFormatter(
                accountLastPayout.lastWeekPayoutInCRE8R * cre8rPrice,
                1
              )} CRE8R last week but you forgot to compound to get this boost you gotta buy ${
                currentCS -
                  pastCS -
                  accountLastPayout.lastWeekPayoutInCRE8R >
                  0 ?
                `and buy $${
                  currentCS -
                  pastCS -
                  accountLastPayout.lastWeekPayoutInCRE8R
                } more CRE8R holdings` : null
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
        <tr className="boosted_bonus">
          <td>
            Boosted Bonus
            <p className="smalldesc">For Increasoooors</p>
          </td>
          <td>
            <p className="smalldesc">
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
                )} $AMP ($${nFormatter(
                  pastCS,
                  1
                )})`}
            </div>
            <div>
              <a href="https://beets.fi/#/pool/0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140">
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
                projectedPayout.debug[0].boostedBonus2AmpInUSD / AMP_PRICE_USD,
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
        <tr className="payout-row">
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
      <div>Last Holdings Block Number: {BLOCKNUMBER}</div>
      <div>
        <div>
          <h1>Your Stats at Block Number: {BLOCKNUMBER}</h1>
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
            <span style={{ color: cre8rChange > 0 ? "green" : "red" }}>
              ${nFormatter(currentCS, 1)} {`(${formatChange(cre8rChange)})`}
            </span>
          )}
        </div>
        <div>
          Your Beets VP:{" "}
          {(beetsChange || beetsChange == 0) && currentBS && (
            <span style={{ color: beetsChange > 0 ? "green" : "red" }}>
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

      <div>
        <h1>
          Payouts for{" "}
          <a href="https://snapshot.org/#/beets.eth/proposal/0x9b3b328e77e2d5b99a26ede7b4f6c36ee0bf6b4c06241e84f50f01735270d6e9">
            Beets Round 15
          </a>
        </h1>
      </div>
      <div>
        {lastPayout
          .sort((a: any, b: any) => b.payoutUSD - a.payoutUSD)
          .map(({ address, payoutUSD }: any) => {
            return (
              <div key={address}>
                {nameOrAddress(address, undefined, true)}:{" "}
                {nFormatter(payoutUSD, 2)} USD
              </div>
            );
          })}
      </div>
      </>}
      
    </>
  );
}

export default BoostCalculator;