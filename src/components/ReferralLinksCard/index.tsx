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

const RoundedLink = styled.div`
  padding: 5px;
  font-size: 12px;
  background-image: ${({ theme }) => theme.special};
  color: ${({ theme }) => theme.white};
  border-radius: 12px;
  border: solid #dcd4d4;
  border-width: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  // padding: .3rem;
`;

const Grid = styled.div`
  display: grid;
  // grid-template-columns: 1fr 1fr;
  grid-template-rows: 20px;
  // grid-gap: 5px;
  padding: 0.3rem;
`;
const ColumnLabel = styled(TYPE.darkGray)`
  white-space: no-wrap;
  font-size: 15px;
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
            <RoundedLink>
              {twitterIntentUrl && (
                <a href={twitterIntentUrl}>
                  <Logo src={TwitterIcon} alt="twitter logo" />
                </a>
              )}
              <Copy toCopy={"https://" + referralLink}>
                <div>
                  <div style={{ paddingLeft: 10 }}>
                    {"  "}
                    Copy your unique link &amp; start earning
                    {/* {utmLinks[activeProtocol?.id]} */}
                  </div>
                  {activeCampaign && (
                    <div
                      style={{ fontSize: 8, color: "lightGrey", padding: 1 }}
                    >
                      {activeCampaign.baseUrl.replace("?", "")}
                    </div>
                  )}
                </div>
              </Copy>
            </RoundedLink>
          </>
        ) : (
          <>{/* <Loader /> */}</>
        )
      ) : (
        <RoundedLink style={{ marginBottom: "1rem" }}>
          <Grid>
            <Item>To check airdrop / generate referral links you must:</Item>
            <Item>
              <ul style={{ padding: 0, margin: 0 }}>
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
                  {verifiedHandleEntry ? `-Done` : `❌ Incomplete`}
                </li>
              </ul>
            </Item>
          </Grid>
        </RoundedLink>
      )}
      {/* </AutoColumn> */}
    </>
  );
}
