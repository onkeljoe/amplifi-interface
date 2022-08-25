import React, { useMemo } from "react";
import { CopyBtn } from "components/AccountDetails/Copy";
import { useActiveWeb3React } from "hooks";
import { useActiveCampaign, useReferralLink } from "state/campaigns/hooks";
import styled from "styled-components";
// gutenberg basic styles
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import TwitterIcon from "assets/svg/twitter.svg";
import getTextToTwitter from "utils/getTextToTwitter";
import { ApplicationModal } from "state/application/actions";
import { useToggleModal } from "state/application/hooks";
import { ButtonBasic } from "components/Button";
import { TYPE } from "theme";

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

const RoundedLinkLoggedOut = styled.div<{ numOfLinks?: number }>`
  font-size: 15px;
  padding: 15px;
  background-color: #fff;
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

const RoundedLinkTweetintent = styled.a`
  font-size: 15px;
  background-color: #ff3700;
  max-height: 65px;
  text-decoration: none;
  border-radius: 12px;
  border: solid #ff3700;
  border-width: 1px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 0.2s;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
`};
  :hover {
    text-decoration: none;
    background-color: #ffbc7d;
  }
  :active {
    transform: scale(0.95) translateY(4px);
  }
`;

const ButtonText = styled(TYPE.white)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`;

export default function ReferralLinksCard() {
  const [activeCampaign] = useActiveCampaign();
  const referralLink = useReferralLink();
  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);
  const { account } = useActiveWeb3React();
  const twitterIntentUrl = useMemo(() => {
    if (activeCampaign?.tweetIntent && referralLink) {
      return getTextToTwitter(activeCampaign.tweetIntent, referralLink);
    }
    return undefined;
  }, [activeCampaign?.tweetIntent, referralLink]);

  return (
    <>
      {!account && (
        <>
          <>
            <RoundedLinkLoggedOut style={{ marginBottom: "15px" }}>
              <div style={{ padding: 10, color: "#FF3700" }}>
                <div style={{ paddingBottom: 10 }}>
                  To check airdrop and generate referral links you must connect
                  your wallet:
                </div>
                <ButtonBasic width='fit-content' onClick={toggleWalletModal}>
                  <ButtonText>Connect wallet</ButtonText>
                </ButtonBasic>
              </div>
            </RoundedLinkLoggedOut>
          </>
        </>
      )}
      {/* <AutoColumn> */}
      {activeCampaign &&
        (referralLink && account ? (
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
              <CopyBtn
                toCopy={"https://" + referralLink}
                numOfLinks={twitterIntentUrl ? 2 : 1}
              >
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
              </CopyBtn>
              {twitterIntentUrl && (
                <RoundedLinkTweetintent
                  style={{ padding: "20px" }}
                  href={twitterIntentUrl}
                  // numOfLinks={twitterIntentUrl ? 2 : 1}
                >
                  <ReferralCardLink style={{ textDecoration: "none" }}>
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
          <></>
        ))}
      {/* </AutoColumn> */}
    </>
  );
}
