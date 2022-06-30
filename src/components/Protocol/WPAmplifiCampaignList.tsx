import React from "react";
import Loader from "components/Loader";
import { RowBetween, RowFixed } from "components/Row";
import { useActiveWeb3React } from "hooks";
import { useWPNav, useWPUri } from "hooks/useWP";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { OnlyAboveSmall, TYPE } from "theme";
import { useActiveProtocol, useUtm } from "../../state/governance/hooks";

import Tabs from "components/Tabs";
import { DebugMenu, TempNavButton } from "./DebugDisplays";
// const Scammyclient = new ApolloClient({
//   // Change this to the URL of your WordPress site.
//   uri: "https://cre8r.vip/graphql"
// });

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`;

const ProposalItem = styled.div`
  border-radius: 12px;
  padding: 1rem 0;
  margin: 1rem;
  text-decoration: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const ResponsiveText = styled(TYPE.black)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;
const debug = false;

interface CampaignInfo {
  [uri: string]: any;
}

export default function WPAmplifiCampaignList() {
  const [activeProtocol] = useActiveProtocol();
  const location = useLocation();
  const utmLinks = useUtm();
  const [campaignPath, setCampaignPath] = useState(
    (location && location.pathname) || "/"
  );
  const [path, setPath] = useState<string>(
    (location && location.pathname) || "/"
  );
  const [protocolPath] = useState((location && location.pathname) || "/");
  const { nav, posts } = useWPNav();
  const { data: uriRes, queryUriToContent } = useWPUri(path);
  const { account } = useActiveWeb3React();
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo>();

  if (!nav) {
    return <Loader />;
  }
  return (
    <Wrapper>
      {/* correct implement menu */}
      <DebugMenu
        nav={nav.filter((v) => {
          return (
            v.uri.toLowerCase() ==
            `/protocol/${activeProtocol?.id}/`.toLowerCase()
          );
        })}
        debug={debug}
        onPathChange={(path) => {
          setPath(path);
        }}
      />

      {/* {nav && generateNavMenu(nav)} */}
      {debug && <div>path: {path}</div>}
      {uriRes && uriRes.loading && <div>loading content</div>}
      {activeProtocol &&
        posts &&
        posts
          .filter((p) => {
            const protocol = posts.filter(
              (q) => q.label.toLowerCase() == activeProtocol.id.toLowerCase()
            )[0];
            if (!protocol) return;
            return (
              p.__typename == "AmpliFiCampaign" && p.parentId == protocol.id
            );
          })
          .map((v) => {
            return (
              <>
                <ProposalItem
                  onClick={() => {
                    setCampaignPath(v.uri);
                    setPath(v.uri);
                    window.location.href = "#" + v.uri;
                  }}
                >
                  <RowBetween>
                    <RowFixed>
                      <OnlyAboveSmall>
                        <TYPE.darkGray mr="8px">{v.id + "."}</TYPE.darkGray>
                      </OnlyAboveSmall>
                      <ResponsiveText mr="10px">{v.title}</ResponsiveText>
                    </RowFixed>
                    <Loader />
                  </RowBetween>
                </ProposalItem>
                <Break />
              </>
            );
          })}
      {/* Nice Tabs */}
      {activeProtocol && posts && (
        <Tabs
          setPath={setPath}
          data={[
            { tab: "overiew", content: "", uri: campaignPath },
            ...posts
              .filter((p) => {
                const selectedCampaign = posts.filter(
                  (q) => q.uri == campaignPath
                )[0];
                if (!selectedCampaign) return false;
                return (
                  p.__typename == "Page" && p.parentId == selectedCampaign.id
                );
              })
              .map((p) => {
                return {
                  tab: p.label || "no label",
                  content: "",
                  uri: p.uri,
                };
              }),
          ]}
          value={path}
          onChange={(value) => {
            // console.log(value)
            // setTab(value)
          }}
        />
      )}
      {/* correct logic tabs */}
      {debug &&
        activeProtocol &&
        posts &&
        posts
          .filter((p) => {
            const selectedCampaign = posts.filter((q) => q.uri == path)[0];
            if (!selectedCampaign) return;
            return p.__typename == "Page" && p.parentId == selectedCampaign.id;
          })
          .map((p) => (
            <>
              <TempNavButton
                key={p.label}
                label={p.label}
                path={p.uri}
                setPath={setPath}
              />
            </>
          ))}
      {/* Content */}
      {path &&
      uriRes &&
      !uriRes.loading &&
      uriRes.data &&
      uriRes.data.nodeByUri &&
      uriRes.data.nodeByUri.content ? (
        <>
          <h1>{uriRes.data.nodeByUri.title}</h1>
          <Break />
          <div
            dangerouslySetInnerHTML={{ __html: uriRes.data.nodeByUri.content }}
          />
        </>
      ) : (
        <>{uriRes && !uriRes.loading && <div>Content is not found</div>}</>
      )}
    </Wrapper>
  );
}
