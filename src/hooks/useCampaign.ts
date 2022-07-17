import { ApolloQueryResult } from "@apollo/client";
import { TabsData } from "components/Tabs";
import { useEffect, useMemo, useState } from "react";
import { useActiveCampaign, useCampaignUpdate } from "state/campaigns/hooks";
import { useActiveProtocol } from "state/governance/hooks";
import {
  getPostsFromNavItems,
  MenuTreeItem,
  PageData,
  useWPNav,
  useWPUri,
  useWPUriQuery,
  WPUriType,
} from "./useWP";

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
//@ts-ignore
const getDisplayData: (data: NodeByUriResponse) => AmplifiCampaignResponse = (
  data: NodeByUriResponse
) => {
  if (data.nodeByUri.amplifiCampaignFields) {
    return {
      data: {
        ...data.nodeByUri,
        isACFPage: true,
      },
      loading: false,
      error: "",
    };
  } else if (data && data.nodeByUri) {
    console.log(data);
    return {
      data: {
        content: data.nodeByUri.content || "No content",
        title: data.nodeByUri.title || "",
        isACFPage: false,
      },
      loading: false,
      error: "",
    };
  } else if (!data) {
    return {
      data: {
        content: "",
        title: "",
        isACFPage: false,
      },
      loading: true,
      error: "",
    };
  }
  return {
    data: {
      content: "",
      title: "",
      isACFPage: false,
    },
    loading: false,
    error: "Something is wrong",
  };
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

interface WPPage {
  isACFPage: false;
  title: string;
  content: string;
}

interface ACFPage {
  isACFPage: true;
  title: string;
  content: string;
  amplifiCampaignFields: {
    baseUrl: string;
    budget: string;
    description: string;
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
  };
}

interface AmplifiCampaignResponse {
  data: WPPage | ACFPage;
  loading: boolean;
  error: any;
}
/**
 * abstracting away the wp data
 * @param uri
 * @returns
 */
const useUri = (uri: string) => {
  const uriRes = useWPUri(uri);
  const amplifiCampaignsDisplayData = useMemo<
    AmplifiCampaignResponse | undefined
  >(() => {
    if (!uriRes) {
      return;
    }
    return getDisplayData(uriRes.data);
  }, [uriRes]);

  return {
    amplifiCampaignsDisplayData,
    useCampaignACFsInstead:
      isAmplifiCampaign(uri) || (uriRes && (!uriRes.data || uriRes.errors)),
    loading: !amplifiCampaignsDisplayData,
  };
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
  const {
    amplifiCampaignsDisplayData: data,
    useCampaignACFsInstead,
    loading: loadingPageData,
  } = useUri(tabUri);

  const [, setActiveCampaign] = useActiveCampaign();
  const [activeProtocol] = useActiveProtocol();
  useEffect(() => {
    if (!data || !data.data.isACFPage || !campaignID || !activeProtocol) {
      return;
    }
    const { amplifiCampaignFields } = data.data;
    setActiveCampaign({
      id: campaignID,
      protocolId: activeProtocol.id,
      baseUrl: amplifiCampaignFields.baseUrl,
      budget: [],
      budgetDescription: amplifiCampaignFields.budget,
      description: amplifiCampaignFields.description,
      goal: "",
      isDemo: false,
      kpi: "",
      overviewVideo: amplifiCampaignFields.overviewVideo,
      startDate: "today",
      whitelist: [],
      featuredImage: amplifiCampaignFields.featuredImage?.sourceUrl,
    });
  }, [protocolID, data, campaignID, activeProtocol]);

  return {
    amplifiCampaigns,
    amplifiCampaignsTabData,
    getCampaignRoute,
    uriToRouteMap,
    routeToUriMap,
    page: {
      tabUri,
      useCampaignACFsInstead, //for the overview tab
      data,
      loadingPageData,
    },
  };
};
