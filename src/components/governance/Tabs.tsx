import React from "react";
import styled from "styled-components";
import {
  useActiveProtocol,
  useFilterActive,
} from "../../state/governance/hooks";
import { AutoRow, RowBetween, RowFixed } from "../Row";
import Card from "../Card";
import { TYPE } from "../../theme";
import { Link, useLocation } from "react-router-dom";
import Toggle from "../Toggle";
import config from "config";
export const TabOption = styled.button<{
  selected?: boolean;
  color?: string;
  color2?: string;
}>`
  padding: 6px 12px;
  border-radius: 12px;
  outline: none;
  border: none;
  color: ${({ color, theme }) => color ?? theme.text1};
  background-color: ${({ selected, theme, color2 }) =>
    selected ? color2 ?? theme.bg3 : "transparent"};
  text-decoration: none;
  font-weight: 500;

  :hover {
    cursor: pointer;
    background-color: ${({ theme, color2 }) => color2 ?? theme.bg3};
  }

  :focus {
    box-shadow: 0 0 0 1pt ${({ theme, color }) => color ?? theme.bg4};
  }
`;

const AboveSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const TabsCardStyled = styled.div`
  padding: 1rem 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 0;
  `};
`;

export function SingleTab({
  title,
  routePrefix,
  activeProtocol,
  location,
}: any) {
  return (
    <TabOption
      as={Link}
      to={routePrefix + activeProtocol?.id}
      // Note: This assumes that the title will be the same as the pathname so if the title has spaces this may not work
      selected={location.pathname.includes(routePrefix)}
      color={activeProtocol?.primaryColor}
      color2={activeProtocol?.secondaryColor}
    >
      <TYPE.main color={activeProtocol?.primaryColor} fontSize={"16px"}>
        {title}
      </TYPE.main>
    </TabOption>
  );
}

function Tabs() {
  const [activeProtocol] = useActiveProtocol();
  const [filter, setFilter] = useFilterActive();
  const location = useLocation();
  return (
    <Card padding={"0px"}>
      <TabsCardStyled style={{ marginBottom: "10px" }}>
        <RowBetween>
          <AutoRow gap='8px' width='fit-content'>
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
            {/* <TabOption
              as={Link}
              to={"/delegates/" + activeProtocol?.id}
              selected={location.pathname.includes("delegates")}
              color={activeProtocol?.primaryColor}
              color2={activeProtocol?.secondaryColor}
            >
              <TYPE.black
                fontSize={"16px"}
                color={activeProtocol?.primaryColor}
              >
                Delegates
              </TYPE.black>
            </TabOption>
            <TabOption
              as={Link}
              to={"/proposals/" + activeProtocol?.id}
              selected={location.pathname.includes("proposals")}
              color={activeProtocol?.primaryColor}
              color2={activeProtocol?.secondaryColor}
            >
              <TYPE.black
                fontSize={"16px"}
                color={activeProtocol?.primaryColor}
              >
                Proposals
              </TYPE.black>
            </TabOption> */}
          </AutoRow>
          {location.pathname.includes("delegates") && (
            <AboveSmall>
              <RowFixed>
                <Toggle isActive={filter} toggle={() => setFilter(!filter)} />
              </RowFixed>
            </AboveSmall>
          )}
        </RowBetween>
      </TabsCardStyled>
    </Card>
  );
}

export default Tabs;
