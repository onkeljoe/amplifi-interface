import Copy from 'components/AccountDetails/Copy'
import { AutoColumn } from 'components/Column'
import Youtube from 'components/Youtube'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { OnlyAboveSmall, TYPE,  OnlyBelowSmall } from 'theme'
import parse from 'html-react-parser'
import { useActiveProtocol, useUtm } from '../../state/governance/hooks'
import FeaturedImage from 'components/FeaturedImage/FeaturedImage'
import PostsSearch from 'components/Posts/PostsSearch';
import { ApolloProvider } from "react-apollo";
import { MenuTreeItem, useWPNav, useWPUri } from 'hooks/useWP'
import { useActiveWeb3React } from 'hooks'
import Card from 'components/Card'
import { Link, useLocation } from 'react-router-dom'
import Loader from 'components/Loader'
import { RowBetween, RowFixed } from 'components/Row'

import Tabs from 'components/Tabs'
// const Scammyclient = new ApolloClient({
//   // Change this to the URL of your WordPress site.
//   uri: "https://cre8r.vip/graphql"
// });

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`

const ProposalItem = styled.div`
  border-radius: 12px;
  padding: 1rem 0;
  margin: 1rem;
  text-decoration: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const ResponsiveText = styled(TYPE.black)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`
const debug = false

function TempNavButton ({label, path, setPath, children} : any) {
  if (path == null) {
    throw 'path can not be null'
  }
  return <>
    <div>
      <button style={{marginLeft: 10}} onClick={() => {
        window.location.href = "#" + path
        setPath(path)
      }}>{label}</button>
    </div>
    <div style={{marginLeft: 10}}>
      {children}
    </div>
  </>
}
const RoundedLink = styled.div`
  background: ${({ theme }) => theme.bg3};
  border-radius: 10px;
  padding: 10px 30px 10px 30px;
`
interface CampaignInfo {
  [uri: string]: any
}

export default function WPAmplifiCampaignList() {
  const [activeProtocol] = useActiveProtocol()
  const location = useLocation();
  const utmLinks = useUtm()
  const [campaignPath, setCampaignPath] = useState(location && location.pathname || '/');
  const [path, setPath] = useState<string>(location && location.pathname || '/');
  const [protocolPath] = useState(location && location.pathname || '/')
  const {nav, posts} = useWPNav()
  const {data: uriRes, queryUriToContent} = useWPUri(path);
  const { account } = useActiveWeb3React()
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo>();
  const generateNavMenu = (nav : Array<MenuTreeItem> | undefined) => {
    if (!nav) return;
    const items = []
    for (let i = 0; i < nav.length; i++) {
      items.push(
        <TempNavButton label={nav[i].label} path={nav[i].uri} setPath={setPath}>
          {generateNavMenu(nav[i].children)}
        </TempNavButton>
      )
    }
    return items
  } 

  if (!nav) {
    return <Loader />
  }
  return (
    <Wrapper>
      {/* correct implement menu */}
      {debug && nav && generateNavMenu(nav.filter(v =>  {
        return v.uri.toLowerCase() == `/protocol/${activeProtocol?.id}/`.toLowerCase()
      }))}
      {/* {nav && generateNavMenu(nav)} */}
      {debug && <div>path: {path}</div>}
      {
        uriRes && uriRes.loading && <div>loading content</div>
      }
      {
        activeProtocol && posts && posts.filter((p) => {
          const protocol = posts.filter(q => q.label.toLowerCase() == activeProtocol.id.toLowerCase())[0]
          if (!protocol) return;
          return p.__typename == "AmpliFiCampaign" && p.parentId == protocol.id
        }).map((v) => {
          return (
            <>
              <ProposalItem onClick= {() => {
                setCampaignPath(v.uri)
                setPath(v.uri)
                window.location.href = "#" + v.uri
              }}>
                <RowBetween>
                  <RowFixed>
                    <OnlyAboveSmall>
                      <TYPE.darkGray mr="8px">{v.id + '.'}</TYPE.darkGray>
                    </OnlyAboveSmall>
                    <ResponsiveText mr="10px">{v.title}</ResponsiveText>
                  </RowFixed>
                  <Loader />
                </RowBetween>
              </ProposalItem>
              <Break />
            </>
          )
        })
      }
      {/* Nice Tabs */}
      {activeProtocol && posts && (
        <Tabs setPath={setPath} data={[ {tab: "overiew", content: "", uri:campaignPath},...posts.filter(p => {
          const selectedCampaign = posts.filter(q => q.uri == campaignPath)[0] 
          if (!selectedCampaign) return false;
          return p.__typename == "Page" && p.parentId == selectedCampaign.id
        }).map(p => {
          return {
            tab: p.label || "no label",
            content: "",
            uri: p.uri
          }
        })]} value={path} onChange={(value) => {
          // console.log(value)
          // setTab(value)
        }}/>
      )}
      {/* correct logic tabs */}
      {
        debug && activeProtocol && posts && posts.filter(p => {
          const selectedCampaign = posts.filter(q => q.uri == path)[0] 
          if (!selectedCampaign) return;
          return p.__typename == "Page" && p.parentId == selectedCampaign.id
        }).map(p => (<>
          <TempNavButton label={p.label} path={p.uri} setPath={setPath}/>
        </>))
      }
      {/* Content */}
      {
        path && uriRes && !uriRes.loading && uriRes.data && uriRes.data.nodeByUri && uriRes.data.nodeByUri.content ? (<>
          <h1>{uriRes.data.nodeByUri.title}</h1>
          <Break />
          <div dangerouslySetInnerHTML={{__html: uriRes.data.nodeByUri.content}} />
        </>) : <>
          {uriRes && !uriRes.loading && <div>Content is not found</div>}
        </>
      }
    </Wrapper>
  )
}
