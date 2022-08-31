import { Payout, PayoutToken, UserPayoutData } from "data/payouts";
import { BigNumber } from "ethers";

const DEFAULT_DECIMALS = 18;
export interface NormalizedPayoutToken {
  symbol: string;
  amountUSD: number;
  amountNum: string;
  address?: string;
  chainId?: number;
  decimals?: number;
}

type NormalizedPayoutTotals = NormalizedPayoutToken;

export function getPayoutsFromUser(
  userPayouts: UserPayoutData,
  tokenPrices: { [tokenSymbol: string]: number }
): Map<string, NormalizedPayoutTotals> {
  const payoutTokens: Array<PayoutToken> = [];
  for (const payout of userPayouts.user.payouts) {
    for (const payoutToken of payout.tokens) {
      payoutTokens.push(payoutToken);
    }
  }
  return normalizePayouts(payoutTokens, tokenPrices);
}

export function normalizePayouts(
  payoutTokens: Array<PayoutToken>,
  tokenPrices: { [tokenSymbol: string]: number }
): Map<string, NormalizedPayoutTotals> {
  const normalizedPayoutTokens: Array<NormalizedPayoutToken> = [];
  for (const payoutToken of payoutTokens) {
    normalizedPayoutTokens.push(normalizePayout(payoutToken, tokenPrices));
  }
  const normalizedPayoutTokensMap = new Map<string, NormalizedPayoutTotals>();
  for (const npt of normalizedPayoutTokens) {
    const oldValue = {
      ...npt,
      amountUSD: 0,
      amountNum: "0",
    };
    if (normalizedPayoutTokensMap.has(npt.symbol)) {
      oldValue.amountNum = normalizedPayoutTokensMap.get(npt.symbol)!.amountNum;
      oldValue.amountUSD = normalizedPayoutTokensMap.get(npt.symbol)!.amountUSD;
    }

    normalizedPayoutTokensMap.set(npt.symbol, {
      ...npt,
      amountUSD: oldValue.amountUSD + npt.amountUSD,
      amountNum: BigNumber.from(oldValue.amountNum)
        .add(BigNumber.from(npt.amountNum))
        .toString(),
    });
  }
  return normalizedPayoutTokensMap;
}

export function normalizePayout(
  payoutToken: PayoutToken,
  tokenPrices: { [tokenSymbol: string]: number }
): NormalizedPayoutToken {
  const {
    amountNum,
    amountUSD,
    token: { address, decimals, name, symbol, chainId },
  } = payoutToken;
  const decimalsUsed = decimals || DEFAULT_DECIMALS;

  let normalizedAmountNum: string;
  let normalizedAmountUSD: number;
  if (!tokenPrices[symbol]) {
    throw `Missing ${symbol} in tokenPrices`;
  }
  if (amountNum && amountUSD === null) {
    normalizedAmountNum = amountNum;
    normalizedAmountUSD =
      BigNumber.from(amountNum)
        .div(BigNumber.from(Math.pow(10, decimalsUsed)))
        .toNumber() * tokenPrices[symbol];
  } else if (amountNum === null && amountUSD !== 0 && amountUSD !== null) {
    normalizedAmountNum = BigNumber.from(
      ((amountUSD / tokenPrices[symbol]) * 10 ** 2).toFixed(0) // inflating number of tokens by 100
    )
      .mul(BigNumber.from((10 ** decimalsUsed - 2).toString()))
      .toString();
    normalizedAmountUSD = amountUSD;
  } else {
    throw "Error in schema, please contact the database administrator";
  }

  return {
    symbol: symbol,
    amountNum: normalizedAmountNum,
    amountUSD: normalizedAmountUSD,
    address: address || undefined,
    chainId: chainId || undefined,
    decimals: decimalsUsed,
  };
}
