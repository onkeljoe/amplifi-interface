import React from "react";
import { Post } from "../../generated/graphql";

type Props = {
  post: Post;
};

// Helper function for formatting dates.
const formatDate = (date: any) => new Date(date).toDateString();

const PostCard = ({ post }: any) => {
  const { postId, title, date, author, featuredImage, link } = post;
  const { name: authorName } = author;
  console.log(featuredImage);
  return (
    <div key={postId} className="post-card">
      {featuredImage && ( // If a featured image exists, display it.
        <img
          style={{ maxWidth: "600px" }}
          src={featuredImage.node.mediaItemUrl}
          alt={featuredImage.altText}
          className="post-card__image"
        />
      )}
      <a className="post" href={link}>
        {" "}
        <h3 className="post-card__heading">{title}</h3>
      </a>
      <span className="post-card__detail">
        <span className="post-card__label">Date:</span> {formatDate(date)}
      </span>
      <span className="post-card__detail">
        <span className="post-card__label">Author:</span> {authorName}
      </span>
    </div>
  );
};

export default PostCard;
