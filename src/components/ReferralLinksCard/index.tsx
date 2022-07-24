import Copy from "components/AccountDetails/Copy";
import Card from "components/Card";
import Loader from "components/Loader";
import { useActiveWeb3React } from "hooks";
import { useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import React from 'react'

export const Break = styled.div`
  width: 100%;
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
  return (
    <>
      {activeProtocol && verifiedHandleEntry ? (
          referralLink ? (
            <>
              <Card>
                <RoundedLink style={{ padding: '5px' }}>
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
    </>
  )
}


