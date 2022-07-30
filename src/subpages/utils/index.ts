const BASICBRIBEFOR100 = 64773.488; // https://docs.google.com/spreadsheets/d/1ex4qMXnqAmjMrbYxLbVLqvQgg0REQ0_r3RIcHMIMfKA/edit#gid=0
const TOTALVOTINGPOWER = 83957874; // https://ftmscan.com/token/0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1?a=0xc6fe438c3d3e9b9e18e6fa47921b04eca19dcc57
const CRE8R_FTM_LP_PRICE = 0.15;  // https://app.spiritswap.finance/#/farms/allfarms -> search for cre8r (cre8r-ftm lp)
/**
 * 
 * @param {*} beetsScore 
 * @param {*} totalVotingPower 
 * @param {*} thisWeeksBasicBribeAmount Total Bribe payout at basic for 100%
 * @returns 
 */
export function calcBasicBoostedToReceive (beetsScore : number, totalVotingPower = TOTALVOTINGPOWER,thisWeeksBasicBribeAmount = BASICBRIBEFOR100) {
  const basicBoostedForAddress = (beetsScore / totalVotingPower) * thisWeeksBasicBribeAmount

  return basicBoostedForAddress
}

export function calcLpToGetBasicBoosted (beetsScore : number, totalVotingPower = TOTALVOTINGPOWER,thisWeeksBasicBribeAmount = BASICBRIBEFOR100) {
  return calcBasicBoostedToReceive(beetsScore,totalVotingPower,thisWeeksBasicBribeAmount)*3
}

export function calcUSDBoostedBribeToRecieve (cre8rScore: number) {
  return cre8rScore * CRE8R_FTM_LP_PRICE * 0.25
}

export function calcUSDBoostedBonusToRecieve (cre8rScore : number, ) {
  return cre8rScore*CRE8R_FTM_LP_PRICE*.35
}