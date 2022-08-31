import { ApolloClient, ApolloQueryResult } from "@apollo/client";
import { USER_PAYOUT_QUERY } from "apollo/queries";

export interface UserPayoutData {
  user: {
    address: string;
    payouts: Array<Payout>;
  };
}

export interface Payout {
  id: string;
  status: "unclaimed";
  campaign: {
    protocolName: string;
    slug: string;
  };
  tokens: Array<PayoutToken>;
}

export interface PayoutToken {
  amountUSD: number | null;
  amountNum: string | null;
  token: {
    symbol: string;
    name: string;
    decimals: number | null;
    address: string | null;
    chainId: number | null;
  };
}

export async function fetchUserPayout(
  payoutClient: ApolloClient<any>,
  address: string
): Promise<ApolloQueryResult<UserPayoutData>> {
  try {
    return payoutClient.query({
      query: USER_PAYOUT_QUERY,
      variables: {
        address: address,
      },
      fetchPolicy: "cache-first",
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
