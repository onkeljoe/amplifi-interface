import React, { useMemo } from "react";
import Copy from "components/AccountDetails/Copy";
import { useActiveWeb3React } from "hooks";
import { useActiveCampaign, useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
// gutenberg basic styles
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import TwitterIcon from "assets/svg/twitter.svg";
import getTextToTwitter from "utils/getTextToTwitter";

const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-left: 4px;
  margin: 10px;
`;

export const Break = styled.div`
  width: 800px;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;

const RoundedLink = styled.div<{ numOfLinks?: number }>`
  font-size: 15px;
  max-height: 65px;
  padding: 15px;
  background-color: #ff3700;
  border-radius: 12px;
  border: solid #ff3700;
  border-width: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
  transition: all 0.4s;
  min-width: ${({ numOfLinks }) => (numOfLinks === 2 ? "342px" : "100%")};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    gap: 10px;
    margin-bottom: 10px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: fit-content;
  `}
  a {
    text-decoration: none;
  }
  :hover {
    background-color: #ffbc7d;
  }
  :active {
    transform: scale(0.9) translateY(8px);
  }
`;

const RoundedLinkLoggedOut = styled.div<{ numOfLinks?: number }>`
  font-size: 15px;
  padding: 15px;
  background-color: #ffbc7d;
  border-radius: 12px;
  border: solid #ff3700;
  border-width: 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${({ numOfLinks }) =>
    numOfLinks ? (99 / numOfLinks).toString() + "%" : "100%"};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-gap: 10px;
    margin-bottom: 10px;
  `};
  /* :hover {
    text-decoration: none;
    color: ${({ theme }) => theme.text3};
    background-color: #ff3700;
  }

  a:hover {
    color: #ffbc7d;
  } */
`;

export const ReferralCardLink = styled.a`
  color: ${({ theme }) => theme.white};
  max-height: 65px;
  padding: 8px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
  :hover {
    cursor: pointer;
    /* opacity: 0.8; */
    color: #ff3700;
  }
`;

const RoundedLinkTweetintent = styled.div`
  font-size: 15px;
  background-color: #ff3700;
  max-height: 65px;
  border-radius: 12px;
  border: solid #ff3700;
  border-width: 1px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: background-color 0.2s;
  transition: all 0.4s;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
`};
  :hover {
    text-decoration: none;
    background-color: #ffbc7d;
  }
  :active {
    transform: scale(0.9) translateY(8px);
  }
`;

export default function ReferralLinksCard() {
  const [activeProtocol] = useActiveProtocol();
  const [activeCampaign] = useActiveCampaign();
  const referralLink = useReferralLink();
  const twitterIntentUrl = useMemo(() => {
    if (activeCampaign?.tweetIntent && referralLink) {
      return getTextToTwitter(activeCampaign.tweetIntent, referralLink);
    }
    return undefined;
  }, [activeCampaign?.tweetIntent, referralLink]);

  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  return (
    <>
      {/* <AutoColumn> */}
      {activeProtocol && verifiedHandleEntry ? (
        referralLink ? (
          <>
            <div
              style={{
                padding: 10,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <RoundedLink numOfLinks={twitterIntentUrl ? 2 : 1}>
                <Copy toCopy={"https://" + referralLink}>
                  <div style={{ padding: "5px" }}>
                    <div>
                      {"  "}
                      Copy your unique link &amp; start earning
                      {/* {utmLinks[activeProtocol?.id]} */}
                    </div>
                    {activeCampaign && (
                      <div style={{ fontSize: "9px", padding: "2px" }}>
                        {activeCampaign.baseUrl.replace("?", "")}
                      </div>
                    )}
                  </div>
                </Copy>
              </RoundedLink>
              {twitterIntentUrl && (
                <RoundedLinkTweetintent
                  style={{ padding: "20px" }}
                  // numOfLinks={twitterIntentUrl ? 2 : 1}
                >
                  <ReferralCardLink
                    style={{ textDecoration: "none" }}
                    href={twitterIntentUrl}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: "0 1 auto" }}>
                        Tweet your unique link
                      </div>
                      <div style={{ flex: "0 1 auto" }}>
                        <Logo src={TwitterIcon} alt='twitter logo' />
                      </div>
                    </div>
                  </ReferralCardLink>
                </RoundedLinkTweetintent>
              )}
            </div>
          </>
        ) : (
          <>{/* <Loader /> */}</>
        )
      ) : (
        <RoundedLinkLoggedOut>
          <div style={{ padding: 10, color: "#fff" }}>
            <div style={{ paddingBottom: 10 }}>
              To check airdrop and generate referral links you must:
            </div>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>
                Connect your wallet{" "}
                {account ? (
                  <span style={{ color: "green" }}>✔ Done</span>
                ) : (
                  <span style={{ color: "red" }}>❌ Incomplete</span>
                )}
              </li>
              <li>
                Connect your Twitter{" "}
                {verifiedHandleEntry ? (
                  `-Done`
                ) : (
                  <span style={{ color: "red" }}>❌ Incomplete</span>
                )}
              </li>
            </ul>
          </div>
        </RoundedLinkLoggedOut>
      )}
      {/* </AutoColumn> */}
    </>
  );
}
