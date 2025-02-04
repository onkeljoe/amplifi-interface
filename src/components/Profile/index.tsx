import React, { useState, useEffect } from "react";
import { AutoColumn } from "../Column";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import EmptyProfile from "../../assets/images/emptyprofile.png";
import { useToggleModal } from "../../state/application/hooks";
import { useActiveWeb3React, useTheme } from "../../hooks";
import ReactGA from "react-ga";
import { ApplicationModal } from "../../state/application/actions";
import Card from "../Card";
import { RowFixed, RowBetween, RowFlat, Row } from "../Row";
import { TYPE, BlankInternalLink, StyledInternalLink } from "../../theme";
import { ButtonBasic, ButtonCustom } from "../Button";
import { shortenAddress } from "../../utils";
import {
  useVerifiedHandle,
  useTwitterProfileData,
} from "../../state/social/hooks";
import { useTwitterAccount } from "../../state/user/hooks";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import Modal from "../Modal";
import TwitterFlow from "../twitter/TwitterFlow";
import TwitterLoginButton from "../twitter/TwitterLoginButton";
import TwitterIcon from "../../assets/images/Twitter_Logo_Blue.png";
import LogoText from "../governance/LogoText";
import { lighten } from "polished";
import VoteContent from "./VoteContent";
import WalletSummary from "./WalletSummary";
import MysteryAmplifiCard from "components/MysteryAmplifiCard";
import { ProfileTooltip } from "components/Tooltip";
import useOnClickOutside from "hooks/useClickOutside";

const SectionWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  padding-top: 2rem;
  height: 100%;

  @media (max-width: 1080px) {
    padding: 0;
  }
`;

const BackgroundWrapper = styled.div<{ bgColor?: string; account: boolean }>`
  background: ${({ theme, bgColor, account }) =>
    !account
      ? theme.bg2
      : `linear-gradient(180deg, ${bgColor} 0%, ${theme.bg1} 100%);`};
  padding: 1rem;
  height: ${({ account }) => (account ? "100%" : "initial")};
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-right-radius: ${({ account }) => (!account ? "20px" : "0")};
  border-bottom-left-radius: ${({ account }) => (!account ? "20px" : "0")};
`;

const ButtonText = styled(TYPE.white)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`;

const TwitterButton = styled(ButtonBasic)`
  padding: 6px 12px;
  white-space: nowrap;
  width: 100%;
`;

const TwitterLogo = styled.img`
  height: 24px;
  width: 24px;
`;

const RoundedProfileImage = styled.div`
  height: 48px;
  width: 48px;
  background: ${({ theme }) => theme.bg4};
  border-radius: 50%;
  margin-right: 16px;

  & > img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
`;

const Above1080Only = styled.div`
  display: initial;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;
  @media (max-width: 1080px) {
    display: initial;
    position: fixed;
    width: 100%;
    bottom: 0;
    background-color: ${({ theme }) => theme.bg2};
    z-index: 2;
    padding: 0.5rem;
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
  }
`;

const WhiteCard = styled.div`
  background: white;
  padding: 10px;
  border-radius: 12px;
`;

const AirdropGreyBox = styled.div`
  min-width: 25%;
  // width: 120px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg2};
  height: 38px;
  margin-left: 5px;
  :hover {
    cursor: help;
  }
`;

export default function Profile() {
  const theme = useTheme();

  // account details
  const { chainId, account } = useActiveWeb3React();
  const [activeProtocol] = useActiveProtocol();

  // UI views
  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);

  // toggle modal for twitter verification
  const [showTwitterFlow, setShowTwitterFlow] = useState<boolean>(false);

  // get any verified handles for this user + timestamps they were created at
  const [twitterAccount] = useTwitterAccount(); // logged in account
  const verifiedHandleEntry = useVerifiedHandle(account);

  const loadingVerifiedHandles = verifiedHandleEntry === null;
  const profileData = useTwitterProfileData(verifiedHandleEntry?.handle);

  // on redirect from twitter, if signed in, not verified, and no loading, show modal
  const [loaded, setLoaded] = useState(false);
  const { username: usernameQuery } = useParsedQueryString();
  useEffect(() => {
    if (
      twitterAccount &&
      !verifiedHandleEntry &&
      !loadingVerifiedHandles &&
      !loaded &&
      usernameQuery
    ) {
      setShowTwitterFlow(true);
      setLoaded(true);
    }
  }, [
    loadingVerifiedHandles,
    twitterAccount,
    loaded,
    usernameQuery,
    verifiedHandleEntry,
  ]);

  // toggle for mobile view
  const [showProfileModal, setShowProfileModal] = useState(false);

  const ConnectPitch = ({ stageText }: { stageText: string }) => (
    <TYPE.blue fontSize='12px' paddingTop={"10px"}>
      Connect your{` ${stageText} `} to view your{" "}
      <StyledInternalLink
        to={"/campaigns/amplifi/amplifi-publisher-airdrop"}
        style={{
          textDecoration: "underline",
          color: "black",
        }}
      >
        airdrop
      </StyledInternalLink>{" "}
      💰
    </TYPE.blue>
  );
  const ProfileContent = () => (
    <SectionWrapper>
      <BackgroundWrapper
        account={!!account}
        bgColor={
          account
            ? lighten(
                "0.01",
                activeProtocol?.secondaryColor
                  ? activeProtocol.secondaryColor
                  : theme.bg2
              )
            : theme.bg2
        }
      >
        {!account ? (
          <Above1080Only>
            <TYPE.body
              fontWeight={500}
              fontSize='14px'
              color={activeProtocol?.primaryColor}
              mb='1rem'
            >
              <ConnectPitch stageText='Wallet and Twitter' />
            </TYPE.body>
            {activeProtocol && (
              <ButtonCustom
                color={activeProtocol?.primaryColor}
                bgColor={activeProtocol?.secondaryColor}
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                }}
                onClick={() => toggleWalletModal()}
              >
                Connect Wallet
              </ButtonCustom>
            )}
          </Above1080Only>
        ) : (
          <AutoColumn gap='16px'>
            {!verifiedHandleEntry && account ? (
              !twitterAccount ? (
                <WhiteCard>
                  <RowFlat>
                    <MysteryAmplifiCard width={"140px"} />
                    <div style={{ width: "5px" }} />
                    <TwitterLoginButton text='Add a public identity' />
                  </RowFlat>
                  <ConnectPitch stageText={"Twitter"} />
                </WhiteCard>
              ) : (
                <TwitterButton
                  onClick={() => {
                    ReactGA.event({
                      category: "Social",
                      action: "Start Link",
                      label: "Not linked",
                    });
                    setShowTwitterFlow(true);
                  }}
                >
                  <RowBetween>
                    <TYPE.white fontSize='14px'>
                      Add a public identity
                    </TYPE.white>
                    <TwitterLogo src={TwitterIcon} />
                  </RowBetween>
                </TwitterButton>
              )
            ) : null}
            {account && verifiedHandleEntry && (
              <WhiteCard>
                <RowFlat>
                  <MysteryAmplifiCard />
                  <AirdropGreyBox />
                  <AirdropGreyBox />
                </RowFlat>
              </WhiteCard>
            )}
            <WalletSummary />
            <TYPE.main mb='16px'>
              Your{" "}
              <span style={{ color: activeProtocol?.primaryColor }}>
                {" "}
                {activeProtocol?.name}
              </span>{" "}
              breakdown
            </TYPE.main>
            <VoteContent />
          </AutoColumn>
        )}
      </BackgroundWrapper>
    </SectionWrapper>
  );

  return (
    <>
      <Modal
        isOpen={showTwitterFlow}
        onDismiss={() => setShowTwitterFlow(false)}
      >
        <TwitterFlow onDismiss={() => setShowTwitterFlow(false)} />
      </Modal>
      <MobileWrapper>
        <Modal
          isOpen={showProfileModal}
          onDismiss={() => setShowProfileModal(false)}
        >
          <ProfileContent />
        </Modal>
        <Card padding='10px'>
          <RowBetween>
            <BlankInternalLink
              to={`/delegates/${activeProtocol?.id}/${account}`}
            >
              <Row>
                <RoundedProfileImage>
                  <img
                    src={
                      !profileData?.profileURL
                        ? EmptyProfile
                        : profileData?.profileURL
                    }
                  />
                </RoundedProfileImage>
                {!account ? (
                  <TYPE.main>Your Address</TYPE.main>
                ) : (
                  chainId &&
                  (verifiedHandleEntry?.handle ? (
                    <AutoColumn gap='4px'>
                      <LogoText type='twitter'>
                        @{verifiedHandleEntry.handle}
                      </LogoText>
                      <TYPE.main fontSize='12px'>
                        {shortenAddress(account)}
                      </TYPE.main>
                    </AutoColumn>
                  ) : (
                    <TYPE.main mr='10px' color={theme.text1}>
                      {shortenAddress(account)}
                    </TYPE.main>
                  ))
                )}
              </Row>
            </BlankInternalLink>
            {!account ? (
              <ButtonBasic width='fit-content' onClick={toggleWalletModal}>
                <ButtonText>Connect wallet</ButtonText>
                {/* <ConnectPitch stageText="Wallet and Twitter" /> */}{" "}
                {/* I'm not sure if we need this! */}
              </ButtonBasic>
            ) : (
              <RowFixed>
                <ButtonCustom
                  onClick={() => setShowProfileModal(true)}
                  bgColor={activeProtocol?.secondaryColor}
                >
                  <TYPE.body
                    color={activeProtocol?.primaryColor}
                    fontWeight={500}
                  >
                    Details
                  </TYPE.body>
                </ButtonCustom>
              </RowFixed>
            )}
          </RowBetween>
        </Card>
      </MobileWrapper>
    </>
  );
}

const ProfileButton = styled.div`
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  background: ${({ theme }) => theme.bg2};
  text-decoration: none;
  padding: 9px;
  font-size: 14px;
  border-radius: 12px;
  height: 38px;
`;

// refactor for DRY code (component above uses all the stuff below this line)
export function ProfilePopUp() {
  const [show, setShow] = useState<boolean>(false);

  const toggle = React.useCallback(() => {
    setShow(!show);
  }, [show]);

  const profileContentRef = React.useRef(null);
  const profileButtonEl = React.useRef(null);
  useOnClickOutside(profileContentRef, (e: Event) => {
    if (e.target === profileButtonEl.current) {
      return;
    } else {
      setShow(false);
    }
  });

  const { account } = useActiveWeb3React();
  const [activeProtocol] = useActiveProtocol();

  // UI views
  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);

  // toggle modal for twitter verification
  const [showTwitterFlow, setShowTwitterFlow] = useState<boolean>(false);

  // get any verified handles for this user + timestamps they were created at
  const [twitterAccount] = useTwitterAccount(); // logged in account
  const verifiedHandleEntry = useVerifiedHandle(account);

  const loadingVerifiedHandles = verifiedHandleEntry === null;

  // on redirect from twitter, if signed in, not verified, and no loading, show modal
  const [loaded, setLoaded] = useState(false);
  const { username: usernameQuery } = useParsedQueryString();
  useEffect(() => {
    if (
      twitterAccount &&
      !verifiedHandleEntry &&
      !loadingVerifiedHandles &&
      !loaded &&
      usernameQuery
    ) {
      setShowTwitterFlow(true);
      setLoaded(true);
    }
  }, [
    loadingVerifiedHandles,
    twitterAccount,
    loaded,
    usernameQuery,
    verifiedHandleEntry,
    setShowTwitterFlow,
  ]);

  const ConnectPitch = ({ stageText }: { stageText: string }) => (
    <TYPE.blue fontSize='12px' paddingTop={"10px"}>
      Connect your{` ${stageText} `} to view your{" "}
      <StyledInternalLink
        to={"/campaigns/amplifi/amplifi-publisher-airdrop"}
        style={{
          textDecoration: "underline",
          color: "black",
        }}
      >
        airdrop
      </StyledInternalLink>{" "}
      💰
    </TYPE.blue>
  );

  const ProfileContent = () => (
    <>
      <Modal
        isOpen={showTwitterFlow}
        onDismiss={() => setShowTwitterFlow(false)}
      >
        <TwitterFlow onDismiss={() => setShowTwitterFlow(false)} />
      </Modal>
      <SectionWrapper ref={profileContentRef} style={{ width: "330px" }}>
        {!account ? (
          <>
            <TYPE.body
              fontWeight={500}
              fontSize='14px'
              color={activeProtocol?.primaryColor}
              mb='1rem'
            >
              <ConnectPitch stageText='Wallet and Twitter' />
            </TYPE.body>
            {activeProtocol && (
              <ButtonCustom
                color={activeProtocol?.primaryColor}
                bgColor={activeProtocol?.secondaryColor}
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                }}
                onClick={() => toggleWalletModal()}
              >
                Connect Wallet
              </ButtonCustom>
            )}
          </>
        ) : (
          <AutoColumn gap='16px'>
            {!verifiedHandleEntry && account ? (
              !twitterAccount ? (
                <WhiteCard>
                  <RowFlat>
                    <MysteryAmplifiCard width={"140px"} />
                    <div style={{ width: "5px" }} />
                    <TwitterLoginButton text='Add a public identity' />
                  </RowFlat>
                  <ConnectPitch stageText={"Twitter"} />
                </WhiteCard>
              ) : (
                <TwitterButton
                  onClick={() => {
                    ReactGA.event({
                      category: "Social",
                      action: "Start Link",
                      label: "Not linked",
                    });
                    setShowTwitterFlow(true);
                  }}
                >
                  <RowBetween>
                    <TYPE.white fontSize='14px'>
                      Add a public identity
                    </TYPE.white>
                    <TwitterLogo src={TwitterIcon} />
                  </RowBetween>
                </TwitterButton>
              )
            ) : null}
            {account && verifiedHandleEntry && (
              <WhiteCard>
                <RowFlat>
                  <MysteryAmplifiCard />
                  <AirdropGreyBox />
                  <AirdropGreyBox />
                </RowFlat>
              </WhiteCard>
            )}
            <WalletSummary />
            <TYPE.main mb='16px'>
              Your{" "}
              <span style={{ color: activeProtocol?.primaryColor }}>
                {" "}
                {activeProtocol?.name}
              </span>{" "}
              breakdown
            </TYPE.main>
            <VoteContent />
          </AutoColumn>
        )}
      </SectionWrapper>
    </>
  );

  return (
    <ProfileTooltip Component={ProfileContent} show={show} placement='bottom'>
      <ProfileButton onClick={toggle} ref={profileButtonEl}>
        Profile
      </ProfileButton>
    </ProfileTooltip>
  );
}
