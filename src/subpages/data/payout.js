/**
 * 
 * @param {*} addresses 
 * @param {*} voters 
 * @param {*} total 
 * @param {*} percent 
 * @param {*} holdings11 
 * @param {*} holdings12 
 * @param {*} lastPayouts in cre8r
 * @param {*} cre8rPrice 
 * @param {*} cre8rBasicPayoutperPercent 
 * @param {*} limit 
 * @returns {{payout: any, debug: any}}
 */
function calcPayouts(addresses, voters, total, percent, lastHoldingsAddresses, currentHoldingsAddresses, lastPayouts, cre8rPrice, cre8rBasicPayoutperPercent, limit, hasBonanza) {
  const payouts = []
  const debug = []
  for (let i = 0; i < addresses.length && (limit == null ? true : i < limit) ; i += 1) {
    let a = addresses[i]
    let currentHoldings = currentHoldingsAddresses[a] || 0
    let lastHoldings = lastHoldingsAddresses[a] || 0
    let lastWeekPayoutInCRE8R = lastPayouts[a] || 0
    let dif = currentHoldings - (lastHoldings + lastWeekPayoutInCRE8R) // a negative holding means that a used
    let basicBribe = voters[a]/total * 100 * percent * cre8rBasicPayoutperPercent 
    // totalPayoutAtBasic = percent * 100 * cre8rBasicPayoutperPercent 
    // basicBribe = ratio / cre8rPrice * percent * cre8rBasicPayoutperPercent
    //payouts
    let bogusestBribe = 0
    let basicBoost = 0
    let boostedBribe = 0
    let boostedBonus = 0
    let boostedBonanza = 0
    let payoutUSD = 0
    if (dif <= -currentHoldings * .04) { //why do we need the &&? could we remove currentHoldings?
      bogusestBribe = basicBribe * 0.5
    }
  
    if (currentHoldings > (basicBribe*3) && lastWeekPayoutInCRE8R == 0) {
      basicBoost = basicBribe * 1.1
    }
  
    if (basicBoost && currentHoldings * 1.2 >= lastHoldings + lastWeekPayoutInCRE8R) {
      boostedBribe = basicBribe * 1.25
    }
    if (basicBoost && currentHoldings > lastWeekPayoutInCRE8R + lastHoldings*1.35) { // currentHoldings > lastHoldings*1.35 + lastWeekPayout
      boostedBonus = basicBribe * 1.35
      if (hasBonanza) {
        boostedBonanza = basicBribe * 1.6
      }
    }

    if (bogusestBribe) {
      payoutUSD = bogusestBribe
    } else {
      payoutUSD = Math.max(/*basicBribe,*/ basicBoost, boostedBribe, boostedBonus, boostedBonanza)
    } 
    let debugBribes = {
      address: a,
      in: {
        ratio: voters[a]/total,
        currentHoldings,
        lastHoldings,
        lastWeekPayoutInCRE8R,
        dif,
        cre8rPrice,
        basicBribe
      },
      out: {
        bogusestBribe,
        basicBoost,
        boostedBribe,
        boostedBonus,
        boostedBonanza,
        payoutUSD,
        payoutCre8r: payoutUSD/cre8rPrice
      }
    }

    // console.log(debugBribes)
    debug.push({address: debugBribes.address, in: '',...debugBribes.in,out: '', ...debugBribes.out})
    payouts.push({address: a, payout: payoutUSD})
  }
  return {payouts, debug}
}




export function calcProjectedPayouts(account, numOfFBeets, lastHoldingsUSD, currentHoldingsUSD, lastPayout, cre8rPrice, cre8rBasicPayoutperPercent) {
  const addresses = [account]
  const voters = {
    [account]: numOfFBeets
  }


  const total = numOfFBeets //84619703//387386679469087688
  const percent = numOfFBeets/84619703 // if I have 40000 fBeets and there are 84619703 fBeets in circulation so the assuming everyone votes, the lowest percent you can earn is 40000/84619703
  //fetch dynamically
  const lastHoldingsAddresses = {
    [account]: lastHoldingsUSD
  }
  const currentHoldingsAddresses = {
    [account]: currentHoldingsUSD
  }

  const lastPayouts = {
    [account]: lastPayout
  }
  return calcPayouts(addresses, voters, total, percent, lastHoldingsAddresses, currentHoldingsAddresses,lastPayouts, cre8rPrice, cre8rBasicPayoutperPercent)
}