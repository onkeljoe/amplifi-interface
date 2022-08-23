function getTextToTwitter(text: string, customLink: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text + customLink
  )}`;
}

export default getTextToTwitter;
