import { getUrl } from "data/url";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useActiveProtocol } from "state/governance/hooks";
import { GovernanceInfo, SUPPORTED_PROTOCOLS } from "state/governance/reducer";
import { useVerifiedHandle } from "state/social/hooks";
import { useActiveWeb3React } from "../../hooks";
import { AppDispatch, AppState } from "./../index";
import {
  updateActiveCampaign,
  updateMaxFetched,
  updateUtm
} from "./actions";
import { CampaignInfo } from "./reducer";

//todo - make this flexible based on the twitter
export function useUtm(): string | undefined {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const utmState = useSelector<AppState, AppState["campaigns"]["utm"]>(
    (state) => ({...state.campaigns.utm})
  );
  const [activeProtocol] = useActiveProtocol();
  const [activeCampaign] = useActiveCampaign();
  useEffect(() => {
    if (!verifiedHandleEntry || !verifiedHandleEntry.handle || !activeCampaign || !activeProtocol) return;
    getUrl(
      verifiedHandleEntry.handle,
      activeCampaign.baseUrl,
      activeCampaign.id,
    ).then((res) => {
      if (!res) {
        return;
      }
      const {utm, shortUtm} = res;
      dispatch(updateUtm({
        protocolID: activeProtocol.id, 
        campaignID: activeCampaign.id,
        utm,
        shortUtm
      }));
    });
  }, [verifiedHandleEntry, dispatch]);
  return activeProtocol && activeCampaign && (utmState[activeProtocol.id][activeCampaign.id].shortUtm || utmState[activeProtocol.id][activeCampaign.id].utm) //prefers the unshortened 
}


export function useCampaignUpdate(campaignInfo: CampaignInfo | false) {
  const dispatch = useDispatch<AppDispatch>();
  useMemo(() => {
    if (!campaignInfo) {
      return;
    } 
    dispatch(updateActiveCampaign({
      campaignInfo,
      activeProtocolID: '0', //this doesn't do anything atm
    }))
  }, [dispatch, campaignInfo])
}

export function useActiveCampaign(): [
  CampaignInfo | undefined,
  (activeCampaign: CampaignInfo) => void
] {
  const dispatch = useDispatch<AppDispatch>();
  const activeCampaign = useSelector<
    AppState,
    AppState["campaigns"]["activeCampaign"]
  >((state) => {
    return state.campaigns.activeCampaign;
  });
  const [activeProtocol] = useActiveProtocol();

  const setActiveCampaign = useCallback(
    (activeCampaign: CampaignInfo) => {
      if (!activeProtocol) {
        return;
      }
      dispatch(updateActiveCampaign({
        activeProtocolID: activeProtocol.id,
        campaignInfo: activeCampaign,
      }));
    },
    [dispatch, activeProtocol]
  );
  return [activeCampaign, setActiveCampaign];
}

export function useMaxFetched(): [
  number | undefined,
  (maxFetched: number | undefined) => void
] {
  const dispatch = useDispatch<AppDispatch>();
  const [activeProtocol] = useActiveProtocol();
  const maxFetched = useSelector<
    AppState,
    AppState["campaigns"]["maxFetched"]
  >((state) => state.campaigns.maxFetched);
  const setMaxFetched = useCallback(
    (maxFetched: number | undefined) => {
      activeProtocol &&
        dispatch(
          updateMaxFetched({ protocolID: activeProtocol.id, maxFetched })
        );
    },
    [activeProtocol, dispatch]
  );
  return [
    activeProtocol ? maxFetched[activeProtocol.id] : undefined,
    setMaxFetched,
  ];
}
