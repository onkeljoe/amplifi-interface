import React, { Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import toast from "components/Toast";
import styled from "styled-components";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import OverviewColumn, {
  OVERVIEW_EXPANSION_WIDTH,
} from "../components/governance/OverviewColumn";
import ProposalDetails from "../components/governance/ProposalDetails";
import Polling from "../components/Header/Polling";
import SideMenu from "../components/Menu/SideMenu";
import Popups from "../components/Popups";
import Profile from "../components/Profile";
import DelegateModal from "../components/vote/DelegateModal";
import Web3ReactManager from "../components/Web3ReactManager";
import Web3Status from "../components/Web3Status";
import { ApplicationModal } from "../state/application/actions";
import { useModalOpen, useToggleModal } from "../state/application/hooks";
import { identityOnlyPath } from "../state/governance/reducer";
import TwitterAccountQueryParamReader from "../state/social/TwitterAccountQueryParamReader";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";
import Campaigns from "./Campaigns";
import DelegateInfo from "./DelegateInfo";
import Delegates from "./Delegates";
// import { RedirectWithUpdatedGovernance } from "./Governance/redirect";
import Identities from "./Identities";
import Proposals from "./Proposals";
import Payouts from "./Payouts";
import PayoutInfo from "./PayoutInfo";
import Landing from "./Landing";
import DiscordBot from "../components/discord/DiscordBot";

const FIRST_2_COLS_WIDTH = 320;

const SiteWrapper = styled.div<{
  expandedOverview?: boolean;
  isLanding?: boolean;
}>`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: ${FIRST_2_COLS_WIDTH - OVERVIEW_EXPANSION_WIDTH}px 1fr 200px;
  overflow: auto;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr;
  `};

  ${({ expandedOverview }) =>
    expandedOverview &&
    `
  grid-template-columns: ${FIRST_2_COLS_WIDTH}px 1fr 376px;
  `};

  ${({ isLanding }) =>
    isLanding &&
    `
  grid-template-columns: 1fr !important;
  `};
  @media (max-width: 1080px) {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    overflow-x: hidden;
    grid-gap: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;

  @media (max-width: 1080px) {
    padding-top: 1rem;
    padding-bottom: 120px;
  }

  ::-webkit-scrollbar {
    height: 5px;
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

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.DELEGATE);
  const toggle = useToggleModal(ApplicationModal.DELEGATE);
  return <DelegateModal isOpen={open} onDismiss={toggle} title='Delegate' />;
}

export default function App() {
  const identityOnlyFlow = identityOnlyPath(useLocation().pathname);
  const [expandedOverview, setExpandedOverview] = React.useState(true);
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  // console.log(isLanding); no console.log
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <Route component={TwitterAccountQueryParamReader} />
      {!identityOnlyFlow && (
        <SiteWrapper expandedOverview={expandedOverview} isLanding={isLanding}>
          <SideMenu />
          {!isLanding && (
            <OverviewColumn
              expanded={expandedOverview}
              onToggleExpand={() => setExpandedOverview(!expandedOverview)}
            />
          )}
          <ContentWrapper>
            <Web3Status />
            <Popups landing={isLanding} />
            <Polling />

            <TopLevelModals />
            <Web3ReactManager>
              <Switch>
                <Route
                  exact
                  strict
                  path='/campaigns/:protocolID'
                  component={Campaigns} //amplifi is a shell for CampaignList
                />
                <Route
                  exact
                  strict
                  path='/campaigns/:protocolID/:campaignID'
                  component={Campaigns}
                />
                <Route
                  exact
                  strict
                  path='/campaigns/:protocolID/:campaignID/:tabID'
                  component={Campaigns}
                />
                <Route
                  exact
                  strict
                  path='/payouts/:protocolID'
                  component={Payouts}
                />
                <Route
                  exact
                  strict
                  path='/payouts/:protocolID/:address'
                  component={PayoutInfo}
                />
                <Route
                  exact
                  strict
                  path='/delegates/:protocolID'
                  component={Delegates}
                />
                <Route
                  exact
                  strict
                  path='/proposals/:protocolID'
                  component={Proposals}
                />
                <Route
                  exact
                  strict
                  path='/proposals/:protocolID/:proposalID'
                  component={ProposalDetails}
                />
                <Route
                  exact
                  strict
                  path='/delegates/:protocolID/:delegateAddress'
                  component={DelegateInfo}
                />
                <Route
                  exact
                  strict
                  path='/delegates/:protocolID/:delegateAddress'
                  component={DelegateInfo}
                />
                {/* <Route path='/' component={RedirectWithUpdatedGovernance} /> */}
                <Route path='/' component={Landing} />
              </Switch>
            </Web3ReactManager>
          </ContentWrapper>
          {!isLanding && <Profile />}
        </SiteWrapper>
      )}
      {identityOnlyFlow && (
        <div>
          <SideMenu />
          <Web3Status />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path='/connect' component={Identities} />
              <Route
                exact
                strict
                path='/delegates/connect'
                render={() => <Redirect to='/connect' />}
              />
            </Switch>
          </Web3ReactManager>
        </div>
      )}
      <toast.Toaster />
      <DiscordBot />
    </Suspense>
  );
}
