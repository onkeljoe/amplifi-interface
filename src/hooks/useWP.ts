import { ApolloQueryResult } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import { useCre8rCmsClient } from "state/application/hooks";

const NAVIGATION_QUERY = gql`
  query Menus($slug: String!) {
    menus(where: { slug: $slug }, first: 5) {
      __typename
      nodes {
        slug
        id
        databaseId
        name
        menuItems(first: 100000) {
          __typename
          nodes {
            title
            label
            id
            parentId
            uri
          }
        }
      }
    }
  }
`;

const URI_QUERY = gql`
  query getNodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        title
        content
        id
        uri
      }
      ... on Protocol {
        title
        content
        id
        uri
      }
      ... on AmpliFiCampaign {
        id
        uri
        title
        content
        date
        amplifiCampaignFields {
          baseUrl
          campaignBudget
          description
          featuredImage {
            uri
            title
            status
            slug
            sourceUrl
          }
          goal
          kpi
          overviewVideo
          selfHostedVideo {
            description
            uri
            title
            slug
            sourceUrl
          }
          startDate
          fieldGroupName
          isDemo
          kpiMetric
          secondaryBudgetAmount
          secondarybudgetticker
          snapshotId
          snapshotProposal
        }
      }
    }
  }
`;

export interface MenuTreeItem {
  id: string;
  parentId: string | null;
  label: string;
  children: MenuTreeItem[];
  uri: string;
}

const flatListToHierarchical = (
  data = [],
  { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}
) => {
  const tree: Array<MenuTreeItem> = [];
  const childrenOf: any = {};
  data.forEach((item: MenuTreeItem) => {
    const newItem = { ...item };
    // @ts-ignore
    const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
    childrenOf[id] = childrenOf[id] || [];
    // @ts-ignore
    newItem[childrenKey] = childrenOf[id];
    parentId
      ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
      : tree.push(newItem);
  });
  return tree;
};

export interface PageData {
  __typename: string;
  title: string;
  content: string;
  id: string;
  uri: string;
  label: string;
  parentId: string | null;
}
export const useWPNav = () => {
  const cmsClient = useCre8rCmsClient();
  const [nav, setNav] = useState<Array<MenuTreeItem>>();
  useEffect(() => {
    cmsClient
      ?.query({
        query: NAVIGATION_QUERY,
        variables: {
          slug: "amplifi",
        },
        fetchPolicy: "cache-first",
      })
      .then(({ data }) => {
        if (data.menus.nodes.length == 0) {
          console.error(
            "missing amplifi menu, make sure that it is set to a location in wordpress"
          );
          return;
        }
        const navigationData = flatListToHierarchical(
          data.menus.nodes[0].menuItems.nodes
        );
        setNav(navigationData);
      });
  }, [cmsClient]);

  return { nav };
};

export type WPUriType =
  | { data?: any; errors?: any; loading: boolean }
  | undefined;

export const useWPUriQuery = () => {
  const cmsClient = useCre8rCmsClient();
  const queryUriToContent = useCallback(
    (path: string) => {
      return cmsClient?.query({
        query: URI_QUERY,
        variables: {
          uri: path,
        },
        fetchPolicy: "cache-first",
      });
    },
    [cmsClient]
  );
  return queryUriToContent;
};

export const getPostsFromNavItems = async (
  nav: MenuTreeItem[],
  queryUriToContent: (path: any) => Promise<ApolloQueryResult<any>>
) => {
  const res_1 = await Promise.allSettled(
    nav.map(async (res: any) => {
      const f = await queryUriToContent(res.uri);
      return f;
    })
  );
  const _posts = res_1.map((f_1: any) => {
    if (f_1.status == "fulfilled") {
      return {
        ...nav.filter((v: any) => f_1.value.data.nodeByUri.uri == v.uri)[0],
        ...f_1.value.data.nodeByUri,
        id: nav.filter((v_1: any) => f_1.value.data.nodeByUri.uri == v_1.uri)[0]
          .id,
      }; //need id of menu for hierachy
    }
    throw "something is wrong status is " + f_1.status;
  });
  return await _posts;
};
