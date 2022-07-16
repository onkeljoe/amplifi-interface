import { createAction } from "@reduxjs/toolkit";
import { CampaignInfo, GlobalData } from "./reducer";

export const updateActiveCampaign = createAction<{
  activeProtocolID: string;
  campaignInfo: CampaignInfo | undefined;
}>("/campaigns/updateActiveCampaign");

export const updateMaxFetched = createAction<{
  protocolID: string;
  maxFetched: number | undefined;
}>("/campaigns/updateMaxFetched");

export const updateUtm = createAction<{
  protocolID: string;
  campaignID: string;
  utm: string;
  shortUtm: string | undefined;
}>("/campaigns/utm");