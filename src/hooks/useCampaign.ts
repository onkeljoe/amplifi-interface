import { ApolloQueryResult } from "@apollo/client";
import { TabsData } from "components/Tabs";
import { useEffect, useMemo, useState } from "react";
import { useActiveCampaign } from "state/campaigns/hooks";
import { useActiveProtocol } from "state/governance/hooks";
import {
  getPostsFromNavItems,
  MenuTreeItem,
  PageData,
  useWPNav,
  useWPUriQuery
} from "./useWP";
import Subpages from "subpages";
/* 

# The expected structure of the WP

Need to have a menu set up with the following structure

Protocol - with a uri of `/protocol/<protocol name here>`
    - routes to /campaigns/:protocolID
    - CampaignList.tsx
  Amplifi Campaign - with a uri of `/amplifi_campaigns/<campaign name here>` and __typename of AmpliFiCampaign
      - routes to /campaigns/:protocolID/:campaignID
      - an amplifi campaign will display nodes of typename Page that it is a parent to
      - by default it will show the first page
      - CampaignDetails.tsx
    Page - with a uri of `/<page name here>` and __typename of Page
        - routes to /campaigns/:protocolID/:campaignID/:tabID
        - This way, you can link directly to a tab
        - CampaignDetails.tsx

Design Pattern
  - useCampaign will output information based on the information that it has from the input, if an input is not defined, the output that uses those inputs will have a falsey value
  - Route refers to this apps routing while uri refers to the uri generated by WP

todo(jono) - where is the kpi link going?

*/

/**
 * converts an unfiltered nav by protocol and returns the children of the nav which should be amplifi campaigns
 * @param nav
 * @param protocolID
 * @returns
 */
const filterByProtocolID = (
  nav: MenuTreeItem[],
  protocolID: string
): MenuTreeItem[] | null => {
  const protocolArr = nav.filter((q) => q.uri == protocolIDToUri(protocolID));
  if (protocolArr.length == 0) return null;
  const protocol = protocolArr[0];

  return protocol.children.filter((n) => {
    return isAmplifiCampaign(n.uri);
  });
};

const filterByAmplifiCampaign = (
  filteredByProtocolNav: MenuTreeItem[],
  campaignUri: string
) => {
  const campaignMenuItems = filteredByProtocolNav.filter(
    (q) => q.uri == campaignUri
  );
  if (campaignMenuItems.length == 0) return null;
  const campaignItem = campaignMenuItems[0];

  return campaignItem.children;
};

/**
 * filters posts that level 1 children based on protocolID to get the amplifiCampaigns for that protocol
 * @param protocolID
 * @returns
 */
const getAmplifiCampaigns = async (
  protocolID: string,
  queryUriToContent: (path: any) => Promise<ApolloQueryResult<any>>,
  nav?: MenuTreeItem[]
): Promise<PageData[] | null> => {
  if (!nav || !protocolID || !queryUriToContent) {
    return null;
  }
  const navItemsToQuery = filterByProtocolID(nav, protocolID);
  if (!navItemsToQuery) return null;
  return await getPostsFromNavItems(navItemsToQuery, queryUriToContent);
};

/**
 * some wp uris have the uri as `/protocol/Cre8r`. This function is used to filter the nav from the wpgraphql Menu query
 * @param protocolID
 * @returns
 */
const protocolIDToUri = (protocolID: string) => {
  const uri = (
    "/protocol/" +
    protocolID.replaceAll("/", "") +
    "/"
  ).toLowerCase();
  return uri;
};

/**
 * filters by posts that have a parent of the campaign that matches the campaignUri and returns data that is intended to be used with the MuiTabs
 * @param protocolID
 * @param campaignUri
 * @param posts
 * @returns
 */
const getAmplifiCampaignTabsData = (
  protocolID: string,
  campaignUri: string,
  nav: MenuTreeItem[]
) => {
  const filteredProtocolNav = filterByProtocolID(nav, protocolID);
  if (!filteredProtocolNav || filteredProtocolNav.length == 0) {
    return [];
  }
  const filteredCampaignNav = filterByAmplifiCampaign(
    filteredProtocolNav,
    campaignUri
  );
  if (!filteredCampaignNav) {
    return [];
  }
  return [
    { tab: "overview", content: "", uri: campaignUri },
    ...filteredCampaignNav.map((n) => {
      return {
        tab: n.label || "no label",
        content: "",
        uri: n.uri,
      };
    }),
  ];
};

interface NodeByUriResponse {
  nodeByUri: {
    id: string;
    title: string;
    uri: string;
    // __typename: string,
    content: string;
    amplifiCampaignFields?: any;
  };
}
/**
 * Using the WP nodeByUri query, this gets the html to be displayed on the CampaignDetails.tsx page
 * @param data
 * @returns
 */

function getDisplayData (path: string, res: ApolloQueryResult<NodeByUriResponse>) : WPACFPage | WPContentPage | undefined {
  if (!res || !res.data || res.error) {
    return undefined
  } else if (isAmplifiCampaign(path)) {
    return {
      type: "WPACFPage",
      data: {
        amplifiCampaignFields: res.data.nodeByUri.amplifiCampaignFields,
        content: res.data.nodeByUri.content,
        title: res.data.nodeByUri.title
      },
      loading: false,
      error: res.error,
    };
  }
  return {
    type: 'WPContentPage',
    data: {
      content: res.data.nodeByUri.content,
      title: res.data.nodeByUri.title,
    },
    loading: false,
    error: res.error
  }
};
type Route = string;
export interface UriToRouteMap {
  [uri: string]: Route;
}

/**
 * uri to route converter
 * @param protocolID
 * @param nav
 * @returns
 */
const generateWpUriToRouteMap = (protocolID: string, nav?: MenuTreeItem[]) => {
  if (!nav || nav.length === 0) {
    return {};
  }
  const map: UriToRouteMap = {};
  const protocolNav = nav.filter(
    (n) => n.uri.toLowerCase() == protocolIDToUri(protocolID).toLowerCase()
  )[0];
  if (!protocolNav) {
    console.error(`Unable to find ${protocolID} in Nav data`);
    return {};
  }
  const subNav = nav.filter(
    (n) => n.uri.toLowerCase() == protocolIDToUri(protocolID).toLowerCase()
  )[0];
  subNav.children.forEach((n) => {
    if (isAmplifiCampaign(n.uri) && n.parentId == protocolNav.id) {
      const route = `/campaigns/${protocolID}/${n.uri
        .replace("/amplifi_campaigns/", "")
        .replaceAll("/", "")}`;
      map[n.uri] = route;
      n.children.forEach((t) => {
        map[t.uri] = `${route}/${t.uri
          .replace("/amplifi-pages/", "")
          .replaceAll("/", "")}`;
      });
    }
  });
  return map;
};

const isAmplifiCampaign = (uri: string) => {
  return uri.includes("/amplifi_campaigns/");
};

/**
 * route to uri converter
 * @param protocolID
 * @param nav
 * @returns
 */
const generateRouteToWpUriMap = (protocolID: string, nav?: MenuTreeItem[]) => {
  const map = generateWpUriToRouteMap(protocolID, nav);
  const keys = Object.keys(map);
  const values = Object.values(map);
  const invertedMap: any = {};
  for (let i = 0; i < Object.keys(map).length; i++) {
    invertedMap[values[i]] = keys[i];
  }
  return invertedMap;
};

type PageTypes = 'WPACFPage' | 'WPContentPage' | 'SubPage' | 'ErrorPage'
interface Page {
  type: PageTypes;
  data: any;
  loading: boolean;
  error: any;
}

interface WPContentPage extends Page {
  type: 'WPContentPage';
  data: {
    title: string;
    content: string;
  }
}

interface WPACFPage extends Page {
  type: 'WPACFPage';
  data: {
    title: string;
    content: string;
    amplifiCampaignFields: {
      baseUrl: string;
      budget: string;
      description: string;
      campaignBudget: string;
      featuredImage?: {
        uri: string;
        title: string;
        status: string;
        slug: string;
        sourceUrl: string;
      };
      goal: string;
      kpi: string;
      overviewVideo: string;
      selfHostedVideo: {
        description: string;
        uri: string;
        title: string;
        slug: string;
        sourceUrl: string;
      };
      startDate: string;
      fieldGroupName: string;
      isDemo: string;
      kpiMetric: string;
      secondaryBudgetAmount: string;
      secondarybudgetticket: string;
      snapshotId: string;
      snapshotProposal: string;
    }
  }
}

interface SubPage extends Page {
  type: 'SubPage';
  data: {
    component: () => JSX.Element
  }
}


function useSubPage (uri: string) : SubPage | undefined {
  const parts = uri.split('/')
  // not sure how to make this also undefined because if subpage key doesn't exist then Component will not
  const Component = Subpages[parts[parts.length - 1]]
  if (Component) {
    return {
      data: {
        component: Component
      },
      error: false,
      loading: false,
      type: 'SubPage'
    }
  }
  return undefined
}

function useWPPage (path: string | undefined) : WPACFPage | WPContentPage | undefined {
  const queryUriToContent = useWPUriQuery();
  const [res, setRes] = useState<ApolloQueryResult<any>>();
  useEffect(() => {
    if (!path) {
      return;
    }
    setRes(undefined);
    queryUriToContent(path).then((_res) => {
      setRes(_res);
    });
  }, [path, queryUriToContent]);
  if (!path || !res) {
    return undefined
  } 
  return getDisplayData(path, res);
};
/**
 * Aggregates data sources for content
 * abstracting away the wp data and subpages
 * @param uri
 * @returns
 */
function usePage (uri: string) : Page | undefined {
  const subpage = useSubPage(uri);
  //if subpage exists, skip WP query
  const wppage = useWPPage(subpage ? undefined : uri);
  return subpage || wppage;
};

const getCampaignRoute = (protocolID: string, campaignID: string) => {
  return "/campaigns/" + protocolID + "/" + campaignID;
};

export const useCampaignUri = (
  protocolID: string,
  campaignID: string,
  routeToUriMap: any
) => {
  const campaignUri = useMemo(
    () => routeToUriMap[getCampaignRoute(protocolID, campaignID)],
    [protocolID, campaignID, routeToUriMap]
  );
  return campaignUri;
};

export const isTabRoute = (routeForTab?: string) => {
  if (!routeForTab) return false;
  return routeForTab.split("/").length - 1 == 4;
};

export const getTabUri = (
  routeForTab?: string,
  routeToUriMap?: any,
  amplifiCampaignsTabData?: TabsData[]
) => {
  if (
    routeForTab &&
    routeToUriMap &&
    routeToUriMap[routeForTab] &&
    isTabRoute(routeForTab)
  ) {
    return routeToUriMap[routeForTab];
  }
  if (amplifiCampaignsTabData && amplifiCampaignsTabData[0]) {
    return amplifiCampaignsTabData[0].uri;
  }
  return "";
};

/**
 * This is the root of all of the ampliFi campaign processed data should be
 * @param protocolID
 * @param routeForTab
 * @param campaignID
 * @returns
 */
export const useCampaign = (
  protocolID: string,
  routeForTab?: string,
  campaignID?: string
) => {
  const { nav } = useWPNav();
  const queryUriToContent = useWPUriQuery();
  const [amplifiCampaigns, setAmplifiCampaigns] = useState<PageData[] | null>();
  useEffect(() => {
    setAmplifiCampaigns(undefined); // when you switch campaigns, we don't want to see the old campaigns
    getAmplifiCampaigns(protocolID, queryUriToContent, nav).then((res) => {
      setAmplifiCampaigns(res);
    });
  }, [protocolID, queryUriToContent, nav]);

  const uriToRouteMap = useMemo<UriToRouteMap>(
    () => generateWpUriToRouteMap(protocolID, nav),
    [protocolID, nav]
  );
  const routeToUriMap = useMemo(
    () => generateRouteToWpUriMap(protocolID, nav),
    [protocolID, nav]
  );

  const campaignUri = useCampaignUri(
    protocolID,
    campaignID || "",
    routeToUriMap
  );
  const amplifiCampaignsTabData = useMemo<TabsData[]>(() => {
    if (!nav) {
      return [];
    }
    return getAmplifiCampaignTabsData(protocolID, campaignUri, nav);
  }, [protocolID, campaignUri, nav]); //todo: Needs to get the tabs for a SPECIFIC CAMPAIGN
  const tabUri = useMemo(
    () => getTabUri(routeForTab, routeToUriMap, amplifiCampaignsTabData),
    [routeForTab, routeToUriMap, amplifiCampaignsTabData]
  );
  const page = usePage(tabUri);

  const [activeCampaign, setActiveCampaign] = useActiveCampaign();
  const [activeProtocol] = useActiveProtocol();
  useEffect(() => {
    if (!page || page.type !== 'WPACFPage' || !campaignID || !activeProtocol) {
      return;
    }
    //todo : figure out what is causing the render loops when removing this
    if (campaignID == activeCampaign?.id) {
      return;
    }
    const { amplifiCampaignFields } = page.data;
    setActiveCampaign({
      id: campaignID,
      title: data.data.title,
      protocolId: activeProtocol.id,
      content: page.data.content,
      baseUrl: amplifiCampaignFields.baseUrl,
      campaignBudget: amplifiCampaignFields.campaignBudget,
      budget: [],
      budgetDescription: amplifiCampaignFields.budget,
      description: amplifiCampaignFields.description,
      goal: amplifiCampaignFields.goal,
      isDemo: false,
      kpi: "",
      overviewVideo: amplifiCampaignFields.overviewVideo,
      startDate: amplifiCampaignFields.startDate,
      whitelist: [],
      featuredImage: amplifiCampaignFields.featuredImage?.sourceUrl,
    });
  }, [protocolID, page, campaignID, activeProtocol, setActiveCampaign]);

  return {
    amplifiCampaigns,
    amplifiCampaignsTabData,
    getCampaignRoute,
    uriToRouteMap,
    routeToUriMap,
    page,
    tabUri
  };
};
