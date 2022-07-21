import React, { Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import Polling from "../components/Header/Polling";
import Popups from "../components/Popups";
import Web3ReactManager from "../components/Web3ReactManager";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";
import Profile from "../components/Profile";
import { RedirectWithUpdatedGovernance } from "./Governance/redirect";
import SideMenu from "../components/Menu/SideMenu";
import TwitterAccountQueryParamReader from "../state/social/TwitterAccountQueryParamReader";
import Web3Status from "../components/Web3Status";
import Delegates from "./Delegates";
import Proposals from "./Proposals";
import Identities from "./Identities";
import ProposalDetails from "../components/governance/ProposalDetails";
import DelegateInfo from "./DelegateInfo";
import DelegateModal from "../components/vote/DelegateModal";
import { useModalOpen, useToggleModal } from "../state/application/hooks";
import { ApplicationModal } from "../state/application/actions";
import OverviewColumn, {
  OVERVIEW_EXPANSION_WIDTH,
} from "../components/governance/OverviewColumn";
import { useLocation } from "react-router-dom";
import { identityOnlyPath } from "../state/governance/reducer";
import Amplifi from "./Amplifi";
import CampaignDetails from "components/campaigns/CampaignDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchList } from "data/list";

const FIRST_2_COLS_WIDTH = 320;

const SiteWrapper = styled.div<{ expandedOverview?: boolean }>`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: ${FIRST_2_COLS_WIDTH - OVERVIEW_EXPANSION_WIDTH}px 1fr 376px;
  overflow: auto;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr 376px;
  `};

  ${({ expandedOverview }) =>
    expandedOverview &&
    `
  grid-template-columns: ${FIRST_2_COLS_WIDTH}px 1fr 376px;
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
`;

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.DELEGATE);
  const toggle = useToggleModal(ApplicationModal.DELEGATE);
  return <DelegateModal isOpen={open} onDismiss={toggle} title="Delegate" />;
}

export default function App() {
  const identityOnlyFlow = identityOnlyPath(useLocation().pathname);
  const [expandedOverview, setExpandedOverview] = React.useState(true);

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <Route component={TwitterAccountQueryParamReader} />
      {!identityOnlyFlow && (
        <SiteWrapper expandedOverview={expandedOverview}>
          <SideMenu />
          <OverviewColumn
            expanded={expandedOverview}
            onToggleExpand={() => setExpandedOverview(!expandedOverview)}
          />
          <ContentWrapper>
            <Web3Status />
            <Popups />
            <Polling />
            <TopLevelModals />
            <Web3ReactManager>
              <Switch>
                <Route
                  exact
                  strict
                  path="/campaigns/:protocolID"
                  component={Amplifi} //amplifi is a shell for CampaignList
                />
                <Route
                  exact
                  strict
                  path="/campaigns/:protocolID/:campaignID"
                  component={Amplifi}
                />
                <Route
                  exact
                  strict
                  path="/campaigns/:protocolID/:campaignID/:tabID"
                  component={Amplifi}
                />
                <Route
                  exact
                  strict
                  path="/delegates/:protocolID"
                  component={Delegates}
                />
                <Route
                  exact
                  strict
                  path="/proposals/:protocolID"
                  component={Proposals}
                />
                <Route
                  exact
                  strict
                  path="/proposals/:protocolID/:proposalID"
                  component={ProposalDetails}
                />
                <Route
                  exact
                  strict
                  path="/delegates/:protocolID/:delegateAddress"
                  component={DelegateInfo}
                />
                <Route
                  exact
                  strict
                  path="/delegates/:protocolID/:delegateAddress"
                  component={DelegateInfo}
                />
                <Route path="/" component={RedirectWithUpdatedGovernance} />
              </Switch>
            </Web3ReactManager>
          </ContentWrapper>
          <Profile />
        </SiteWrapper>
      )}
      {identityOnlyFlow && (
        <div>
          <SideMenu />
          <Web3Status />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/connect" component={Identities} />
              <Route
                exact
                strict
                path="/delegates/connect"
                render={() => <Redirect to="/connect" />}
              />
            </Switch>
          </Web3ReactManager>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={50000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
}
