import { TabsData } from "components/Tabs";
import { useCallback, useMemo } from "react";
import { MenuTreeItem, PageData, useWPNav, useWPUri, WPUriType } from "./useWP";

const getAmplifiCampaigns = (protocolID : string, posts?: PageData[]) => {
  if (!posts || !protocolID) {
    return null
  }
  return posts.filter((p : any) => {
    const protocol = posts.filter(
      (q : any) => q.label.toLowerCase() == protocolID.toLowerCase()
    )[0];
    if (!protocol) return;
    return (
      p.__typename == "AmpliFiCampaign" && p.parentId == protocol.id
    );
  })
}

const protocolIDToUri = (protocolID : string) => {
  return "/protocol/" + protocolID.replaceAll("/", "") + "/"
} 

const getAmplifiCampaignTabsData = (protocolID : string, campaignUri: string, posts? : PageData[]) => {
  const protocolUri = protocolIDToUri(protocolID)
  if (!posts) {
    return []
  }
  return [
    // { tab: "overview", content: "", uri: campaignUri },
    ...posts
      .filter((p : any) => {
        const selectedCampaign = posts.filter(
          (q : any) => q.uri == campaignUri
        )[0];
        if (!selectedCampaign) return false;
        return (
          p.__typename == "Page" && p.parentId == selectedCampaign.id
        );
      })
      .map((p) => {
        return {
          tab: p.label || "no label",
          content: "",
          uri: p.uri,
        };
      }),
  ]
}

const getDisplayData = (uriRes : WPUriType) => {
  if (uriRes &&
    !uriRes.loading &&
    uriRes.data &&
    uriRes.data.nodeByUri) {
    return {
      content: uriRes.data.nodeByUri.content || "No content",
      title: uriRes.data.nodeByUri.title || "",
      loading: false,
      error: ""
    }
  } else if (!uriRes) {
    return {
      content: "",
      title: "",
      loading: true,
      error: ""
    }
  }
  return {
    content: "",
    title: "",
    loading: false,
    error: uriRes.errors
  }
}
type Route = string
export interface UriToRouteMap {
  [uri: string]: Route
}



const generateWpUriToRouteMap = (protocolID : string, nav? : MenuTreeItem[]) => {
  if (!nav || nav.length === 0) {
    return {}
  }
  console.log(nav)
  const map : UriToRouteMap = {}
  const protocolNav = nav.filter(n => n.uri.toLowerCase() == protocolIDToUri(protocolID).toLowerCase())[0]
  if (!protocolNav) {
    console.error(`Unable to find ${protocolID} in Nav data`)
    return {}
  }
  const subNav = nav.filter(n => n.uri.toLowerCase() == protocolIDToUri(protocolID).toLowerCase())[0]
  subNav.children.forEach(n => {
    //uri.includes('/amplifi_campaigns/')
    n.uri.includes(protocolIDToUri(protocolID))
    n.uri.includes('/amplifi_campaigns/')
    n.parentId == protocolNav.id
    if (n.uri.includes('/amplifi_campaigns/') && n.parentId == protocolNav.id) {
      const route = `/campaigns/${protocolID}/${n.uri.replace('/amplifi_campaigns/', '').replaceAll('/', '')}`
      map[n.uri] = route;
      n.children.forEach(t => { //tabs in col3
        map[t.uri] = `${route}/${t.uri.replaceAll('/','')}`
      })
    }
  });
  return map
}

const generateRouteToWpUriMap = (protocolID: string, nav? : MenuTreeItem[]) => {
  const map = generateWpUriToRouteMap(protocolID, nav)
  const keys = Object.keys(map)
  const values = Object.values(map)
  const invertedMap : any = {}
  for (let i = 0; i < Object.keys(map).length; i++) {
    invertedMap[values[i]] = keys[i]
  }
  return invertedMap
}

const useUri = (path : string) => {
  const {data} = useWPUri(path || "");
  console.log(data)
  const amplifiCampaignsDisplayData = useMemo<{title: string, content: string, loading: boolean, error: any}>(() => getDisplayData(data), [data])
  return {
    amplifiCampaignsDisplayData,
    useCampaignACFsInstead: !data || data.errors,
    loading: amplifiCampaignsDisplayData.loading
  }
}

const getCampaignRoute = (protocolID: string, campaignID: string) => {
  return '/campaigns/' + protocolID + '/' + campaignID
}

export const useCampaignUri = (protocolID: string, campaignID: string, routeToUriMap: any) => {
  const campaignUri = useMemo(() => routeToUriMap[getCampaignRoute(protocolID, campaignID)], [protocolID, campaignID, routeToUriMap])
  return campaignUri
}

export const useCampaign = (protocolID : string, routeForTab? : string, campaignID? : string) => {
  const { posts, nav } = useWPNav();
  const amplifiCampaigns = useMemo<PageData[] | null>(() => getAmplifiCampaigns(protocolID, posts), [posts, protocolID])
  const uriToRouteMap = useMemo<UriToRouteMap>(() => generateWpUriToRouteMap(protocolID, nav), [protocolID, nav])
  const routeToUriMap = useMemo(() => generateRouteToWpUriMap(protocolID, nav), [protocolID, nav])

  const campaignUri = useCampaignUri(protocolID, campaignID || "", routeToUriMap)
  const amplifiCampaignsTabData = useMemo<TabsData[]>(() => getAmplifiCampaignTabsData(protocolID, campaignUri, posts), [protocolID, campaignUri, posts]) //todo: Needs to get the tabs for a SPECIFIC CAMPAIGN
  const { amplifiCampaignsDisplayData : data, useCampaignACFsInstead, loading: loadingPageData } = useUri(routeForTab ? routeToUriMap[routeForTab] : "");

  return {
    amplifiCampaigns,
    amplifiCampaignsTabData,
    getCampaignRoute,
    uriToRouteMap,
    routeToUriMap,
    page: {
      useCampaignACFsInstead, //for the overview tab
      data,
      loadingPageData
    }
  }
}

export const useCampaignMaps = (protocolID: string, nav?: MenuTreeItem[]) => {

  return {
    
  }
}