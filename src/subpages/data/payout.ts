const MARGIN_OF_ERROR = 0.005 // 0.5% percent

export function calcPayouts(
  addresses : string[], 
  voterToFBEETS: {[address: string]: number}, 
  totalFBeetsVotedForCRE8R : number, 
  percentVoteForCre8r: number, 
  lastHoldingsAddressesInCRE8R: {[address: string]: number}, 
  currentHoldingsAddressesInCRE8R: {[address: string]: number}, 
  lastPayoutsInCRE8R: {[address: string]: number}, 
  cre8rPrice: number, 
  cre8rBasicPayoutperPercent: number, 
  limit?: number, 
  hasBonanza? : number
) {
  const payouts = []
  const debug = []
  for (let i = 0; i < addresses.length && (limit == null ? true : i < limit) ; i += 1) {
    const a = addresses[i]
    const currentHoldings = currentHoldingsAddressesInCRE8R[a] || 0
    const lastHoldings = lastHoldingsAddressesInCRE8R[a] || 0
    const lastWeekPayoutInCRE8R = lastPayoutsInCRE8R[a] || 0
    const dif = currentHoldings - (lastHoldings + lastWeekPayoutInCRE8R) // a negative holding means that a used
    const basicBribeUSD = voterToFBEETS[a]/totalFBeetsVotedForCRE8R * 100 * percentVoteForCre8r * cre8rBasicPayoutperPercent 
    // totalPayoutAtBasic = percent * 100 * cre8rBasicPayoutperPercent 
    // basicBribe = ratio / cre8rPrice * percent * cre8rBasicPayoutperPercent
    //payouts $CRE8R
    let bogusestBribe = 0
    let basicBoost = 0
    let boostedBribe = 0
    let boostedBonus = 0
    let boostedBonanza = 0

    if (dif <= -currentHoldings * .04) { //why do we need the &&? could we remove currentHoldings?
      bogusestBribe = basicBribeUSD * 0.5
    }
    const hasLp3x = currentHoldings * (1 - MARGIN_OF_ERROR) > (basicBribeUSD*3)
    if (hasLp3x && lastWeekPayoutInCRE8R == 0) {
      basicBoost = basicBribeUSD * 1.1
    }
  
    if (hasLp3x && basicBoost && currentHoldings * 1.2  * (1 - MARGIN_OF_ERROR) >= lastHoldings + lastWeekPayoutInCRE8R) {
      boostedBribe = basicBribeUSD * 1.25
    }
    if (hasLp3x && basicBoost && currentHoldings * (1 - MARGIN_OF_ERROR) > (lastWeekPayoutInCRE8R + lastHoldings) * 1.35) { // currentHoldings > lastHoldings*1.35 + lastWeekPayout
      boostedBonus = basicBribeUSD * 1.35
      if (hasBonanza) {
        boostedBonanza = basicBribeUSD * 1.6
      }
    }
    //payouts $AMP
    let basicBoost2 = 0;
    let boostedBonus2 = 0;

    if (hasLp3x) {
      const ratioLP = currentHoldings / basicBribeUSD
      const multiplierLP = (Math.min(6, (ratioLP)) - 3) * 1/3
      basicBoost2 = multiplierLP * basicBoost

      const ratioHoldings = currentHoldings / lastHoldings
      const multiplierHoldings = (Math.min(0.35, ratioHoldings) - 0.35) * 1 / 1.65
      boostedBonus2 += multiplierHoldings * boostedBonus //extra bonus
      
      const excessCre8r = currentHoldings - (lastHoldings + lastWeekPayoutInCRE8R)*1.35
      
      boostedBonus2 += multiplierHoldings / 2 * excessCre8r

    }


    let payoutUSD = 0
    if (bogusestBribe) {
      payoutUSD = bogusestBribe
    } else {
      payoutUSD = Math.max(basicBribeUSD, basicBoost, boostedBribe, boostedBonus, boostedBonanza)
    } 
    const debugBribes = {
      address: a,
      in: {
        ratio: voterToFBEETS[a]/totalFBeetsVotedForCRE8R,
        currentHoldings,
        lastHoldings,
        lastWeekPayoutInCRE8R,
        dif,
        cre8rPrice,
        basicBribe: basicBribeUSD
      },
      out: {
        bogusestBribe,
        basicBoost,
        boostedBribe,
        boostedBonus,
        boostedBonanza,
        payoutUSD,
        payoutCre8r: payoutUSD/cre8rPrice,
        payoutCre8rInUSD: payoutUSD,
        basicBoost2AmpInUSD: basicBoost2,
        boostedBonus2AmpInUSD: boostedBonus2,
      }
    }

    // console.log(debugBribes)
    debug.push({address: debugBribes.address, in: '',...debugBribes.in,out: '', ...debugBribes.out})
    payouts.push({address: a, payout: payoutUSD})
  }
  return {payouts, debug}
}




