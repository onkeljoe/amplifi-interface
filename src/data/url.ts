import config from "config";
export async function getUrl(
  twitterHandle: string,
  roughBaseUrl: string,
  campaignId: string,
  protocolId: string,
  previousUrl?: string, //this is for rate limiting, this assumes that the shortened url does work
  shortenedUrl?: string
): Promise<{ utm: string; shortUtm: string | undefined } | undefined> {
  /**
   * https://hundred.finance/?utm_source=source&utm_medium=medium&utm_campaign=name&utm_id=twitter-ugm
   */
  //https://support.google.com/analytics/answer/10917952?hl=en#zippy=%2Cin-this-article
  let baseUrl: string = roughBaseUrl;
  if (
    roughBaseUrl.charAt(roughBaseUrl.length - 1) != "?" &&
    roughBaseUrl.charAt(roughBaseUrl.length - 1) == "/"
  ) {
    baseUrl = roughBaseUrl + "?";
  } else if (
    roughBaseUrl.charAt(roughBaseUrl.length - 1) != "?" &&
    roughBaseUrl.charAt(roughBaseUrl.length - 1) != "/"
  ) {
    baseUrl = roughBaseUrl + "/?";
  }
  const campaignUrl = baseUrl;
  const utm_content = twitterHandle;
  const utm_campaign = campaignId; //todo- make id campaign specific rather than protocol specific
  const utm_source = protocolId;
  const domain = {
    id: config.rebrandly.id,
    // fullName: config.rebrandly.fullName,
  };

  const campaignUrlComponents: any = [];
  campaignUrlComponents.push(`utm_content=${utm_content}`);
  campaignUrlComponents.push(`utm_campaign=${utm_campaign}`);
  campaignUrlComponents.push(`utm_source=${utm_source}`);

  function getLongLink() {
    return baseUrl?.replace("https://", "") + campaignUrlComponents.join("&");
  }
  if (!process.env.REACT_APP_REBRANDLY) {
    return { utm: getLongLink(), shortUtm: undefined };
  }

  if (shortenedUrl && getLongLink() == previousUrl) {
    return { utm: getLongLink(), shortUtm: shortenedUrl };
  }

  const urlComponents = [];

  urlComponents.push(`domain[id]=${domain.id}`);
  // urlComponents.push(`domain[fullName]=${domain.fullName}`);  //consider for deletion 

  const options: any = {
    method: "GET",
    headers: {
      Accept: "application/json",
      apikey: process.env.REACT_APP_REBRANDLY,
    },
  };
  const response = await fetch(
    "https://api.rebrandly.com/v1/links/new?destination=" +
      encodeURIComponent(campaignUrl + campaignUrlComponents.join("&")) +
      "&" +
      urlComponents.join("&"),
    options
  );

  if (response.ok != true) {
    console.error("link shortening failed");
    return { utm: getLongLink(), shortUtm: undefined };
  }
  const res = await response.json();
  return { utm: getLongLink(), shortUtm: res.shortUrl };
}
