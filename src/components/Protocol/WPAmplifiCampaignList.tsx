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
  const [path, setPath] = useState(location && location.pathname || '/');
  console.log(path)
  const {nav, posts} = useWPNav()
  const {data: uriRes, queryUriToContent} = useWPUri(path);
  const { account } = useActiveWeb3React()
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo>();
  const generateNavMenu = (nav : Array<MenuTreeItem> | undefined) => {
    if (!nav) return;
    const items = []
    for (let i = 0; i < nav.length; i++) {
      // queryUriToContent(nav[i].uri).then((res: any) => {
      //   if (!res.data) return;
      //   setCampaignInfo({
      //     ...campaignInfo,
      //     [res.data.nodeByUri.uri]: {
      //       ...res.data.nodeByUri
      //     }
      //   })
      // })
      items.push(
        <TempNavButton label={nav[i].label} path={nav[i].uri} setPath={setPath}>
          {generateNavMenu(nav[i].children)}
        </TempNavButton>
      )
    }
    return items
  } 
  useEffect(() => {
    console.log(campaignInfo)
  }, [campaignInfo])
  if (!nav) {
    return <Loader />
  }
  return (
    <Wrapper>
      {nav && generateNavMenu(nav.filter(v =>  {
        return v.uri.toLowerCase() == `/protocol/${activeProtocol?.id}/`.toLowerCase()
      }))}
      {/* {nav && generateNavMenu(nav)} */}
      <div>path: {path}</div>
      {
        uriRes && uriRes.loading && <div>loading content</div>
      }
      {
        activeProtocol && posts && posts.filter((p) => {
          const protocol = posts.filter(q => q.label.toLowerCase() == activeProtocol.id.toLowerCase())[0]
          console.log(protocol)
          console.log(p)
          if (!protocol) return;
          return p.__typename == "AmpliFiCampaign" && p.parentId == protocol.id
        }).map((v) => {
          console.log(v)
          return (
            <>
              <ProposalItem onClick= {() => {
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
      <div>Tabs</div>
      {
        activeProtocol && posts && posts.filter(p => {
          const selectedCampaign = posts.filter(q => q.uri == path)[0] 
          if (!selectedCampaign) return;
          return p.__typename == "Page" && p.parentId == selectedCampaign.id
        }).map(p => (<>
          <TempNavButton label={p.label} path={p.uri} setPath={setPath}/>
        </>))
      }
      {
        uriRes && !uriRes.loading && uriRes.data && uriRes.data.nodeByUri && uriRes.data.nodeByUri.content ? (<>
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
