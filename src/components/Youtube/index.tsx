import React from "react";
function Youtube(props: { src: string }) {
  return (
    <div style={{position:"relative", width:"100%", height:"0px", paddingBottom:"56.25%"}}>
    <iframe
      width="100%"
      height="315"
      src={props.src}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height:'100%'
      }}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
</div>
  );
}

export default Youtube;

export { Youtube };
