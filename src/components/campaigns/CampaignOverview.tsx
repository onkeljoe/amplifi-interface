import React from "react";
import Copy from "components/AccountDetails/Copy";
import Card from "components/Card";
import { AutoColumn } from "components/Column";
import FeaturedImage from "components/FeaturedImage/FeaturedImage";
import Youtube from "components/Youtube";
import { useActiveWeb3React } from "hooks";
import parse from "html-react-parser";
import styled from "styled-components";
import { TYPE } from "theme";
import { useActiveProtocol } from "../../state/governance/hooks";
import { useActiveCampaign, useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import Loader from "components/Loader";

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;

const RoundedLink = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 10px;
  padding: 10px 30px 10px 30px;
`;

export default function CampaignOverview() {
  const [activeProtocol] = useActiveProtocol();
  const referralLink = useReferralLink();
  const {account} = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const [activeCampaign] = useActiveCampaign();
  return (
    <Wrapper>
      <AutoColumn gap="0">
        <TYPE.body fontSize="16px" fontWeight="600" mb="1rem">
          Campaigns are still in testing phase and are subject to change. Please
          check back soon.
        </TYPE.body>
        <Break />
        { activeProtocol && verifiedHandleEntry ? (
          referralLink ? <>
          <Card>
            <RoundedLink>
              <Copy toCopy={"https://" + referralLink}>
                <span style={{ paddingLeft: 10 }}>
                  {"  "}
                  Copy your unique link &amp; start earning
                  {/* {utmLinks[activeProtocol?.id]} */}
                </span>
              </Copy>
            </RoundedLink>
          </Card>
          </>: <>
           <Loader />
          </>
        ) : (
          <Card>
            <RoundedLink>
              <p>
                In order to generate your unique
                referral link for rewards you must:
              </p>
              <ul>
                <li>Connect your wallet {account ? `-Done` : `-Incomplete`}</li> 
                <li>Connect your Twitter {verifiedHandleEntry ? `-Done` : `-Incomplete`}</li>
              </ul>
            </RoundedLink>
          </Card>
        )}
        {activeCampaign && activeCampaign.featuredImage && (
          <>
            <FeaturedImage image={activeCampaign.featuredImage} />
          </>
        )}
        {activeCampaign &&
          activeCampaign.description &&
          activeCampaign.budgetDescription && (
            <>
              <TYPE.body fontSize="14px" fontWeight="600" mb="1rem" mt="1rem">
                <span style={{ fontWeight: "bolder" }}>
                  {" "}
                  Campaign Incentives:{" "}
                </span>{" "}
                <span>{activeCampaign.budgetDescription}</span>{" "}
              </TYPE.body>
              <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
                {parse(activeCampaign.description)}
              </TYPE.body>
            </>
          )}
        {activeCampaign && activeCampaign.overviewVideo && (
          <Youtube src={activeCampaign.overviewVideo} />
        )}
      </AutoColumn>
    </Wrapper>
  );
}
