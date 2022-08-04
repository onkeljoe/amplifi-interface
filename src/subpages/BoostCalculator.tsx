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
import {
  calcLpToGetBasicBoosted,
  calcBasicBoostedToReceive,
  calcUSDBoostedBribeToRecieve,
  calcUSDBoostedBonusToRecieve,
} from "./utils";
import snapshot from "@snapshot-labs/snapshot.js";
import { toast } from "react-toastify";
import {calcProjectedPayouts} from './data/payout'

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const lastPayoutUri =
  "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-43050170.json";

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
  const { cre8rScore, beetsScore, beetsScoreBreakdown, cre8rPrice } = useBribe(library, account); //has a blocknumber default
  const {
    cre8rScore: latestCS,
    beetsScore: latestBS,
    cre8rScoreBreakdown,
  } = useBribe(library, account, 0, BLOCKNUMBER + 4000000000); // what year would this be?
  const cre8rChange =
    cre8rScore &&
    (latestCS || latestCS == 0) &&
    calcChange(cre8rScore, latestCS);
  const beetsChange =
    beetsScore &&
    (latestBS || latestBS == 0) &&
    calcChange(beetsScore, latestBS);
  const [lastPayout, setLastPayout] = useState([]);
  const amountUSDForBasicBoost =
    beetsScore && calcLpToGetBasicBoosted(beetsScore);
  const basicBoostToReceiveUSD =
    beetsScore && calcBasicBoostedToReceive(beetsScore);
  const amountUSDForBoostedBribe =
    cre8rScore && calcUSDBoostedBribeToRecieve(cre8rScore);
  const amountUSDForBoostedBonus =
    cre8rScore && calcUSDBoostedBonusToRecieve(cre8rScore);

  const hasBasicBoosted =
    beetsScore == 0 &&
    latestCS &&
    cre8rScore &&
    amountUSDForBasicBoost &&
    latestCS - cre8rScore > amountUSDForBasicBoost;
  const accountLastPayout =
    lastPayout && lastPayout.filter((i: any) => i.address == account)[0];
  const hasBoostedBribe =
    lastPayout &&
    latestCS &&
    amountUSDForBoostedBribe &&
    cre8rScore &&
    accountLastPayout + cre8rScore * 1.25 + amountUSDForBoostedBribe <=
      latestCS;
  const hasBoostedBonus =
    lastPayout &&
    latestCS &&
    amountUSDForBoostedBribe &&
    cre8rScore &&
    accountLastPayout + cre8rScore * 1.35 + amountUSDForBoostedBribe <=
      latestCS;

  let projectedPayout;
  if (account && beetsScoreBreakdown && cre8rScore && latestCS && cre8rPrice) {
    projectedPayout = calcProjectedPayouts(account, beetsScoreBreakdown?.beetsScore / beetsScoreBreakdown?.fBeetsPrice, cre8rScore / cre8rPrice, latestCS / cre8rPrice, accountLastPayout && (accountLastPayout as any).lastWeekPayoutInCRE8R || 0, cre8rPrice, 640)
    console.log(projectedPayout)
  }
  const loaded =
    amountUSDForBasicBoost &&
    basicBoostToReceiveUSD &&
    amountUSDForBoostedBribe &&
    amountUSDForBoostedBonus &&
    (cre8rScore || cre8rScore == 0) &&
    (beetsScore || beetsScore == 0) &&
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
  if (!loaded) {
    <>
      <LoadingRows>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LoadingRows>
    </>;
  }
  return (
    <>
      {/* TODO: Get snapshot query: https://docs.snapshot.org/snapshot.js */}
      <h1>
        {!loaded && 'This page may take a while to load. If you do not have any fBeets this may not work. Please connect a wallet with fBeets.'}
      </h1>
      <div>
        This button will unlock when the next beets snapshot is live. Text will
        dissapear when that happens cc @jono
      </div>
      <VoteButton
        onClick={() => {
          if (!account || !library) return;
          (client as any)
            .vote(library as any, account, {
              space: "beets.eth",
              proposal:
                "0xbc5785e1323c70986d77d33ab734c1c18f122c2a6082f84fbc437c549d8b84ad",
              type: "weighted",
              choice: { "45": 1 },
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
          <td>Basic Bribe
          <p className="smalldesc">$664.34 per 1% of Beets vote</p>
          </td>
          <td>Basic Bribe is used in calculations only. To increase it you gotta get more FBEETS.</td>
          <td>{projectedPayout && `$${nFormatter(projectedPayout.debug[0].basicBribe, 1)}`}</td>
          <td>   </td>
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
            {projectedPayout && `LP at least $${nFormatter(projectedPayout.debug[0].basicBribe * 3, 1)}`}
          </td>
          
          <td>
            {projectedPayout && `$${nFormatter(projectedPayout.debug[0].basicBribe * 1.1, 1)}`}
          </td>
          <td>
            {!loaded ? "🔄" : projectedPayout && projectedPayout.debug[0].basicBoost ? (
              <span style={{ color: "green" }}>✔</span>
            ) : (
              <>❌</>
            )}
          </td>
          <td><div> 
          <div>10% - 210% 🚀</div> 
            {projectedPayout && cre8rPrice && `Earn up to ${nFormatter(projectedPayout.debug[0].basicBoost / cre8rPrice * 60, 1)} $AMP ($${nFormatter(projectedPayout.debug[0].basicBribe * 1.1, 1)})`}</div></td>


            <div>{projectedPayout && `LP at least $${nFormatter(projectedPayout.debug[0].basicBribe * 6, 1)}`}</div>

          <td>
            {/* <p className="smalldesc">6x Current Holdings</p> */}
            {/* cre8r payout * 2000 = amp payout */}
          
           
           <div>
             {projectedPayout && cre8rPrice && `${nFormatter(projectedPayout.debug[0].basicBoost2AmpInUSD / cre8rPrice * 60, 1)} $AMP ($${nFormatter(projectedPayout.debug[0].basicBoost2AmpInUSD, 1)})`} </div>
          </td>

          <td>{!loaded ? "🔄" : projectedPayout && projectedPayout.debug[0].basicBoost2AmpInUSD ? (
              <span style={{ color: "green" }}>✔</span>
            ) : (
              <>❌</>
            )}</td>
        </tr>
        <tr className="boosted_bribe">
          <td>
            Boosted Bribe
            <p className="smalldesc">For Compounders</p>
          </td>
          <td>
            <p className="smalldesc">Just compound last weeks bribe {accountLastPayout && `($${nFormatter(accountLastPayout,1)})`}</p>
            {/* Increase CRE8R Holdings by CODE IF Last weeks holdings + last weeks Bribe payment is equal to current holdings then show tickbox in status else show amount {("you were paid x CRE8R last week but you forgot to compound to get this boost you gotta buy")} needed to increase holdings $ */}
            {latestCS && cre8rScore && accountLastPayout && cre8rScore + (accountLastPayout as any).lastWeekPayoutInCRE8R > latestCS && `You were paid $${nFormatter(accountLastPayout,1)} CRE8R last week but you forgot to compound to get this boost you gotta buy ${latestCS - cre8rScore - (accountLastPayout as any).lastWeekPayoutInCRE8R > 0 && `and buy $${latestCS - cre8rScore - (accountLastPayout as any).lastWeekPayoutInCRE8R} more CRE8R holdings`}`}
            {/* {nFormatter(amountUSDForBoostedBribe!, 1)} */}
          </td>
          <td>{projectedPayout && `$${nFormatter(projectedPayout.debug[0].basicBribe * 1.25, 1)}`} 25% 🚀</td>
          <td>
            {!loaded ? "🔄" : projectedPayout && projectedPayout.debug[0].boostedBribe ? (
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
            {nFormatter(amountUSDForBoostedBonus!, 1)}
          </td>
          <td>{projectedPayout && `$${nFormatter(projectedPayout.debug[0].basicBribe * 1.6, 1)}`} 60% 🚀</td>
          <td>
            {!loaded ? "🔄" : projectedPayout && projectedPayout.debug[0].boostedBonus ? (
              <span style={{ color: "green" }}>✔</span>
            ) : (
              <>❌</>
            )}
          </td>
          
            <td> 
              60% - 320% 🚀
              <div>
                {projectedPayout && cre8rPrice && `${nFormatter(projectedPayout.debug[0].basicBribe * 1.6 / cre8rPrice * 60, 1)} $AMP`}
              </div>
              <div>
              Increase CRE8R Holdings by $
              {nFormatter(amountUSDForBoostedBonus! * 5.714, 1)}
              </div>
          </td>
          <td>
          
            
             {projectedPayout && cre8rPrice && `${nFormatter(projectedPayout.debug[0].boostedBonus2AmpInUSD / cre8rPrice * 60, 1)} $AMP ($${nFormatter(projectedPayout.debug[0].boostedBonus2AmpInUSD, 1)})`}
          </td>

          <td>
            {!loaded ? "🔄" : projectedPayout && projectedPayout.debug[0].boostedBonus2AmpInUSD ? (
              <span style={{ color: "green" }}>✔</span>
            ) : (
              <>❌</>
            )}
          </td>
        </tr>
        <tr className="payout-row">
          <td>Totals</td>
          <td></td>
          <td>{projectedPayout && `$${nFormatter(projectedPayout.debug[0].payoutUSD, 1)}` || "🔄"}</td>
          <td></td>
          <td></td>
          <td>{projectedPayout && cre8rPrice && `${nFormatter(Math.max(projectedPayout.debug[0].basicBoost2AmpInUSD, projectedPayout.debug[0].boostedBonus2AmpInUSD) / cre8rPrice * 60, 1)} $AMP ($${nFormatter(Math.max(projectedPayout.debug[0].basicBoost2AmpInUSD, projectedPayout.debug[0].boostedBonus2AmpInUSD), 1)})`}
          </td>
          <td></td>
        </tr>
        {/* <tr className='amp_bonus'>
          <td>
            $AMP Bonus
          </td>
          <td>
            35% 🚀
          </td>
          <td>
            Increase CRE8R Holdings + last bribe by  ${nFormatter(amountUSDForBoostedBonus!,1)}
          </td>
          <td>
            amp payout
          </td>
          <td>{hasBoostedBonus ? <span style={{ color: 'green' }}>✔</span>: <>❌</>}</td>
        </tr> */}
      </Table>
      <div>Last Holdings Block Number: {BLOCKNUMBER}</div>
      <div>
        <div>
          <h1>Your Stats at Block Number: {BLOCKNUMBER}</h1>
        </div>
        <div>
          Your CRE8R Holdings across Fantom Pools and Vaults:{" "}
          {cre8rScore && (
            <span style={{ color: "" }}>${nFormatter(cre8rScore, 1)}</span>
          )}
        </div>
        <div>
          Your FBeets Dollar Value:{" "}
          {beetsScore != undefined && (
            <span style={{ color: "" }}> ${nFormatter(beetsScore, 1)}</span>
          )}
        </div>
      </div>
      <div>
        <div>
          <h1>Your Stats at the Latest Block</h1>
        </div>
        <div>
          Your CRE8R Holdings across Fantom Pools and Vaults:{" "}
          {(cre8rChange || cre8rChange == 0) && (
            <span style={{ color: cre8rChange > 0 ? "green" : "red" }}>
              ${nFormatter(latestCS!, 1)} {`(${formatChange(cre8rChange)})`}
            </span>
          )}
        </div>
        <div>
          Your Beets VP:{" "}
          {(beetsChange || beetsChange == 0) && (
            <span style={{ color: beetsChange > 0 ? "green" : "red" }}>
              {" "}
              ${nFormatter(latestBS!, 1)} {`(${formatChange(beetsChange)})`}
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
    </>
  );
}

export default BoostCalculator;

