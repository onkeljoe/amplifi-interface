import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const payoutsClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.amplifi.gg/graphql",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});
