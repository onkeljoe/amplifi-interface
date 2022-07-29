import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import possibleTypes from "./possibleTypes.json";

export const uniswapClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/uniswap-governance-v2",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const devoClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/uniswap-governance-v2",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const billiClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/uniswap-governance-v2",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const compoundClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/compound-governance-2",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const aaveClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/aave/governance-sybil",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const poolClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-governance",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const radicleClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/radicle-dev/radicle-governance-homestead",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const nounsClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const ensClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/ens-governance",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const snapshotClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://hub.snapshot.org/graphql", //note: testnet - https://testnet.snapshot.org
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const cre8rCmsClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://cre8r.vip/graphql",
  }),
  cache: new InMemoryCache({
    possibleTypes,
  }),
  shouldBatch: true,
});
