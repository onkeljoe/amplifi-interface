import React, {useEffect} from 'react'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import {Tabs as MuiTabs} from '@mui/material'

export interface TabsData {
  tab: string;
  content: string;
  uri: string;
}

export interface TabsProps {
  value: string;
  onChange: (selection: string) => void;
  data: TabsData[];
  setPath: any;
}

export default function Tabs({value, onChange, data, setPath}: TabsProps) : JSX.Element {
  // useEffect(() => {
  //   setPath(data[0].uri || '/')
  // }, [data])
  return (
    <TabContext value={value || data[0].uri}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={value} onChange={(e : any) => {
          console.log('f')
          onChange(e.target.innerText.toLowerCase())
        }} aria-label="basic tabs example">
          {data.map((d, i) => <Tab value={d.uri} label={d.tab} key={i} onClick={() => {
            console.log(d.uri)
            setPath(d.uri)
          }} />)}
        </MuiTabs>
      </Box>
      {/* {data.map((d, i) => {
        return (
        <TabPanel value={d.tab} key={i}>
          <div dangerouslySetInnerHTML={{__html: d.content}} />
        </TabPanel>
      )
      })} */}
    </TabContext>
  )
}
