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
import { useActiveProtocol, useUtm } from "../../state/governance/hooks";
// const Scammyclient = new ApolloClient({
//   // Change this to the URL of your WordPress site.
//   uri: "https://cre8r.vip/graphql"
// });

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
  const utmLinks = useUtm();
  const { account } = useActiveWeb3React();

  return (
    <Wrapper>
      <AutoColumn gap="0">
        <TYPE.body fontSize="16px" fontWeight="600" mb="1rem">
          Campaigns are still in testing phase and are subject to change. Please
          check back soon.
        </TYPE.body>
        <Break />
        {utmLinks && activeProtocol && account ? (
          <Card>
            <RoundedLink>
              <Copy toCopy={"https://" + utmLinks[activeProtocol?.id]}>
                <span style={{ paddingLeft: 10 }}>
                  {"  "}
                  Copy your unique link &amp; start earning
                  {/* {utmLinks[activeProtocol?.id]} */}
                </span>
              </Copy>
            </RoundedLink>
          </Card>
        ) : (
          <Card>
            <RoundedLink>
              <p>
                Please connect to wallet in order to generate your unique
                referral link for rewards.
              </p>
            </RoundedLink>
          </Card>
        )}
        {activeProtocol && activeProtocol.featuredImage && (
          <>
            <FeaturedImage image={activeProtocol.featuredImage} />
          </>
        )}
        {activeProtocol &&
          activeProtocol.description &&
          activeProtocol.campaignBudget && (
            <>
              <TYPE.body fontSize="14px" fontWeight="600" mb="1rem" mt="1rem">
                <span style={{ fontWeight: "bolder" }}>
                  {" "}
                  Campaign Incentives:{" "}
                </span>{" "}
                <span>{activeProtocol.campaignBudget}</span>{" "}
                {activeProtocol.token.symbol} {/* add token logo(s)  */}
                {/* <WrappedListLogo src={activeProtocol.logo} style={{width: 100, height: 100}}/> */}
              </TYPE.body>
              <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
                {parse(activeProtocol.description)}
              </TYPE.body>
            </>
          )}
        {activeProtocol && activeProtocol.video && (
          <Youtube src={activeProtocol.video} />
        )}
      </AutoColumn>
    </Wrapper>
  );
}
