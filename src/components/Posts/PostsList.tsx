import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PostCard from './PostCard';
import { Post } from "../../generated/graphql";

type Props = {
  post: Post;
};

// This is the query that Apollo Client will send to the WP site.
const POSTS_SEARCH_QUERY = gql`
query POSTS_SEARCH_QUERY($searchQuery: String!) {
  posts(where: {categoryName: $searchQuery},first:10) {
    edges {
      node {
        postId
        title
        date
        author {
          __typename
        }
        featuredImage {
          __typename
          node {
            link
            mediaDetails {
              file
              height
              width
            }
            mediaItemUrl
          }
        }
        featuredImageId
        link
      }
    }
  }
}
`;

const PostsList = ({searchQuery}:any) => (
  <Query query={POSTS_SEARCH_QUERY} variables={{ searchQuery }}>
    {({ loading, error, data }:any) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      if (!data.posts.edges.length) return <p>No matching posts found.</p>;
      
      return data.posts.edges.map((edge:any) => {
        const { node: post } = edge;
        const { postId } = post;
      
        return (
          <PostCard key={postId} post={post} />
        );
      });
    }}
  </Query>
);

export default PostsList;






