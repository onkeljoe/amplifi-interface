import { gql } from "@apollo/client";
export const USER_PAYOUT_QUERY = gql`
  query getUserPayout($address: String!) {
    user(address: $address) {
      address
      payouts {
        id
        status

        campaign {
          protocolName
          slug
        }
        tokens {
          amountUSD
          amountNum
          token {
            symbol
            name
            decimals
            address
            chainId
          }
        }
      }
    }
  }
`;
