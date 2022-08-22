import React from "react";
// replaced with alternative Dunks import TabContext from "@mui/lab/TabContext";
import { TabContext } from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { Tabs as MuiTabs } from "@mui/material";

export interface TabsData {
  tab: string;
  content: string;
  uri: string;
}

export interface TabsProps {
  value: string;
  onChange: (selection: string) => void;
  data: TabsData[];
  onClick: (uri: string) => void;
}

export default function Tabs({
  value,
  onChange,
  data,
  onClick,
}: TabsProps): JSX.Element {
  return (
    <TabContext value={value || data[0].uri}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MuiTabs
          value={value}
          onChange={(e: any) => {
            onChange(e.target.innerText.toLowerCase());
          }}
          variant="scrollable"
          aria-label="amplifi campaign tabs"
        >
          {data.map((d, i) => (
            <Tab
              value={d.uri}
              label={d.tab}
              key={i}
              onClick={() => {
                onClick(d.uri);
              }}
            />
          ))}
        </MuiTabs>
      </Box>
    </TabContext>
  );
}
