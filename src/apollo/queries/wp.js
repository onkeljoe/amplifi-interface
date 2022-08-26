import { gql } from "@apollo/client";
export const NAVIGATION_QUERY = gql`
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
`;

export const URI_QUERY = gql`
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
`;
