import React, { useEffect } from "react";
import WidgetBot from "@widgetbot/react-embed";
import { ButtonBasic } from "components/Button";

export default function DiscordBot() {
  useEffect(() => {
    async function loadCrate() {
      const result = await import("@widgetbot/crate");
      const Crate = await result.cdn();
      const crate = new Crate({
        server: "1012065955309957222",
        channel: "1012074933326712974",
        defer: true,
      });
    }
    loadCrate();
  }, []);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  return (
    <>
      <WidgetBot server="1012065955309957222" channel="1012074933326712974" />
      <ButtonBasic onClick={handleClick}>Verify discord</ButtonBasic>
    </>
  );
}
