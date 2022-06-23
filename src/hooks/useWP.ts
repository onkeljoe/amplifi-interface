import gql from "graphql-tag";
import { useEffect, useState } from "react";
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
  }
}

fragment PageFields on Page {
  content
}

fragment AmpliFiCampaignFields on AmpliFiCampaign {
  content
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
  const tree : Array<MenuTreeItem> = [];
  const childrenOf : any = {};
  data.forEach((item : MenuTreeItem) => {
    console.log(childrenKey)
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

export const useWPNav = () => {
  const cmsClient = useCre8rCmsClient();
  const [nav, setNav] = useState<Array<MenuTreeItem>>();
  useEffect(() => {
    cmsClient?.query({
      query: NAVIGATION_QUERY,
      variables: {
        slug: "amplifi"
      },
      fetchPolicy: 'cache-first',
    }).then(({data}) => {
      const navigationData = flatListToHierarchical(data.menus.nodes[0].menuItems.nodes);
      
      console.log(navigationData)
      setNav(navigationData)
    })
  },[cmsClient])

  
  return nav
}

type WPUriType = {data?: any, errors?: any, loading: boolean} | undefined
export const useWPUri : (path: any) => WPUriType = (path :any) => {
  const cmsClient = useCre8rCmsClient();
  const [data, setData] = useState<WPUriType>();
  useEffect(() => {
    setData({loading: true})
    cmsClient?.query({
      query: URI_QUERY,
      variables: {
       uri: path
      },
      fetchPolicy: 'cache-first',
    }).then((res) => {
      setData({
        data: res.data,
        errors: res?.data && res?.data.nodeByUri == null && `path of ${path} was not found.`,
        loading: false
      })
    });
  }, [cmsClient, path])
  return data
}