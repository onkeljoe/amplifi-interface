type IconFA = string;
type Token = "ETH" | "CRE8R" | "AMP" | "USDC";

// either a general icon or a token icon
export type Icon = IconFA & Token;

// link with actual url for href and text for ui
interface Link {
  url: string;
  text: string;
}

// optional info box on hover (link can be placed either in the start or
// in the middle or in the end)
// BIG question: how is the user going to click on the link if the box shows on hover??
export interface InfoBox {
  // startText?: string;
  // link?: Link;
  // endText?: string;
  extraInfo?: string;
}

// box with orange bckg-color and optional InfoBox on hover, this Icon would be a token icon generally
export interface Box {
  icon?: Icon;
  text: string;
  extraInfo?: string;
}

// this what comes to the IncentivesKPI component
export interface IncentivesAndKPIs {
  incentives: Array<Box>;
  bonus: Array<Box>;
  kPIs: Array<Box>;
}

// --------------------------------

// we would check in the component what's the type of highlight and show matching ui Icon
type HighlightName = "money" | "calendar" | "referree";

// base type for section underneath incentives and kpis
interface Highlight {
  type: HighlightName;
  subText: string;
  extraInfo?: string;
}

// says how much money already paid out, should be dynamic
export interface Money extends Highlight {
  mainText: string; //todo - make dynamic
  payoutKey?: string; // this key will be passed into the server to get the actual paid out
  payoutTokens: Array<Icon>;
}

// says the frequency of payouts
export interface Calendar extends Highlight {
  mainText: string;
}

// says what you give to referree
export interface Referree extends Highlight {
  giveTokens: Array<Icon>;
  mainText: string;
}

// we can add more highlightes in future and what we give to component is an array of highlights
export type incomingHighlightes = Array<Money | Calendar | Referree>;
