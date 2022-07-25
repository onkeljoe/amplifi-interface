import Copy from "components/AccountDetails/Copy";
import Card from "components/Card";
import Loader from "components/Loader";
import { useActiveWeb3React } from "hooks";
import { useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import React from 'react'
import { useActiveCampaign } from "state/campaigns/hooks";
import parse from "html-react-parser";
// gutenberg basic styles
import "@wordpress/block-library/build-style/common.css"
import "@wordpress/block-library/build-style/style.css"
import "@wordpress/block-library/build-style/theme.css"
import { AutoColumn } from "../Column";




export const Break = styled.div`
  width: 800px;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;

const RoundedLink = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 10px;
  padding: 5px!important;
  font-size: 12px!important;
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  padding: .3rem;
  
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr;
  grid-template-rows: 40px;
  grid-gap: 5px;
`;
export default function ReferralLinksCard() {
  const [activeProtocol] = useActiveProtocol();
  const referralLink = useReferralLink();
  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const [activeCampaign] = useActiveCampaign();
  return (
    <>
    <AutoColumn>
    {activeCampaign && activeCampaign.content && <>
      {parse(activeCampaign.content)}
    </>}
      {activeProtocol && verifiedHandleEntry ? (
          referralLink ? (
            <>
              <Card style={{ maxWidth: '800px' }}>
                <RoundedLink style={{ padding: '20px', maxWidth: '800px!important' }}>
                  <Copy toCopy={"https://" + referralLink}>
                    <span style={{ paddingLeft: 10 }}>
                      {"  "}
                      Copy your unique link &amp; start earning
                      {/* {utmLinks[activeProtocol?.id]} */}
                    </span>
                  </Copy>
                </RoundedLink>
              </Card>
            </>
          ) : (
            <>
              <Loader />
            </>
          )
        ) : (
          <Card>
            <RoundedLink >
              <Grid>
                <Item >
                  To check airdrop / generate referral links you must:
                </Item>
                <Item >
                <ul style={{ padding: 0, margin: 0 }} >
                  <li>Connect your wallet {account ? <span style={{ color: 'green' }}>✔ Done</span> : <span style={{ color: 'red' }}>❌ Incomplete</span>}</li>
                  <li>
                    Connect your Twitter{" "}
                    {verifiedHandleEntry ? `-Done` : `❌ Incomplete`}
                  </li>
                </ul>
                </Item>
              </Grid>
            </RoundedLink>
          </Card>
        )}
        </AutoColumn>
    </>
  )
}


