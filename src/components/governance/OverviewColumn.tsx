import React from "react";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import { AutoColumn } from "../Column";
import { TYPE } from "../../theme";
import { SingleTab } from "../governance/Tabs";
import { useLocation } from "react-router-dom";
import config from "config";

export const OVERVIEW_EXPANSION_WIDTH = 99;

const Wrapper = styled.div<{ backgroundColor?: string; expanded?: boolean }>`
  margin-left: 70px;
  padding: 2rem;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  transform: translateX(-${OVERVIEW_EXPANSION_WIDTH}px);
  transition: transform 0.2s;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};

  ${({ expanded }) =>
    expanded &&
    `
    transform: translateX(0px);
  `};
`;

const ButtonContainer = styled.div<{ expanded?: boolean }>`
  display: flex;
  justify-content: flex-end;
  transform: translateX(25px);

  ${({ expanded }) =>
    expanded &&
    `
    transform: translateX(10px);
  `};
`;

export default function OverviewColumn({
  expanded,
}: {
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [activeProtocol] = useActiveProtocol();
  const location = useLocation();

  return (
    <Wrapper
      backgroundColor={activeProtocol?.secondaryColor}
      expanded={expanded}
    >
      <ButtonContainer expanded={true}>
        {/* <IconButton bgColor="white" onClick={onToggleExpand}>
          <ChevronLeft />
        </IconButton> */}
      </ButtonContainer>
      <AutoColumn
        gap='md'
        style={{
          opacity: expanded ? 1 : 0,
        }}
      >
        <TYPE.main
          fontSize='24px'
          fontWeight='700'
          color={activeProtocol?.primaryColor}
          style={{ marginBottom: "1rem" }}
        >
          {activeProtocol?.name}
        </TYPE.main>
        {config.protocol.tabs.map(({ title, routePrefix }) => {
          return (
            <SingleTab
              key={title}
              title={title}
              routePrefix={routePrefix}
              activeProtocol={activeProtocol}
              location={location}
            />
          );
        })}
      </AutoColumn>
    </Wrapper>
  );
}
