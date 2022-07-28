import BoostCalculator from "./BoostCalculator";
/**
 * Overrides for tabs
 * This takes priority over WP content
 * key = the end part of the URI
 * value = component to display instead
 */
const Subpages : {[endUri: string]: () => JSX.Element} = {
  "boost-calculator": BoostCalculator
}

export default Subpages