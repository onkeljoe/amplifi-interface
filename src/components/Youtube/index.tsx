import React from "react";
function Youtube(props: { src: string }) {
  return (
    <iframe
      width="560"
      height="315"
      src={props.src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default Youtube;

export { Youtube };
