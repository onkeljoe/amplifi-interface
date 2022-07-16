import {
  updateUtm,
  updateMaxFetched,
  updateActiveCampaign,
} from "./actions";
import { createReducer } from "@reduxjs/toolkit";
import HundredFeatured from "../../assets/images/hundred-featured.png";
import FujiFeatured from "../../assets/images/fuji-short.png";

//This is the one used by WP
type HTML = string;
type Whitelist = {
  dataSource?: string;
  id?: string;
}
type Budget = {
  tokenTicker: string;
  amount: number;
  paidIn: string;
}

export interface CampaignInfo {
  id: string;
  protocolId: string;
  baseUrl: string; // TODO - this should be required
  budget: Budget[]
  budgetDescription: string;
  featuredImage?: string;
  description: HTML;
  goal: string;
  kpi: string;
  overviewVideo: string;
  startDate: string;
  isDemo: boolean;
  whitelist: Whitelist[]
}

export const AMPLIFI_CAMPAIGN: CampaignInfo = {
  id: '0',
  protocolId: 'AMPLIFI',
  baseUrl: "https://amplifi.cre8r.vip?",
  budget: [{
    tokenTicker: "USD",
    amount: 20000,
    paidIn: "USD"
  }],
  budgetDescription: '',
  description: `<p>AmpliFi Verified Ampbasadors you can now earn a share of Fuji DAO governance through sharing The <strong>Fuji Expedition</strong> with your audience. </p>
  <p>
 Learn more about Fuji Pre-Token bonds here: <a href="https://cre8r.vip/wp-content/uploads/2022/06/Pre-Token_bonds-2.pdf">Fuji Pre token bonds PDF Download</a>
  </p>`,
  goal: '',
  kpi: '',
  overviewVideo: "https://www.youtube.com/embed/0aKvJdCbuno", // ['https://www.youtube.com/embed/ccPUXuS4_Is','https://www.youtube.com/embed/BDQlJNiDav8'],
  startDate: '',
  isDemo: true,
  whitelist: [

  ]
};

export const HND_CAMPAIGN: CampaignInfo = {
  id: '0', // Protocol URI should be set to this
  protocolId: 'HND',
  baseUrl: "https://amplifi.cre8r.vip/#/amplifi/HND?",
  featuredImage: HundredFeatured,
  budget: [
    {
      tokenTicker: '$CRE8R',
      amount: 10000,
      paidIn: "USDC"
    },
    {
      tokenTicker: 'HND',
      amount: 30000,
      paidIn: "HND"
    }
  ],
  overviewVideo: "https://www.youtube.com/embed/0aKvJdCbuno", // ['https://www.youtube.com/embed/ccPUXuS4_Is','https://www.youtube.com/embed/BDQlJNiDav8'],
  description: `<b>In phase one of the campaign only wallets that have used Hundred Finance will be eligible for AmpliFi payouts.</b> Share Hundred Finance with your friends using your unique tracking link below and earn HND + CRE8R 
  You will be rewarded based on onchain data that can be tracked back to your unique link using AmpliFi`,
  budgetDescription: '',
  goal: '',
  isDemo: true,
  kpi: '',
  startDate: '',
  whitelist: []
};

export const FUJI_CAMPAIGN: CampaignInfo = {
  id: '0',
  protocolId: 'FUJI',
  baseUrl: "https://www.fujidao.org/#/dashboard/init-borrow?",
  featuredImage: FujiFeatured,
  budget: [
    {
      amount: 20000,
      paidIn: 'FUJI',
      tokenTicker: 'FUJI'
    }
  ],
  overviewVideo: "https://youtube.com/embed/SmUNtbz35kY", // ['https://www.youtube.com/embed/ccPUXuS4_Is','https://www.youtube.com/embed/BDQlJNiDav8'],
  description: `<p>AmpliFi Verified Ampbasadors you can now earn a share of Fuji DAO governance through sharing The <strong>Fuji Expedition</strong> with your audience. </p>
  <p>
 Learn more about Fuji Pre-Token bonds here: <a href="https://cre8r.vip/wp-content/uploads/2022/06/Pre-Token_bonds-2.pdf">Fuji Pre token bonds PDF Download</a>
  </p>`,
  budgetDescription: '',
  goal: '',
  isDemo: false,
  kpi: '',
  startDate: '',
  whitelist: []
};

export const CRE8R_CAMPAIGN: CampaignInfo = {
  id: '0',
  protocolId: 'CRE8R',
  baseUrl: "https://cre8r.vip/client-discover-call-booking-form/?",
  budget: [],
  budgetDescription: "Unlimited: $500 USDC + $500 USD value Paid in AmpliFi Governance Token Per Successful Referral ",
  overviewVideo: "https://www.youtube.com/embed/0aKvJdCbuno",
  description: `Share CRE8R AmpliFi with your friends and earn $CRE8R tokens. Just copy your unique link below and share anywhere (responsibly). You will be rewarded with CRE8R tokens in several different ways over time.

  Based on:
  The number of people you refer, and the KPI goals that are hit on other campaigns in AmpliFi that can be attributed to your unique link. More info will be released on this as the system develops.`,
  goal: '',
  isDemo: false,
  kpi: '',
  startDate: '',
  whitelist: []
};

export interface GlobalData {
  [protocolID: string]: {
    [id: string] : CampaignInfo
  }
}

// mapping for routing
export const DUMMY_CAMPAIGNS: GlobalData = {
  FUJI: {'0': FUJI_CAMPAIGN},
  CRE8R: {'0':CRE8R_CAMPAIGN},
  HND: {'0':HND_CAMPAIGN},
  AMPLIFI: {'0':AMPLIFI_CAMPAIGN},
  // uniswap: UNISWAP_CAMPAIGN,
  // connect: CONNECT_CONFIG,
};

export const FETCHING_INTERVAL = 10;

export interface CampaignState {
  // the selected option from supported campaign list
  activeCampaign: CampaignInfo | undefined;

  // used for paginated campaign lookup
  maxFetched: {
    [protocolID: string]: number | undefined;
  };

  utm: {
    [protocolID: string]: {
      [campaignId: string]: {
        utm: string;
        shortUtm: string | undefined  ;
      }
    };
  };
}

export const initialState: CampaignState = {
  activeCampaign: undefined,
  maxFetched: {},
  utm: {},
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateActiveCampaign, (state, action) => {
      state.activeCampaign = action.payload.campaignInfo;
    })
    .addCase(updateMaxFetched, (state, action) => {
      state.maxFetched[action.payload.protocolID] = action.payload.maxFetched;
    })
    .addCase(updateUtm, (state, action) => {
      // prevents state updates if the objects have the same value
      if (state.utm[action.payload.protocolID] && state.utm[action.payload.protocolID][action.payload.campaignID] &&
        state.utm[action.payload.protocolID][action.payload.campaignID].utm == action.payload.utm &&
        state.utm[action.payload.protocolID][action.payload.campaignID].shortUtm == action.payload.shortUtm) {
        return;
      }
      if (!state.utm[action.payload.protocolID]) {
        state.utm[action.payload.protocolID] = {
          [action.payload.campaignID]: {
            utm: action.payload.utm,
            shortUtm: action.payload.shortUtm,
          }
        }
      }
      state.utm[action.payload.protocolID][action.payload.campaignID] = {
        utm: action.payload.utm,
        shortUtm: action.payload.shortUtm,
      }
    })
);
