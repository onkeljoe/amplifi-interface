import React from "react";
import { useSpring, animated } from "react-spring";
import { useActiveWeb3React } from "hooks";
import { ApplicationModal } from "state/application/actions";
import { useToggleModal } from "state/application/hooks";
import styled from "styled-components";
import { TYPE } from "theme";
import { ButtonBasic } from "components/Button";

interface LandingInformation {
  firstSection: string;
  secondSection: string;
  thirdSection: string;
  fourthSection: string;
}

const landingInfo: LandingInformation = {
  firstSection:
    "Join first Web3 marketing agency working with biggest projects and earn by sharing quality products with your audience",
  secondSection:
    "We are a referral and affiliate marketing platform - AmplifiDAO",
  thirdSection:
    "Over 50% of the Amplifi is owned by contributors who earn $AMP on every KPI achieved",
  fourthSection:
    "$AMP and $veAMP is what makes us a DAO. We scale because our affiliates own the platform",
};

const LandingWrapper = styled.div`
  padding: 0;
  margin: 0;
`;

const SectionsWrapper = styled(animated.div)`
  display: grid;
  gap: 24px;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(6, 1fr);
`;

const GeneralSectionWrapper = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  box-shadow: -15px -15px 0px 0px rgba(0, 0, 0, 1);
  color: ${({ theme }) => theme.white};
  padding: 32px;
  box-sizing: border-box;
`;
const FirstSectionWrapper = styled(GeneralSectionWrapper)`
  grid-area: 1 / 1 / span 1 / span 3;
`;

const SecondSectionWrapper = styled(GeneralSectionWrapper)`
  grid-area: 2 / 2 / span 1 / span 3;
`;

const ThirdSectionWrapper = styled(GeneralSectionWrapper)`
  grid-area: 3 / 3 / span 1 / span 3;
`;

const FourthSectionWrapper = styled(GeneralSectionWrapper)`
  grid-area: 4 / 4 / span 1 / span 3;
`;

const ButtonText = styled(TYPE.white)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`;

export default function Landing() {
  return (
    <LandingWrapper>
      <TYPE.largeHeader color='primary1' marginBottom='2rem'>
        Earn money in web3 by sharing a link with your audince
      </TYPE.largeHeader>
      <LandingInfo landingInfo={landingInfo} />
      <TYPE.largeHeader color='primary1' marginTop='2rem'>
        Here&apos;s what you need to get started
      </TYPE.largeHeader>
      <FirstStep />
      <SecondStep />
      <ThirdStep />
      <FourthStep />
      <TYPE.largeHeader color='primary1' marginTop='2rem'>
        Yes, it&apos;s that easy.
      </TYPE.largeHeader>
    </LandingWrapper>
  );
}

function LandingInfo({ landingInfo }: { landingInfo: LandingInformation }) {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
  return (
    <SectionsWrapper style={props}>
      <FirstSectionWrapper>{landingInfo.firstSection}</FirstSectionWrapper>
      <SecondSectionWrapper>{landingInfo.secondSection}</SecondSectionWrapper>
      <ThirdSectionWrapper>{landingInfo.thirdSection}</ThirdSectionWrapper>
      <FourthSectionWrapper>{landingInfo.fourthSection}</FourthSectionWrapper>
    </SectionsWrapper>
  );
}

function FirstStep() {
  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);
  const { account } = useActiveWeb3React();
  return (
    <div>
      <TYPE.mediumHeader>Step 1</TYPE.mediumHeader>
      <TYPE.subHeader>
        Connect to the Amplifi App with your crypto wallet
      </TYPE.subHeader>
      <TYPE.black>
        By connecting your wallet, we are able to generate referral links. It is
        the first step to start earning
      </TYPE.black>
      <ButtonBasic onClick={toggleWalletModal}>
        <ButtonText>Connect wallet</ButtonText>
      </ButtonBasic>
      {account ? "Congrats! You are now all set to use the app!" : null}
    </div>
  );
}

function SecondStep() {
  return (
    <div>
      <TYPE.mediumHeader>Step 2</TYPE.mediumHeader>
      <TYPE.subHeader>Pick the project</TYPE.subHeader>
      <TYPE.black>
        You can see the list of the projects in the left sidebar (or dropdown on
        mobile). Choose one!.
      </TYPE.black>
    </div>
  );
}

function ThirdStep() {
  return (
    <div>
      <TYPE.mediumHeader>Step 3</TYPE.mediumHeader>
      <TYPE.subHeader>Pick the campaign</TYPE.subHeader>
      <TYPE.black>
        You can see the list of the ongoing campaigns for the project you chose.
        Pick one and read about how you can help it achieve that KPI goals by
        sharing content or a compelling message on social media
      </TYPE.black>
    </div>
  );
}

function FourthStep() {
  return (
    <div>
      <TYPE.mediumHeader>Step 4</TYPE.mediumHeader>
      <TYPE.subHeader>Share</TYPE.subHeader>
      <TYPE.black>
        Copy your unique link from the campaign page! share link with your
        audience. If your audience clicks the link we know it came from you!
        Make sure they&apos;ve done that KPI.
      </TYPE.black>
    </div>
  );
}
