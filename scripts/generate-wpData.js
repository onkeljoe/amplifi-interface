//can't import from apollo folder for some reason - HELP
const NAVIGATION_QUERY = `
query Menus($slug: String!) {
  menus(where: { slug: $slug }, first: 5) {
    __typename
    nodes {
      slug
      id
      databaseId
      name
      menuItems(first: 100000) {
        __typename
        nodes {
          title
          label
          id
          parentId
          uri
        }
      }
    }
  }
}
`
const URI_QUERY = `

query getNodeByUri($uri: String!) {
  nodeByUri(uri: $uri) {
    __typename
    ... on Page {
      title
      content
      id
      uri
    }
    ... on Protocol {
      title
      content
      id
      uri
    }
    ... on AmpliFiCampaign {
      id
      uri
      title
      content
      date
      amplifiCampaignFields {
        tweetintent
        baseUrl
        campaignBudget
        description
        featuredImage {
          uri
          title
          status
          slug
          sourceUrl
        }
        goal
        kpi
        overviewVideo
        selfHostedVideo {
          description
          uri
          title
          slug
          sourceUrl
        }
        startDate
        fieldGroupName
        isDemo
        kpiMetric
        secondaryBudgetAmount
        secondarybudgetticker
        snapshotId
        snapshotProposal
      }
    }
  }
}

`
const fetch = require('cross-fetch');
const fs = require('fs');
const menuName = 'Amplifi'
// type NavResponse = any
// type UriResponse = any
// export type WpData = {
//     nav: NavResponse,
//     uris: {
//         [uri: string]: UriResponse
//     }
// }

console.log('Prefetching wp data...')

const wp = {
  nav: undefined,
  uris: {}
}

async function query (query, variables) {
  return fetch(`https://cre8r.vip/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: variables,
      query: query,
    }),
  }).then(result => result.json())
}

query(NAVIGATION_QUERY, {slug: menuName})
  .then(result => {
    wp.nav = result
    const head = wp.nav.data.menus.nodes[0]
    console.log(`Found menu ${head.name}, ${head.id}. Fetching menu items...`)
    const menuItems = head.menuItems.nodes
    const menuItemsPromises = menuItems.map(({uri}) => {
      return query(URI_QUERY, { uri: uri })
    })

    Promise.allSettled(menuItemsPromises).then(uriResults => {
        console.log(uriResults)
      for (let i = 0; i < uriResults.length; i++) {
        wp.uris[menuItems[i].uri] = uriResults[i].value // promise.allSettled returns an object {value, fullfilled}
      }
      console.log(wp)
      fs.writeFile('./src/wp-data.json', JSON.stringify(wp), err => {
        if (err) {
          console.error('Error writing wp data', err);
        } else {
          console.log('Wp data successfully prefetched.');
        }
      });
    })

    
  });