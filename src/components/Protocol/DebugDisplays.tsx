import { MenuTreeItem } from "hooks/useWP";
import React from "react";

export function TempNavButton({ label, path, setPath, children }: any) {
  if (path == null) {
    throw "path can not be null";
  }
  return (
    <>
      <div>
        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            window.location.href = "#" + path;
            setPath(path);
          }}
        >
          {label}
        </button>
      </div>
      <div style={{ marginLeft: 10 }}>{children}</div>
    </>
  );
}

const generateNavMenu = (
  nav: Array<MenuTreeItem> | undefined,
  onPathChange: (path: string) => void
) => {
  if (!nav) return;
  const items = [];
  for (let i = 0; i < nav.length; i++) {
    items.push(
      <TempNavButton
        label={nav[i].label}
        path={nav[i].uri}
        setPath={onPathChange}
      >
        {generateNavMenu(nav[i].children, onPathChange)}
      </TempNavButton>
    );
  }
  return items;
};

interface DebugMenuProps {
  nav: Array<MenuTreeItem>;
  onPathChange: (path: string) => void;
  debug: boolean;
}

export const DebugMenu = ({ nav, onPathChange, debug }: DebugMenuProps) => {
  if (!debug) {
    return <></>;
  }
  return <>{generateNavMenu(nav, onPathChange)}</>;
};
