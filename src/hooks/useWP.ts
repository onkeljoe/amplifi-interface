import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { useCre8rCmsClient } from "state/application/hooks";

const NAVIGATION_QUERY = gql`
query Menus ($slug: String!) {
  menus(where: {slug: $slug})  {
    __typename
    nodes {
      slug
      id
      databaseId
      name
      menuItems {
        ...MenuField1
      }
    }
  }
}

fragment MenuField1 on MenuToMenuItemConnection {
  edges {
                node {
                  id
                  label
                  parentId
                  path
                  childItems {
                    ...MenuField2
                  }
                }
              }
}

fragment MenuField2 on MenuItemToMenuItemConnection {
  edges {
    node {
      id
      label
      parentId
      path
      childItems {
        ...MenuFields3
      }
    }
  }
}

fragment MenuFields3 on MenuItemToMenuItemConnection {
  edges {
    node {
      id
      label
      parentId
      path
      childItems {
        ...MenuFields4
      }
    }
  }
}

fragment MenuFields4 on MenuItemToMenuItemConnection {
  edges {
    node {
      id
      label
      parentId
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
  }
}

fragment PageFields on Page {
  content
}
`



export const useWPNav = () => {
  const cmsClient = useCre8rCmsClient();
  const [nav, setNav] = useState<any>();
  useEffect(() => {
    cmsClient?.query({
      query: NAVIGATION_QUERY,
      variables: {
        slug: "menu"
      },
      fetchPolicy: 'cache-first',
    }).then(({data}) => {
      const navigationData = data?.menus.nodes[0];
      console.log(navigationData)
      setNav(navigationData)
    })
  },[cmsClient])

  
  return nav
}

type WPUriType = {data: any, errors?: any} | undefined
export const useWPUri : (path: any) => WPUriType = (path :any) => {
  const cmsClient = useCre8rCmsClient();
  const [data, setData] = useState<WPUriType>();
  useEffect(() => {
    cmsClient?.query({
      query: URI_QUERY,
      variables: {
       uri: path
      },
      fetchPolicy: 'cache-first',
    }).then((res) => {
      setData({
        data: res.data,
        errors: res?.data.nodeByUri == null && `path of ${path} was not found.`
      })
    });
  }, [cmsClient, path])
  return data
}