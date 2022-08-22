import { createReducer } from "@reduxjs/toolkit";
import { ChainId, Token } from "@uniswap/sdk";
import AddAccount from "../../assets/images/AddAccount.png";
import BeanLogo from "../../assets/images/bean-logo.jpg";
import CompLogo from "../../assets/images/compLogo.png";
import Cre8rLogo from "../../assets/images/cre8r-logo.png";
import AmpliFiLogo from "../../assets/images/cre8ramplifi-final.svg";
import ENSLogo from "../../assets/images/ens.jpeg";
import FujiLogo from "../../assets/images/fujidao_logo.png";
import HundredLogo from "../../assets/images/hundred-logo.png";
import NounsLogo from "../../assets/images/nouns-logo.png";
import RadicleLogo from "../../assets/images/radicle-logo.svg";
import UniLogo from "../../assets/images/uni-logo.png";
import DevoLogo from "../../assets/images/IMG_5812.png";
import BilliLogo from "../../assets/images/billilogo.jpg";
import ACWILogo from "../../assets/images/new-altcoinswi.png";
import GMXLogo from "../../assets/images/GMX-logo.jpg";
import { SerializedToken } from "./../user/actions";
import {
  updateActiveProtocol,
  updateFilterActive,
  updateGlobalData,
  updateMaxFetched,
  updateTopDelegates,
  updateVerifiedDelegates,
} from "./actions";
import { DelegateData } from "./hooks";
//featured images

import { serializeToken } from "../user/hooks";

export interface GovernanceInfo {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  token: SerializedToken;
  governanceAlphaAddresses: string[];
  governanceAddressBravo?: string;
  migrationProposalId?: number;
  social: string;
  emoji?: string;
  baseUrl?: string;
  hasSnapshot?: boolean;
  spaceSnapshot?: string;
}

// protocol wide data
export interface GlobaData {
  id: string;
  totalTokenHolders: number;
  totalDelegates: number;
  delegatedVotes: number;
  delegatedVotesRaw: number;
}

export const CHEESE_ADDRESS = "0x238d82a35e69d7c10fe69a649134171c63e57522";
const GOAT = new Token(ChainId.MAINNET, CHEESE_ADDRESS, 18, "GOAT", "GOAT");

export const BILLI_GOVERNANCE: GovernanceInfo = {
  id: "BilliDrop",
  name: "BilliDrop",
  logo: BilliLogo,
  primaryColor: "#1b3125",
  secondaryColor: "#e1f5ea",
  token: serializeToken(GOAT),
  governanceAlphaAddresses: [],
  // governanceAddressBravo: UNI_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 8,
  social: "@DropBilli",
  emoji: "🐐",
  baseUrl: "https://amplifi.cre8r.vip?",
  hasSnapshot: true,
  spaceSnapshot: "cre8r.eth",
  // featuredImage: AmpliFiLogo,
};

// constant addresses for supported protocols
export const UNI_GOVERNANCE_ADDRESS_ALPHA_V0 =
  "0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F";
export const UNI_GOVERNANCE_ADDRESS_ALPHA_V1 =
  "0xC4e172459f1E7939D522503B81AFAaC1014CE6F6";
export const UNI_GOVERNANCE_ADDRESS_BRAVO =
  "0x408ED6354d4973f66138C91495F2f2FCbd8724C3";

export const UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const UNI_TOKEN = new Token(
  ChainId.MAINNET,
  UNI_ADDRESS,
  18,
  "UNI",
  "Uniswap Governance Token"
);
export const UNISWAP_GOVERNANCE: GovernanceInfo = {
  id: "uniswap",
  name: "Uniswap",
  logo: UniLogo,
  primaryColor: "#FF007A",
  secondaryColor: "#FDEEF5",
  token: serializeToken(UNI_TOKEN),
  governanceAlphaAddresses: [
    UNI_GOVERNANCE_ADDRESS_ALPHA_V0,
    UNI_GOVERNANCE_ADDRESS_ALPHA_V1,
  ],
  governanceAddressBravo: UNI_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 8,
  social: "@Uniswap",
  emoji: "🔊",
  baseUrl: "https://amplifi.cre8r.vip?",
};

export const AMPLIFI_ADDRESS = "0x238d82a35e69d7c10fe69a649134171c63e57522";
const AMPLIFI = new Token(
  ChainId.MAINNET,
  AMPLIFI_ADDRESS,
  18,
  "AMPLIFI",
  "AMPLIFI GOVERNANCE TOKEN"
);

export const AMPLIFI_GOVERNANCE: GovernanceInfo = {
  id: "AMPLIFI",
  name: "AmpliFi",
  logo: AmpliFiLogo,
  primaryColor: "#383838",
  secondaryColor: "#B0B0B0",
  token: serializeToken(AMPLIFI),
  governanceAlphaAddresses: [],
  governanceAddressBravo: UNI_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 8,
  social: "@CRE8RDAO",
  emoji: "🔊",
  baseUrl: "https://amplifi.cre8r.vip?",
  hasSnapshot: true,
  spaceSnapshot: "amplifidao.eth",
  // featuredImage: AmpliFiLogo,
};

export const DEVO_ADDRESS = "0x238d82a35e69d7c10fe69a649134171c63e57522";
const DEVO = new Token(
  ChainId.MAINNET,
  DEVO_ADDRESS,
  18,
  "DEVO",
  "DEVO GOVERNANCE TOKEN"
);

export const DEVO_GOVERNANCE: GovernanceInfo = {
  id: "DEVO",
  name: "DEVO",
  logo: DevoLogo,
  primaryColor: "#383838",
  secondaryColor: "#B0B0B0",
  token: serializeToken(DEVO),
  governanceAlphaAddresses: [],
  governanceAddressBravo: UNI_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 8,
  social: "@DEVO",
  emoji: "🔊",
  baseUrl: "https://amplifi.cre8r.vip?",
  hasSnapshot: true,
  spaceSnapshot: "devo.eth",
  // featuredImage: AmpliFiLogo,
};

export const COMP_GOVERNANCE_ADDRESS_BRAVO =
  "0xc0da02939e1441f497fd74f78ce7decb17b66529";
export const COMP_GOVERNANCE_ADDRESS =
  "0xc0dA01a04C3f3E0be433606045bB7017A7323E38";
export const COMP_ADDRESS = "0xc00e94cb662c3520282e6f5717214004a7f26888";
const COMP = new Token(
  ChainId.MAINNET,
  COMP_ADDRESS,
  18,
  "COMP",
  "Compound Governance Token"
);
export const COMPOUND_GOVERNANCE: GovernanceInfo = {
  id: "compound",
  name: "Compound Governance",
  logo: CompLogo,
  primaryColor: "#00D395",
  secondaryColor: "#E1F9F1",
  token: serializeToken(COMP),
  governanceAlphaAddresses: [COMP_GOVERNANCE_ADDRESS],
  governanceAddressBravo: COMP_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 42,
  social: "@compoundfinance",
  emoji: "🏦",
};

const HND = new Token(
  ChainId.MAINNET,
  COMP_ADDRESS,
  18,
  "HND",
  "Hundred Governance Token"
);
export const HND_GOVERNANCE: GovernanceInfo = {
  id: "HND", // Protocol URI should be set to this
  name: "Hundred Finance",
  logo: HundredLogo,
  primaryColor: "#000000",
  secondaryColor: "#E1F9F1",
  token: serializeToken(HND),
  governanceAlphaAddresses: [],
  governanceAddressBravo: COMP_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 42,
  social: "@HundredFinance",
  emoji: "💯",
  baseUrl: "https://amplifi.cre8r.vip/#/amplifi/HND?",
  hasSnapshot: true,
  spaceSnapshot: "hundredfinance.eth",
};
export const AAVE_GOVERNANCE_ADDRESS =
  "0xEC568fffba86c094cf06b22134B23074DFE2252c";
export const AAVE_ADDRESS = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
const BEAN = new Token(ChainId.MAINNET, AAVE_ADDRESS, 18, "BEAN", "BEAN Token");
export const AAVE_GOVERNANCE: GovernanceInfo = {
  id: "BEAN",
  name: "Beanstalk Protocol",
  logo: BeanLogo,
  primaryColor: "#00D395",
  secondaryColor: "#E1F9F1",
  token: serializeToken(BEAN),
  governanceAlphaAddresses: [AAVE_GOVERNANCE_ADDRESS],
  social: "@BeanstalkFarms",
  emoji: "🌱",
  baseUrl: "https://amplifi.cre8r.vip/#/amplifi/BEAN?",
};
export const FUJI_GOVERNANCE_ADDRESS =
  "0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0";
export const FUJI_ADDRESS = "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e";
const FUJI = new Token(
  ChainId.MAINNET,
  FUJI_ADDRESS,
  18,
  "FUJI Pre Token Bonds",
  "FUJI Pre-Token Bonds"
);
export const FUJI_GOVERNANCE: GovernanceInfo = {
  id: "fuji",
  name: "Fuji",
  logo: FujiLogo,
  primaryColor: "#FF007A",
  secondaryColor: "#f2eeff",
  token: serializeToken(FUJI),
  governanceAlphaAddresses: [FUJI_GOVERNANCE_ADDRESS],
  social: "@FujiDAO",
  emoji: "🌋",
  baseUrl: "https://www.fujidao.org/#/dashboard/init-borrow?",
};

export const RADICLE_GOVERNANCE_ADDRESS =
  "0x690e775361AD66D1c4A25d89da9fCd639F5198eD";
export const RADICLE_ADDRESS = "0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3";
const RADICLE = new Token(
  ChainId.MAINNET,
  RADICLE_ADDRESS,
  18,
  "RAD",
  "Radicle"
);
export const RADICLE_GOVERNANCE: GovernanceInfo = {
  id: "radicle",
  name: "Radicle Governance",
  logo: RadicleLogo,
  primaryColor: "#5555FF",
  secondaryColor: "#E3E3FF",
  token: serializeToken(RADICLE),
  governanceAlphaAddresses: [RADICLE_GOVERNANCE_ADDRESS],
  social: "@radicle",
  emoji: "🌱",
};

export const ENS_GOVERNANCE_ADDRESS =
  "0x690e775361AD66D1c4A25d89da9fCd639F5198eD";
export const ENS_ADDRESS = "0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3";
const ENS = new Token(
  ChainId.MAINNET,
  RADICLE_ADDRESS,
  18,
  "ENS",
  "Ethereum Name Service"
);
export const ENS_GOVERNANCE: GovernanceInfo = {
  id: "ens",
  name: "ENS Governance",
  logo: ENSLogo,
  primaryColor: "#5284ff",
  secondaryColor: "#cfddff",
  token: serializeToken(ENS),
  governanceAlphaAddresses: [ENS_GOVERNANCE_ADDRESS],
  social: "@ensdomains",
  emoji: "🌱",
};

export const CONNECT_CONFIG: GovernanceInfo = {
  id: "connect",
  name: "Connect Social Profile", // placeholder
  logo: AddAccount, // placeholder
  primaryColor: "#5284ff", // placeholder
  secondaryColor: "#cfddff", // placeholder
  token: serializeToken(ENS), //placeholder
  governanceAlphaAddresses: [ENS_GOVERNANCE_ADDRESS], //placeholder
  social: "@twitter", // placeholder
};

export const NOUNS_GOVERNANCE_ADDRESS_BRAVO =
  "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d";
export const NOUNS_ADDRESS = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";
const NOUN = new Token(ChainId.MAINNET, NOUNS_ADDRESS, 0, "NOUN", "Nouns");
const EMOJIS = ["🍕", "🤖", "🐶", "🍤", "🚘", "💍", "🐟", "👑", "🐋", "🐸"];
export const NOUNS_GOVERNANCE: GovernanceInfo = {
  id: "nouns",
  name: "Nouns DAO Governance",
  logo: NounsLogo,
  primaryColor: "#D63C5E",
  secondaryColor: "#E8ECEF",
  token: serializeToken(NOUN),
  governanceAlphaAddresses: [],
  governanceAddressBravo: NOUNS_GOVERNANCE_ADDRESS_BRAVO,
  migrationProposalId: 0,
  social: "@nounsdao",
  emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
};

// #/connect or #/delegates/connect
// show only identity flow e.g. link to twitter
export function identityOnlyPath(pathname: string) {
  return (
    pathname.split("/", 2)[1] == CONNECT_CONFIG.id ||
    pathname.split("/", 3)[2] == CONNECT_CONFIG.id
  );
}

export const CRE8R_GOVERNANCE_ADDRESS =
  "0xa832ce1b31bfb0961e78350320ab4cb7f110e7e2";
export const CRE8R_ADDRESS = "0x238d82a35e69d7c10fe69a649134171c63e57522";
const CRE8R = new Token(
  ChainId.MAINNET,
  CRE8R_ADDRESS,
  18,
  "CRE8R",
  "CRE8R Cash"
);
export const CRE8R_GOVERNANCE: GovernanceInfo = {
  id: "CRE8R",
  name: "CRE8R",
  logo: Cre8rLogo,
  primaryColor: "#383838",
  secondaryColor: "#B0B0B0",
  token: serializeToken(CRE8R),
  governanceAlphaAddresses: [RADICLE_GOVERNANCE_ADDRESS],
  social: "@cre8rAmpliFi",
  emoji: "🧱",
  baseUrl: "https://cre8r.vip/client-discover-call-booking-form/?",
};

export const ACWI_GOVERNANCE_ADDRESS =
  "0x389E3fe2D63C5092f0ceC7685a27416B80189262";
export const ACWI_GOVERNANCE: GovernanceInfo = {
  id: "ACWI",
  name: "Alt Coins With Images",
  logo: ACWILogo,
  governanceAlphaAddresses: [ACWI_GOVERNANCE_ADDRESS],
  primaryColor: "#000", // placeholder
  secondaryColor: "#ccc", // placeholder
  token: serializeToken(ENS), // placeholder
  social: "@twitter", // placeholder
};

export const GMX_GOVERNANCE_ADDRESS_AVALANCHE =
  "0x9ab2De34A33fB459b538c43f251eB825645e8595";
export const GMX_GOVERNANCE_ADDRESS_ARBITRUM =
  "0x489ee077994B6658eAfA855C308275EAd8097C4A";
export const GMX_ADDRESS_ARBITRUM =
  "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";
export const GMX_ADDRESS_AVALANCHE =
  "0x62edc0692BD897D2295872a9FFCac5425011c661";

const GMX_ARBITRUM = new Token(
  ChainId.MAINNET, // not true, but typings dont allow to change
  GMX_ADDRESS_ARBITRUM,
  18,
  "GMX",
  "GMX Token Arbitrum"
);
const GMX_AVALANCHE = new Token(
  ChainId.MAINNET, // not true, but typings dont allow to change
  GMX_ADDRESS_AVALANCHE,
  18,
  "GMX",
  "GMX Token Avalanche"
);

export const GMX_GOVERNANCE: GovernanceInfo = {
  id: "GMX",
  name: "GMX",
  logo: GMXLogo,
  token: serializeToken(GMX_ARBITRUM),
  governanceAlphaAddresses: [
    GMX_GOVERNANCE_ADDRESS_AVALANCHE,
    GMX_GOVERNANCE_ADDRESS_ARBITRUM,
  ],
  primaryColor: "#2d42fc",
  secondaryColor: "#d6efff",
  social: "@GMX_IO",
  baseUrl: "https://amplifi.cre8r.vip?",
};

// mapping for routing
export const SUPPORTED_PROTOCOLS: { [id: string]: GovernanceInfo } = {
  CRE8R: CRE8R_GOVERNANCE,

  //  DEVO: DEVO_GOVERNANCE, //demo
  BilliDrop: BILLI_GOVERNANCE, //demo
  AMPLIFI: AMPLIFI_GOVERNANCE,
  //  ACWI: ACWI_GOVERNANCE, //demo
  // GMX: GMX_GOVERNANCE,
  // GMX: GMX_GOVERNANCE, //demo
  // connect: CONNECT_CONFIG,
};

export const FETCHING_INTERVAL = 50;

export interface GovernanceState {
  // the selected option from supported protocol options
  activeProtocol: GovernanceInfo | undefined;

  // filter only verified delegates
  filterActive: boolean;

  // top delegates based on votes
  topDelegates: {
    [protocolID: string]: DelegateData[] | undefined;
  };

  // used for paginated delegate lookup
  maxFetched: {
    [protocolID: string]: number | undefined;
  };

  // only delegates with verified usernames
  verifiedDelegates: {
    [protocolID: string]: DelegateData[] | undefined;
  };

  globalData: {
    [protocolID: string]: GlobaData | undefined;
  };

  //utm links for delegates
  utm: {
    [protocolID: string]: string;
  };
}

export const initialState: GovernanceState = {
  activeProtocol: undefined,
  filterActive: false,

  // top delegates and pagination details
  topDelegates: {},
  maxFetched: {},

  verifiedDelegates: {},
  globalData: {},
  utm: {},
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateActiveProtocol, (state, action) => {
      state.activeProtocol = action.payload.activeProtocol;
    })
    .addCase(updateFilterActive, (state, action) => {
      state.filterActive = action.payload.filterActive;
    })
    .addCase(updateTopDelegates, (state, action) => {
      state.topDelegates[action.payload.protocolID] =
        action.payload.topDelegates;
    })
    .addCase(updateVerifiedDelegates, (state, action) => {
      state.verifiedDelegates[action.payload.protocolID] =
        action.payload.verifiedDelegates;
    })
    .addCase(updateGlobalData, (state, action) => {
      state.globalData[action.payload.protocolID] = action.payload.data;
    })
    .addCase(updateMaxFetched, (state, action) => {
      state.maxFetched[action.payload.protocolID] = action.payload.maxFetched;
    })
);
