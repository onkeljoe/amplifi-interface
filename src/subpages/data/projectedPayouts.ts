import { calcPayouts } from "./payout";

const TOTAL_FBEETS_CIRCULATION = 84619703;

export function calcProjectedPayouts(
  account: string,
  accountDetails: {
    numOfFBeetsOfAccount: number;
    lastHoldingsUSD: number;
    currentHoldingsUSD: number;
    lastPayoutUSD: number;
  },
  cre8rPrice: number,
  cre8rBasicPayoutperPercent: number
) {
  const {
    numOfFBeetsOfAccount,
    lastHoldingsUSD,
    currentHoldingsUSD,
    lastPayoutUSD,
  } = accountDetails;
  const lastPayoutCRE8R = lastPayoutUSD * cre8rPrice;
  const addresses = [account];
  const voters = {
    [account]: numOfFBeetsOfAccount,
  };

  const total = numOfFBeetsOfAccount;
  const percent = numOfFBeetsOfAccount / TOTAL_FBEETS_CIRCULATION; // if I have 40000 fBeets and there are 84619703 fBeets in circulation so the assuming everyone votes, the lowest percent you can earn is 40000/84619703
  //fetch dynamically
  const lastHoldingsAddresses = {
    [account]: lastHoldingsUSD,
  };
  const currentHoldingsAddresses = {
    [account]: currentHoldingsUSD,
  };

  const lastPayouts = {
    [account]: lastPayoutCRE8R,
  };
  return calcPayouts(
    addresses,
    voters,
    total,
    percent,
    lastHoldingsAddresses,
    currentHoldingsAddresses,
    lastPayouts,
    cre8rPrice,
    cre8rBasicPayoutperPercent
  );
}
