import {calcPayouts } from './payout'

export function calcProjectedPayouts(
    account : string,
    numOfFBeets: number,
    lastHoldingsUSD: number,
    currentHoldingsUSD: number,
    lastPayout: number,
    cre8rPrice: number, 
    cre8rBasicPayoutUSDperPercent: number,
    totalFBeetsInCirculation?: number
) {
    if (totalFBeetsInCirculation === undefined) {
        // at the very most, there will be FBeets in circulation (assuming, every votes and there are no new fbeets in circulation)
        totalFBeetsInCirculation = 84619703
    } 
    const addresses = [account]
    const voters = {
      [account]: numOfFBeets
    }
  
  
    const total = numOfFBeets //voted for cre8r
    const percent = numOfFBeets/totalFBeetsInCirculation // if I have 40000 fBeets and there are 84619703 fBeets in circulation so the assuming everyone votes, the lowest percent you can earn is 40000/84619703
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
    return calcPayouts(addresses, voters, total, percent, lastHoldingsAddresses, currentHoldingsAddresses, lastPayouts, cre8rPrice, cre8rBasicPayoutUSDperPercent, undefined, undefined)
  }