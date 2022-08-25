import { ApolloClient, ApolloQueryResult } from "@apollo/client";
import { NAVIGATION_QUERY, URI_QUERY } from "apollo/queries/wp";
import { flatListToHierarchical } from "utils/wp";
import wp from 'wp-data.json';

export async function fetchWPNav(client: ApolloClient<any>, slug: string) {
  if (wp.nav) {
    return wp.nav
  }
  const res = await client.query({
    query: NAVIGATION_QUERY,
    variables: {
      slug: slug,
    },
    fetchPolicy: "cache-first",
  });
  return res
}

export function processWPNav(res: {data: any}) {
  if (!res.data) {
    console.error('wp nav not found')
  }
  console.log(res)
  if (res.data.menus.nodes.length == 0) {
    console.error(
      "missing amplifi menu, make sure that it is set to a location in wordpress"
    );
    return;
  }
  const navigationData = flatListToHierarchical(
    res.data.menus.nodes[0].menuItems.nodes
  );
  return navigationData
} 




export async function fetchWPUri (client: ApolloClient<any>, uri: string) {
  // @ts-ignore
  if (wp.uris[uri]) {
    // @ts-ignore
    return wp.uris[uri]
  }
  const res = client.query({
    query: URI_QUERY,
    variables: {
      uri: uri,
    },
    fetchPolicy: "cache-first",
  });
  return res
}