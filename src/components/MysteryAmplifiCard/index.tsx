import React from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import amplifiIcon from 'assets/images/AmpliFi.svg'
import useAirdrop from 'hooks/useAirdrop';
import { nFormatter } from 'utils/format';

const ColoredCard = styled(Card)<{width?: string}>`
  color: ${({ theme }) => theme.black};
  background: linear-gradient(90deg, #9C27B0 0%, #5E35B1 100%);
  text-decoration: none;
  padding: 9px;
  font-size: 14px;
  // border: 2px solid black;
  color: white;
  border-radius: 12px;
  :hover {
    cursor: help;
  }
  width: ${({width}) => width ? width : null};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  `;
  
  //width should be 5px more than height
  const AmplifiLogo = styled.img<{height?: string, width?: string}>`
  height: 20px;
  width: 20px;
  background: ${({ theme }) => theme.white};
  outline: 1px black;
  margin-right: 5px;
  border-radius: 50%;
  // border: 1px solid black;
  padding: 2px;
  // background: white;
  vertical-align: sub;
  position: relative;
  top: 1px;
`

export function MysteryAmplifiCard ({width}: {width?: string}) {
  const airdropAmount = useAirdrop();
  return (
    <ColoredCard width={width} >
      <div>
        <AmplifiLogo style={{marginRight: '5px'}} src={amplifiIcon} /> 
        <span>{airdropAmount ? nFormatter(100000000, 1) : <span style={{background:'#493991', padding: 3, borderRadius: 5}}>-</span>}{` $AMP`}</span>
      </div>
    </ColoredCard>
  )
}

export default MysteryAmplifiCard