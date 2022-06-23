import Copy from 'components/AccountDetails/Copy'
import { AutoColumn } from 'components/Column'
import Youtube from 'components/Youtube'
import React, { useState } from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import parse from 'html-react-parser'
import { useActiveProtocol, useUtm } from '../../state/governance/hooks'
import FeaturedImage from 'components/FeaturedImage/FeaturedImage'
import PostsSearch from 'components/Posts/PostsSearch';
import { ApolloProvider } from "react-apollo";
import { MenuTreeItem, useWPNav, useWPUri } from 'hooks/useWP'
import { useActiveWeb3React } from 'hooks'
import Card from 'components/Card'
import { useLocation } from 'react-router-dom'

// const Scammyclient = new ApolloClient({
//   // Change this to the URL of your WordPress site.
//   uri: "https://cre8r.vip/graphql"
// });

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
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

export default function WPAmplifiCampaignList() {
  const [activeProtocol] = useActiveProtocol()
  const location = useLocation();
  const utmLinks = useUtm()
  const [path, setPath] = useState(location && location.pathname || '/');
  const nav = useWPNav()
  const uriRes = useWPUri(path);
  const { account } = useActiveWeb3React()
  console.log(location)

  const generateNavMenu = (nav : Array<MenuTreeItem> | undefined) => {
    if (!nav) return;
    console.log(nav)
    const items = []
    for (let i = 0; i < nav.length; i++) {
      items.push(
        <TempNavButton label={nav[i].label} path={nav[i].uri} setPath={setPath}>
          {generateNavMenu(nav[i].children)}
        </TempNavButton>
      )
    }
    return items
    throw 'Menu not found'
  } 

  return (
    <Wrapper>
      {nav && generateNavMenu(nav)}

      <div>path: {path}</div>
      {
        uriRes && uriRes.loading && <div>loading content</div>
      }

      {
        uriRes && !uriRes.loading && uriRes.data && uriRes.data.nodeByUri && uriRes.data.nodeByUri.content ? (<div dangerouslySetInnerHTML={{__html: uriRes.data.nodeByUri.content}} />) : <>
          {uriRes && !uriRes.loading && <div>Content is not found</div>}
        </>
      }
    </Wrapper>
  )
}
