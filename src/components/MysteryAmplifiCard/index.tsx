import React from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import amplifiIcon from 'assets/images/AmpliFi.svg'
import useAirdrop from 'hooks/useAirdrop';
import { nFormatter } from 'utils/format';
import { darken } from 'polished';
const ColoredCard = styled(Card)<{width?: string}>`
  color: ${({ theme }) => theme.black};
  background: ${({theme}) => theme.special};
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

const RoundBox = styled.span`
  background: ${({theme}) => darken("0.1", theme.primary1)};
  padding: 3px;
  borderRadius: 10px;
`
  

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
        <span>{airdropAmount ? nFormatter(airdropAmount, 1) : <RoundBox>-</RoundBox>}{` $AMP`}</span>
      </div>
    </ColoredCard>
  )
}

export default MysteryAmplifiCard