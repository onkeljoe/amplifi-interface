import Copy from "components/AccountDetails/Copy";
import Card from "components/Card";
import Loader from "components/Loader";
import { useActiveWeb3React } from "hooks";
import { useReferralLink } from "state/campaigns/hooks";
import { useVerifiedHandle } from "state/social/hooks";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import React from 'react'
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
            </>
          ) : (
            <>
              <Loader />
            </>
          )
        ) : (
          <Card>
            <RoundedLink>
              <p>
                In order to generate your unique referral link for rewards you
                must:
              </p>
              <ul>
                <li>Connect your wallet {account ? `-Done` : `-Incomplete`}</li>
                <li>
                  Connect your Twitter{" "}
                  {verifiedHandleEntry ? `-Done` : `-Incomplete`}
                </li>
              </ul>
            </RoundedLink>
          </Card>
        )}
    </>
  )
}
