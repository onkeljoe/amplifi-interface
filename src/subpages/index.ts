import BoostCalculator from "./BoostCalculator";
/**
 * Overrides for tabs
 * This takes priority over WP content
 * key = the end part of the URI
 * value = component to display instead
 */
const subpages : {[endUri: string]: () => JSX.Element} = {
  "boost-calculator": BoostCalculator,
  "beets-boosted-bribes-snapshot-voting-how-to-get-boost": BoostCalculator
}

export default subpages