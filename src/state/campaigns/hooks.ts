import { getUrl } from "data/url";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useActiveProtocol } from "state/governance/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import { useActiveWeb3React } from "../../hooks";
import { AppDispatch, AppState } from "./../index";
import { updateActiveCampaign, updateMaxFetched, updateUtm } from "./actions";
import { CampaignInfo } from "./reducer";

function useUtm() {
  const utmState = useSelector<AppState, AppState["campaigns"]["utm"]>(
    (state) => {
      return state.campaigns.utm;
    }
  );
  const [activeProtocol] = useActiveProtocol();
  const [activeCampaign] = useActiveCampaign();
  return (
    activeProtocol &&
    activeCampaign &&
    utmState[activeProtocol.id] &&
    utmState[activeProtocol.id][activeCampaign.id]
  ); //prefers the shortened link
}

//todo - make this flexible based on the twitter
export function useReferralLink(): string | undefined {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const [activeProtocol] = useActiveProtocol();
  const [activeCampaign] = useActiveCampaign();
  const links = useUtm();

  useEffect(() => {
    if (
      !verifiedHandleEntry ||
      !verifiedHandleEntry.handle ||
      !activeCampaign ||
      !activeProtocol
    )
      return;
    getUrl(
      verifiedHandleEntry.handle,
      activeCampaign.baseUrl,
      activeCampaign.id,
      activeProtocol.id,
      links?.utm, //only pass in the long utm if the short utm exists, shortUtm and utm are coupled
      links?.shortUtm
    ).then((res) => {
      if (!res) {
        return;
      }
      const { utm, shortUtm } = res;
      if (activeCampaign.protocolId != activeProtocol.id) {
        return;
      }
      dispatch(
        updateUtm({
          protocolID: activeProtocol.id,
          campaignID: activeCampaign.id,
          utm,
          shortUtm,
        })
      );
    });
  }, [verifiedHandleEntry, dispatch, activeCampaign, activeProtocol, links?.shortUtm, links?.utm]);
  if (
    activeProtocol &&
    activeCampaign &&
    activeCampaign.protocolId != activeProtocol.id
  ) {
    return undefined;
  }
  return links && (links.shortUtm || links.utm);
}

export function useCampaignUpdate(campaignInfo: CampaignInfo | false) {
  const dispatch = useDispatch<AppDispatch>();
  useMemo(() => {
    if (!campaignInfo) {
      return;
    }
    dispatch(
      updateActiveCampaign({
        campaignInfo,
        activeProtocolID: "0", //this doesn't do anything atm
      })
    );
  }, [dispatch, campaignInfo]);
}

export function useActiveCampaign(): [
  CampaignInfo | undefined,
  (activeCampaign: CampaignInfo) => void
] {
  const dispatch = useDispatch<AppDispatch>();
  const activeCampaign : CampaignInfo | undefined = useSelector<
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

      //This occurs when you have an active campaign and then switch to a new protocol, this will reset the activeCampaign, so that for example, useUtm does not get reset
      if (activeProtocol.id != activeCampaign.protocolId) {
        dispatch(
          updateActiveCampaign({
            activeProtocolID: activeProtocol.id,
            campaignInfo: undefined,
          })
        );
        return;
      }
      dispatch(
        updateActiveCampaign({
          activeProtocolID: activeProtocol.id,
          campaignInfo: activeCampaign,
        })
      );
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
  const maxFetched = useSelector<AppState, AppState["campaigns"]["maxFetched"]>(
    (state) => state.campaigns.maxFetched
  );
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
