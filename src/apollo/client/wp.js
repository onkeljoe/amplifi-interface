import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import possibleTypes from "../possibleTypes.json";

export const cre8rCmsClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://cre8r.vip/graphql",
  }),
  cache: new InMemoryCache({
    possibleTypes,
  }),
  shouldBatch: true,
});
