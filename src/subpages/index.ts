import BoostCalculator from "./BoostCalculator";
import PayoutResults from "./PayoutResults";

interface SubPages {
  [protocolID: string]: {
    [campaignID: string]: {
      [tabUri: string]: {
        Component: (props?: any) => JSX.Element;
        props?: { [key: string]: string | number };
      };
    };
  };
}

/**
 * Overrides for tabs
 * This takes priority over WP content
 * key = the end part of the URI
 * value = component to display instead
 */
const subpages: SubPages = {
  CRE8R: {
    "beets-boosted-bribes": {
      "boost-calculator": {
        Component: BoostCalculator,
        props: {},
      },
      "beets-boosted-bribes-snapshot-voting-how-to-get-boost": {
        Component: PayoutResults,
      },
    },
  },
};

export default subpages;
