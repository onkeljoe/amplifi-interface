import React from "react";
import styled from "styled-components";
import { Fade, AttentionSeeker } from "react-awesome-reveal";
import { ArrowDown } from "react-feather";
import { TYPE } from "theme";
import { Below1080Only } from "../theme/components";
import Dropdown from "../components/governance/Dropdown";
import { useWindowSize } from "hooks/useWindowSize";
import "./../theme/extraFonts.css";
import ConnectWalletButton from "components/ConnectWallet";

// config for steps. Not using now

// interface StepInformation {
//   step: number;
//   heading: string;
//   description: string;
// }
// const stepInformation: Array<StepInformation> = [
//   {
//     step: 1,
//     heading: "Connect to the Amplifi App with your crypto wallet",
//     description:
//       "By connecting your wallet, we are able to generate referral links. It is the first step to start earning",
//   },
//   {
//     step: 2,
//     heading: "Pick the project",
//     description: "Pick the project",
//   },
//   {
//     step: 3,
//     heading: "Pick the campaign",
//     description:
//       "After that, you will see the list of the ongoing campaigns for the project you chose. Pick one and read about how you can help it achieve that KPI goals by sharing content or a compelling message on social media",
//   },
//   {
//     step: 4,
//     heading: "Share",
//     description:
//       "Copy your unique link from the campaign page! Share link with your audience. If your audience clicks the link, we know it came from you! Make sure they've done that KPI",
//   },
// ];

// landing page wrapper
const LandingWrapper = styled.div`
  padding: 0 16px;
  margin: 0;
  max-height: 100vh;
  overflow: scroll;
  @media (min-width: 1081px) {
    padding: 0;
    padding-left: 88px;
    padding-right: 9px;
    width: 100%;
  }
  ::-webkit-scrollbar {
    height: 0;
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    opacity: 0.1;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background-color: #c0c1c1;
  }
`;

const InitialViewportMatcher = styled.div`
  min-height: 80vh;
`;

// wtf Amplifi wrapper
const SectionsWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(6, 1fr);
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  grid-template-columns: 1fr;
  `}
`;

// wtf Amplifi each block wrapper
const SectionWrapper = styled.div<{ position?: number }>`
  background-color: ${({ theme }) => theme.primary1};
  box-shadow: -15px -15px 0px 0px rgba(0, 0, 0, 1);
  //  box-shadow: -15px -15px 0px 0px rgba(255, 188, 125, 1);
  color: ${({ theme }) => theme.white};
  padding: 32px;
  box-sizing: border-box;
  max-width: 720px;
  font-weight: bolder;
  letter-spacing: 0.5px;
  grid-area: ${({ position }) =>
    position ? `${position} / ${position} / span 1 / span 3` : null};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  grid-area: unset;
  `}
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 3rem;
  max-width: 720px;
  will-change: opacity, transform;
`;

// landing config (what to show in 4 boxes)
const landingInfo: string[] = [
  "AmplifiDAO secures the best comissions for affiliates, builds out tracking systems, supports your content creation process & handles payouts.",
  "Discover new protocols with huge commissions dropping regularly.",
  "$AMP is distributed dollar for dollar inline with platform earnings. AmpliFi is & always will be 100% community owned.",
  "All you need to get started earning is an Ethereum wallet.",
];

export default function Landing() {
  const { width } = useWindowSize();
  const lookAtText =
    width && width <= 1080 ? "dropdown menu right here" : "left sidebar";
  return (
    <LandingWrapper>
      <InitialViewportMatcher>
        <TYPE.largeHeader
          color='primary1'
          textAlign='left'
          fontFamily='GT Haptik Medium'
          fontSize={36}
          mb='1rem'
        >
          PERMISSIONLESS AFFILIATE MARKETING FOR WEB3
        </TYPE.largeHeader>
        <TYPE.largeHeader
          color='black'
          textAlign='left'
          fontFamily='GT Haptik Medium'
          fontSize={20}
          mb='4rem'
        >
          $800,000 already paid out to content creators. <br />
          $600,000+ in commissions up for grabs on the platform currently - with
          15+ protocols on the way...
        </TYPE.largeHeader>
        <Fade direction='right' triggerOnce>
          <LandingInfo landingInfo={landingInfo} />
        </Fade>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <AttentionSeeker effect='shakeY' duration={5000}>
            <ArrowDown color='#ff3700' size={30} />
          </AttentionSeeker>
        </div>
      </InitialViewportMatcher>
      <TYPE.largeHeader color='primary1' marginTop='2rem' marginBottom='.5rem'>
        Here&apos;s what you need to get started
      </TYPE.largeHeader>
      <Fade direction='up' triggerOnce fraction={1}>
        <LandingStep
          step={1}
          heading='Connect to the Amplifi App with your crypto wallet'
          description='By connecting your wallet, we are able to generate referral links. It is
        the first step to start earning'
        >
          <ConnectWalletButton />
        </LandingStep>
      </Fade>
      <Fade direction='up' triggerOnce fraction={1}>
        <LandingStep
          step={2}
          heading='Pick the project'
          description={`You can see the list of the projects in the ${lookAtText}. Choose one,
          when you're ready`}
        >
          <Below1080Only>
            <Dropdown />
          </Below1080Only>
        </LandingStep>
      </Fade>
      <Fade
        direction='up'
        triggerOnce
        fraction={1}
        style={{ position: "relative", zIndex: -5 }}
      >
        <LandingStep
          step={3}
          heading='Pick the campaign'
          description='After that, you will see the list of the ongoing campaigns for the
          project you chose. Pick one and read about how you can help it achieve
          that KPI goals by sharing content or a compelling message on social
          media'
        />
      </Fade>
      <Fade direction='up' triggerOnce fraction={1}>
        <LandingStep
          step={4}
          heading='Share'
          description="Copy your unique link from the campaign page! Share link with your
          audience. If your audience clicks the link, we know it came from you!
          Make sure they've done that KPI"
        />
      </Fade>
      <Fade triggerOnce fraction={1}>
        <TYPE.largeHeader color='primary1' marginTop='2rem'>
          All set! Yes, it&apos;s that easy.
        </TYPE.largeHeader>
      </Fade>
    </LandingWrapper>
  );
}

function LandingInfo({ landingInfo }: { landingInfo: string[] }) {
  return (
    <SectionsWrapper>
      {landingInfo.map((v: string, i: number) => (
        <SectionWrapper key={v.slice(0, 9)} position={i + 1}>
          {v}
        </SectionWrapper>
      ))}
    </SectionsWrapper>
  );
}

function LandingStep(props: {
  step: number;
  heading: string;
  description: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}): JSX.Element {
  return (
    <StepWrapper style={props.style}>
      <TYPE.mediumHeader>Step {props.step}</TYPE.mediumHeader>
      <TYPE.subHeader>{props.heading}</TYPE.subHeader>
      <TYPE.black>{props.description}</TYPE.black>
      {props.children}
    </StepWrapper>
  );
}
