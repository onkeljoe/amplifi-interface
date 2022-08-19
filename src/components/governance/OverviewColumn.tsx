import React from "react";
import { ButtonCustom } from "../Button";
import { ChevronLeft } from "react-feather";
import styled from "styled-components";
import { useActiveProtocol } from "../../state/governance/hooks";
import { AutoColumn } from "../Column";
import { TYPE } from "../../theme";
import { TabOption } from "../governance/Tabs";
import { Link, useLocation } from "react-router-dom";

export const OVERVIEW_EXPANSION_WIDTH = 99;

const Wrapper = styled.div<{ backgroundColor?: string; expanded?: boolean }>`
  margin-left: 70px;
  padding: 2rem;
  border-right: 1px solid ${({ backgroundColor }) => backgroundColor};
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

const IconButton = styled(ButtonCustom)`
  padding: 0;
  background: none;
  cursor: pointer;
  color: black;
  width: auto;
`;

export default function OverviewColumn({
  expanded,
  onToggleExpand,
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
      <ButtonContainer expanded={expanded}>
        <IconButton bgColor="white" onClick={onToggleExpand}>
          <ChevronLeft />
        </IconButton>
      </ButtonContainer>
      <AutoColumn
        gap="md"
        style={{
          opacity: expanded ? 1 : 0,
        }}
      >
        <TYPE.main
          fontSize="24px"
          fontWeight="700"
          color={activeProtocol?.primaryColor}
          style={{ marginBottom: "1rem" }}
        >
          {activeProtocol?.name}
        </TYPE.main>
        <TabOption
          as={Link}
          to={"/campaigns/" + activeProtocol?.id}
          selected={location.pathname.includes("/campaigns/")}
          color={activeProtocol?.primaryColor}
          color2={activeProtocol?.secondaryColor}
        >
          Amplifi Campaigns
        </TabOption>
        {/* <TabOption
          as={Link}
          to={"/delegates/" + activeProtocol?.id}
          selected={location.pathname.includes("/delegates/")}
          color={activeProtocol?.primaryColor}
          color2={activeProtocol?.secondaryColor}
        >
          Delegates
        </TabOption> */}
        {/* <TabOption
          as={Link}
          to={"/proposals/" + activeProtocol?.id}
          selected={location.pathname.includes("/proposals/")}
          color={activeProtocol?.primaryColor}
          color2={activeProtocol?.secondaryColor}
        >
          View Proposals
        </TabOption> */}
      </AutoColumn>
    </Wrapper>
  );
}
