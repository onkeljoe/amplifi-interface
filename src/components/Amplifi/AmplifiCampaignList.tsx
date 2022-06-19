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
import { useWPNav, useWPUri } from 'hooks/useWP'

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
        setPath(path)
      }}>{label}</button>
    </div>
    <div style={{marginLeft: 10}}>
      {children}
    </div>
  </>
}

export default function AmplifiCampaignList() {
  const [activeProtocol] = useActiveProtocol()
  const utmLinks = useUtm()
  const [path, setPath] = useState('/');
  const nav = useWPNav()
  const uriRes = useWPUri(path);
  return (
    <Wrapper>
      {nav && <>
        <div>{nav.slug}</div>
        {nav.menuItems.edges.map(({node, __typename} : any) => {
          if (__typename == 'MenuToMenuItemConnectionEdge') {
            __typename == node.childItems.edges.__typename
            const childNavItems = []
            console.log(node.childItems.__typename)
            if (node.childItems.__typename == "MenuItemToMenuItemConnection") {
              for (let i = 0; i < node.childItems.edges.length; i++) {
                const {label: label1, path: path1} = node.childItems.edges[i].node
                childNavItems.push(<TempNavButton label={label1} path={path1} setPath={setPath}/>)
              }
            }
            return <TempNavButton label={node.label} path={node.path} setPath={setPath}>
              {childNavItems}
            </TempNavButton>
          }
          throw `'unsupported typename found' ${__typename}`
        })}
      </>}
      <div>path: {path}</div>

      {
        uriRes ? <>
          {!uriRes.errors && uriRes.data.nodeByUri.content ? (<div dangerouslySetInnerHTML={{__html: uriRes.data.nodeByUri.content}} />) : <div>Error loading content</div>}
        </> : <>
          <div>loading content</div>
        </>
      }
      <Break style={{marginBottom: 100}}/>
      <AutoColumn gap="0">
        <TYPE.body fontSize="16px" fontWeight="600" mb="1rem">
          Campaigns are still in testing phase and are subject to change. Please check back soon.
        </TYPE.body>
        <Break />
       
        {activeProtocol && activeProtocol.featuredImage && (
          <>
            <FeaturedImage image={activeProtocol.featuredImage} />
          </>
        )}
        {activeProtocol && activeProtocol.description && activeProtocol.campaignBudget && (
          <>
            <TYPE.body fontSize="14px" fontWeight="600" mb="1rem" mt="1rem">
              <span style={{ fontWeight: 'bolder' }}> Campaign Budget: </span>{' '}
              <span>{activeProtocol.campaignBudget}</span> {activeProtocol.token.symbol}   {/* add token logo(s)  */}
            
              {/* <WrappedListLogo src={activeProtocol.logo} style={{width: 100, height: 100}}/> */}
            </TYPE.body>
            <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
              {console.log(activeProtocol)}
              {parse(activeProtocol.description)}
            </TYPE.body>
          </>
        )}
      
        {/* {activeProtocol && <TYPE.body fontSize="16px" fontWeight="600" mb="1rem">
                    {activeProtocol.token}
                </TYPE.body>} */}
        {/* <CampaignItem onClick={campaignHandler}>
                    <RowBetween>
                        <RowFixed>
                            <ResponsiveText mr="10px" ml='10px'>Click here to get referal link (look in console)</ResponsiveText>
                        </RowFixed>
                    </RowBetween>
                </CampaignItem>
                <CampaignItem>
                    <RowBetween>
                        <RowFixed>
                            <ResponsiveText mr="10px" ml='10px'>{url}</ResponsiveText>
                        </RowFixed>
                    </RowBetween>
                </CampaignItem> */}
        {utmLinks && activeProtocol ? (
          <>
          
            <Copy toCopy={'https://' + utmLinks[activeProtocol?.id]}>
              <span style={{ fontSize: '25px', marginLeft: '4px', marginBottom: '30px' }}>
                {' '}
                Copy your unique link &amp; start earning{utmLinks[activeProtocol?.id]}
              </span>
            </Copy>
          </>
        ) : (
          <p>Please connect to Twitter in order to generate your unique referral link.</p>
        )}
        {activeProtocol && activeProtocol.video && <Youtube video={activeProtocol?.video} />}

      </AutoColumn>
    </Wrapper>
  )
}
