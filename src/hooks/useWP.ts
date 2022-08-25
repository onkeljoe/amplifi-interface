import { ApolloQueryResult } from "@apollo/client";
import { fetchWPNav, fetchWPUri, processWPNav } from "data/campaigns";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import { useCre8rCmsClient } from "state/application/hooks";

export interface MenuTreeItem {
  id: string;
  parentId: string | null;
  label: string;
  children: MenuTreeItem[];
  uri: string;
}

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
    fetchWPNav(cmsClient, 'amplifi')
      .then((res : any) => {
        const navigationData = processWPNav(res)
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
    (uri: string) => {
      return fetchWPUri(cmsClient, uri)
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
    nav.map((res: any) => {
      return queryUriToContent(res.uri);
    })
  );
  const _posts = res_1.map((f_1: any) => {
    if (f_1.status == "fulfilled") {
      const post = nav.find((v: any) => f_1.value.data.nodeByUri.uri == v.uri)
      return {
        ...post,
        ...f_1.value.data.nodeByUri,
        id: post!.id,
      }; //need id of menu for hierachy
    }
    throw "something is wrong status is " + f_1.status;
  });
  return await _posts;
};
