import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import { useCre8rCmsClient } from "state/application/hooks";

const NAVIGATION_QUERY = gql`
query Menus($slug: String!) {
  menus(where: {slug: $slug}) {
    __typename
    nodes {
      slug
      id
      databaseId
      name
      menuItems {
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

`

///about-2/
const URI_QUERY = gql`
query getNodeByUri ($uri: String!) {
  nodeByUri(uri: $uri) {
    __typename
    ... on Page {
      ...PageFields
    }
    ... on AmpliFiCampaign {
      ...AmpliFiCampaignFields
    }
    ... on Protocol {
      ...ProtocolFields
    }
  }
}
fragment ProtocolFields on Protocol {
  title
  content
  id
  uri
}

fragment PageFields on Page {
  title
  content
  id
  uri
}

fragment AmpliFiCampaignFields on AmpliFiCampaign {
  title
  content
  id
  uri
}
`

export interface MenuTreeItem {
  id: string;
  parentId: string | null;
  label: string;
  children: MenuTreeItem[];
  uri: string;
}

const flatListToHierarchical = (
  data = [],
  {idKey='id',parentKey='parentId',childrenKey='children'} = {}
) => {
  console.log('ff')
  const tree : Array<MenuTreeItem> = [];
  const childrenOf : any = {};
  data.forEach((item : MenuTreeItem) => {
      const newItem = {...item};
      // @ts-ignore
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
      childrenOf[id] = childrenOf[id] || [];
      // @ts-ignore
      newItem[childrenKey] = childrenOf[id];
      parentId
          ? (
              childrenOf[parentId] = childrenOf[parentId] || []
          ).push(newItem)
          : tree.push(newItem);
  });
  return tree;
};

interface PageData {
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
  const [posts, setPosts] = useState<Array<PageData>>();
  const {queryUriToContent} = useWPUri('/');
  useEffect(() => {
    cmsClient?.query({
      query: NAVIGATION_QUERY,
      variables: {
        slug: "amplifi"
      },
      fetchPolicy: 'cache-first',
    }).then(({data}) => {
      const navigationData = flatListToHierarchical(data.menus.nodes[0].menuItems.nodes);
      Promise.allSettled(data.menus.nodes[0].menuItems.nodes.map(async (res : any) => {
        return await queryUriToContent(res.uri)
      })).then(async (res : any) => {
        const _posts = res.map((f:any) => {
          if (f.status == 'fulfilled') {
            return {...data.menus.nodes[0].menuItems.nodes.filter((v:any) => f.value.data.nodeByUri.uri == v.uri)[0], ...f.value.data.nodeByUri, id: data.menus.nodes[0].menuItems.nodes.filter((v:any) => f.value.data.nodeByUri.uri == v.uri)[0].id}; //need id of menu for hierachy 
          }
          throw 'something is wrong status is ' + f.status
        })
        console.log(_posts)
        setPosts(_posts)
      })
      setNav(navigationData)
    })
  },[cmsClient])
  
  return {nav, posts}
}

type WPUriType = {data?: any, errors?: any, loading: boolean} | undefined
export const useWPUri : (path: any) => {data: WPUriType, queryUriToContent: any } = (path :any) => {
  const cmsClient = useCre8rCmsClient();
  const [data, setData] = useState<WPUriType>();
  const queryUriToContent = useCallback((path) => {
    return cmsClient?.query({
      query: URI_QUERY,
      variables: {
       uri: path
      },
      fetchPolicy: 'cache-first',
    })
  }, [cmsClient])
  useEffect(() => {
    setData({loading: true})
    queryUriToContent(path).then((res) => {
      setData({
        data: res.data,
        errors: res?.data && res?.data.nodeByUri == null && `path of ${path} was not found.`,
        loading: false
      })
    });
  }, [cmsClient, path])
  return {data, queryUriToContent}
}