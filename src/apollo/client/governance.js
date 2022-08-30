import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const snapshotClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://hub.snapshot.org/graphql", //note: testnet - https://testnet.snapshot.org
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const uniswapClient = new ApolloClient({
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

export const ACWIClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/uniswap-governance-v2", // what should i put in here?
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const GMXClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/arr00/uniswap-governance-v2", // what should i put in here?
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const ChainBetClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://cre8r.vip/graphql", // what should i put in here?
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const PaladinClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://hub.snapshot.org/graphql", // their snapshot id: "palvote.eth"
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});
