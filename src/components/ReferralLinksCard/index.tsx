import React, { useMemo } from "react";
import { CopyBtn } from "components/AccountDetails/Copy";
import { useActiveWeb3React } from "hooks";
import { useActiveCampaign, useReferralLink } from "state/campaigns/hooks";
import styled from "styled-components";
import { darken } from "polished";
// gutenberg basic styles
import "@wordpress/block-library/build-style/common.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";
import { Twitter as TwitterIcon } from "react-feather";
import getTextToTwitter from "utils/getTextToTwitter";
import { ApplicationModal } from "state/application/actions";
import { useToggleModal } from "state/application/hooks";
import { ButtonBasic } from "components/Button";
import { TYPE } from "theme";
import { ExternalLink } from "../../theme/components";

export const Break = styled.div`
  width: 800px;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;

const LoggedOutCard = styled.div<{ numOfLinks?: number }>`
  font-size: 15px;
  padding: 25px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.primary1};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
  width: ${({ numOfLinks }) =>
    numOfLinks ? (99 / numOfLinks).toString() + "%" : "100%"};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-gap: 10px;
  `};
`;

const RoundedLinkTweetintent = styled(ExternalLink)`
  padding: 15px;
  background-color: ${({ theme }) => theme.primary1};
  max-height: 65px;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     width: 100%;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     min-width: fit-content;
  `}
  :hover {
    text-decoration: none;
    background-color: ${({ theme }) => theme.secondary1};
    color: ${({ theme }) => theme.primary1};
  }
  :focus {
    text-decoration: none;
    outline-style: solid;
    outline-color: ${({ theme }) => darken(0.05, theme.secondary1)};
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
        <LoggedOutCard>
          <TYPE.blue style={{ paddingBottom: 10 }}>
            To check airdrop and generate referral links you must connect your
            wallet:
          </TYPE.blue>
          <ButtonBasic onClick={toggleWalletModal}>
            <ButtonText>Connect wallet</ButtonText>
          </ButtonBasic>
        </LoggedOutCard>
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
                {activeCampaign && (
                  <div style={{ fontSize: "9px", padding: "2px" }}>
                    {activeCampaign.baseUrl.replace("?", "")}
                  </div>
                )}
              </CopyBtn>
              {twitterIntentUrl && (
                <RoundedLinkTweetintent href={twitterIntentUrl} color='white'>
                  <TYPE.custom
                    fontSize='0.825rem'
                    fontWeight={400}
                    marginRight='8px'
                  >
                    Tweet your unique link
                  </TYPE.custom>
                  <TwitterIcon size={20} fill='#fff' />
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
