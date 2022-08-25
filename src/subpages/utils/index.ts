const BASICBRIBEFOR100 = 64773.488; //this is in $ // https://docs.google.com/spreadsheets/d/1ex4qMXnqAmjMrbYxLbVLqvQgg0REQ0_r3RIcHMIMfKA/edit#gid=0
const TOTALVOTINGPOWER = 83957874; // https://ftmscan.com/token/0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1?a=0xc6fe438c3d3e9b9e18e6fa47921b04eca19dcc57
const CRE8R_FTM_LP_PRICE = 0.14; // https://app.spiritswap.finance/#/farms/allfarms -> search for cre8r (cre8r-ftm lp)

/*
Tiers
Bogusest bribe
Basic boosted (for new voter)
boosted Bribe
Boosted bonus
boosted bonanza
*/

/**
 * This is 1:1 basic_bribe * 1.1 For new voters: LP at least 3 x your projected basic_boosted bribe before bribes are paid (~48 hours after gauge emissions go live).
 * @param {*} beetsScore
 * @param {*} totalVotingPower
 * @param {*} thisWeeksBasicBribeAmount Total Bribe payout at basic for 100%
 * @returns basic boosted reward in USD
 */
export function calcBasicBoostedRewUSD(
  beetsScore: number,
  totalVotingPower = TOTALVOTINGPOWER,
  thisWeeksBasicBribeAmount = BASICBRIBEFOR100
) {
  const basicBoostedForAddress =
    (beetsScore / totalVotingPower) * thisWeeksBasicBribeAmount;

  return basicBoostedForAddress;
}

/**
 * This is the amount needed to LP (or buy cre8r) to get basic boosted
 * @param beetsScore
 * @param totalVotingPower
 * @param thisWeeksBasicBribeAmount
 * @returns amount to LP in USD to get basic boosted
 */
export function calcBasicBoostedReqUSD(
  beetsScore: number,
  totalVotingPower = TOTALVOTINGPOWER,
  thisWeeksBasicBribeAmount = BASICBRIBEFOR100
) {
  return (
    calcBasicBoostedRewUSD(
      beetsScore,
      totalVotingPower,
      thisWeeksBasicBribeAmount
    ) * 3
  );
}

export function calcBoostedBribeRewUSD(cre8rScore: number) {
  return cre8rScore * 0.25;
}

export function calcBoostedBonusReqUSD(cre8rScore: number) {
  return cre8rScore * 0.35;
}

export function calcBoostedBonusRewUSD(cre8rScore: number) {
  return cre8rScore * 1.6;
}
