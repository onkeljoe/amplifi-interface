import React from "react";
import styled from "styled-components";
import { Info } from "react-feather";
import { Row } from "components/Row";
import { TYPE } from "theme";
import USDC from "../../assets/svg/usdc-logo.svg";
import Amplifi from "../../assets/images/amplifi-logo-no-text.png";
import ETH from "../../assets/svg/eth-logo.svg";

//example of possible data entries interfaces

interface Incentives {
  payoutTokenForRefereeName: string;
  payoutTokenForRefereeAmount: string;
  AMPAmount: string;
}

interface IncentivesAndKPI {
  incentives: Incentives;
  KPIs: string[];
}

// const dataFromWP: IncentivesAndKPI[] = [
//   {
//     incentives: {
//       payoutTokenForRefereeName: "ETH",
//       payoutTokenForRefereeAmount: "5%",
//       AMPAmount: "matching $AMP",
//     },
//     KPIs: ["deposits ETH to Juicebox", "payouts happen monthly"],
//   },
//   {
//     incentives: {
//       payoutTokenForRefereeName: "USDC",
//       payoutTokenForRefereeAmount: "$60",
//       AMPAmount: "$60",
//     },
//     KPIs: ["votes on CRE8R/FTM pool", "holds bribe payments"],
//   },
// ];

const IncentivesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  padding: 15px 20px;
  border: 2px solid #959595;
  border-radius: 26px;
  width: fit-content;
`;

const KPIWrapper = styled(IncentivesWrapper)`
  width: 100%;
`;

const TokenBox = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 7px 12px;
  border-radius: 59px;
  white-space: nowrap;
`;

const USDCLogo = styled.div`
  width: 13px;
  height: 13px;
  background-image: url(${USDC});
  background-size: cover;
  outline: none;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.25));
`;

const ETHLogo = styled(USDCLogo)`
  background-image: url(${ETH});
`;

const AmplifiLogo = styled(USDCLogo)`
  background-image: url(${Amplifi});
  border-radius: 50%;
`;

export default function IncentivesKPI(props: { data: IncentivesAndKPI[] }) {
  return (
    <Row gap='12px'>
      <Incentives data={props.data[0].incentives} />
      <KPI data={props.data[0].KPIs} />
    </Row>
  );
}

export function Incentives(props: { data: Incentives }) {
  return (
    <IncentivesWrapper>
      <TYPE.custom color='#959595' fontSize={12}>
        For every referral you will get
      </TYPE.custom>
      <Row gap='12px'>
        <TokenBox>
          {props.data.payoutTokenForRefereeName === "ETH" ? (
            <ETHLogo />
          ) : (
            <USDCLogo />
          )}
          <TYPE.custom color='#ffffff' fontSize={12}>
            {props.data.payoutTokenForRefereeAmount}
          </TYPE.custom>
        </TokenBox>
        <TYPE.custom color='#959595' fontSize={12}>
          AND
        </TYPE.custom>
        <TokenBox>
          <AmplifiLogo />
          <TYPE.custom color='#ffffff' fontSize={12}>
            {props.data.AMPAmount}
          </TYPE.custom>
        </TokenBox>
      </Row>
    </IncentivesWrapper>
  );
}

export function KPI(props: { data: string[] }) {
  return (
    <KPIWrapper>
      <TYPE.custom color='#959595' fontSize={12}>
        Referral is generated when user
      </TYPE.custom>
      <Row gap='12px'>
        {props.data.map((each) => (
          <TokenBox key={each.slice(0, 9)}>
            <TYPE.custom color='#ffffff' fontSize={12}>
              {each}
            </TYPE.custom>
          </TokenBox>
        ))}
        {/* <TokenBox>
          <TYPE.custom color='#ffffff' fontSize={12}>
            deposits ETH to Juicebox
          </TYPE.custom>
        </TokenBox>
        <TYPE.custom color='#959595' fontSize={12}>
          AND
        </TYPE.custom>
        <TokenBox>
          <TYPE.custom color='#ffffff' fontSize={12}>
            payouts happen monthly
          </TYPE.custom>
          <Info size={13} fill='#fff' color='#ff3700' />
        </TokenBox> */}
      </Row>
    </KPIWrapper>
  );
}
