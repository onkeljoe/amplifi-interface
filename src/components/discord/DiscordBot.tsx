import React, { useEffect } from "react";
import WidgetBot from "@widgetbot/react-embed";
import { ButtonBasic } from "components/Button";
import { useWindowSize } from "hooks/useWindowSize";

export default function DiscordBot() {
  const { height } = useWindowSize();
  useEffect(() => {
    async function loadCrate() {
      const botLocationHeight = height ? height - 100 : "bottom";
      const result = await import("@widgetbot/crate");
      const Crate = await result.cdn();
      new Crate({
        server: "1012065955309957222",
        channel: "1012074933326712974",
        location: [botLocationHeight, "right"],
        defer: true,
      });
    }
    loadCrate();
  }, [height]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  return (
    <>
      <WidgetBot server='1012065955309957222' channel='1012074933326712974' />
      <ButtonBasic onClick={handleClick}>Verify discord</ButtonBasic>
    </>
  );
}
