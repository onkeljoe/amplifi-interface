import Copy from "components/AccountDetails/Copy";
import Card from "components/Card";
import Loader from "components/Loader";
import { useActiveWeb3React } from "hooks";
import { useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import React, { useMemo } from "react";
import { useActiveCampaign } from "state/campaigns/hooks";
import parse from "html-react-parser";
// gutenberg basic styles
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import { AutoColumn } from "../Column";
import Row, { AutoRow, RowBetween, RowFixed } from "../Row";
import {
  TYPE,
  BlankInternalLink,
  OnlyAboveExtraSmall,
  OnlyAboveSmall,
  OnlyAboveLarge,
} from "../../theme";
import getTextToTwitter from "utils/getTextToTwitter";
import TwitterIcon from "assets/svg/twitter.svg";

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
  padding: 15px;
  background-color: #ffbc7d;
  color: ${({ theme }) => theme.white};
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
  :hover {
    text-decoration: none;
    color: ${({ theme }) => theme.text3};
    background-color: #ff3700;
  }

  a:hover {
    color: #ffbc7d;
  }

`;

const RoundedLinkLoggedOut = styled.div<{ numOfLinks?: number }>`
  font-size: 15px;
  padding: 15px;
  background-color: #ffbc7d;
  color: ${({ theme }) => theme.white};
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
  color: #ffbc7d;
    background-color: '#ff3700';
  padding: 8px;
  outline: none;
  border: 1px solid transparent;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  :hover {
    cursor: pointer;
    /* opacity: 0.8; */
    color: '#ff3700!important';
    background-color: '#ffbc7d';
  
  }
`;

const RoundedLinkTweetintent = styled.div`
 font-size: 15px;

  color: #ffbc7d;
  background-color: #ff3700;


border-radius: 12px;
border: solid #ff3700;
border-width: 1px;
display: flex;
justify-content: space-around;
align-items: center;

${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
`};
:hover {
  text-decoration: none;
color: #ff3700;
background-color: #ffbc7d;
}

a:hover {
  color: #ff3700;
background-color: #ffbc7d;
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
                justifyContent: "space-around",
                
              }}
            >
              <RoundedLink numOfLinks={twitterIntentUrl ? 2 : 1}>
                <Copy toCopy={"https://" + referralLink}>
                  <div style={{ padding: '5px' }}>
                    <div>
                      {"  "}
                      Copy your unique link &amp; start earning
                      {/* {utmLinks[activeProtocol?.id]} */}
                    </div>
                    {activeCampaign && (
                      <div style={{ fontSize: "9px", padding: '2px' }}>
                        {activeCampaign.baseUrl.replace("?", "")}
                      </div>
                    )}
                  </div>
                </Copy>
              </RoundedLink>
              {twitterIntentUrl && (
                <RoundedLinkTweetintent
                  style={{ padding: '20px' }}
                  // numOfLinks={twitterIntentUrl ? 2 : 1}
                >
                  <ReferralCardLink style={{textDecoration: 'none'}} href={twitterIntentUrl}>
                    <div style={{display: "flex", alignItems: "center"}}>
                      <div style={{ flex:"0 1 auto"}}>Tweet your unique link</div>
                      <div style={{flex:"0 1 auto"}}>
                        <Logo src={TwitterIcon} alt="twitter logo" />
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
          <div style={{ padding: 10, color: "#ff3700"  }}>
            <div style={{ paddingBottom: 10 }}>
              To check airdrop and generate referral links you must:
            </div>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>
                Connect your wallet{" "}
                {account ? (
                  <span style={{ color: "green",  }}>
                    ✔ Done
                  </span>
                ) : (
                  <span style={{ color: "red",  }}>
                    ❌ Incomplete
                  </span>
                )}
              </li>
              <li>
                Connect your Twitter{" "}
                {verifiedHandleEntry ? `-Done` : `❌ Incomplete`}
              </li>
            </ul>
          </div>
        </RoundedLinkLoggedOut>
      )}
      {/* </AutoColumn> */}
    </>
  );
}
