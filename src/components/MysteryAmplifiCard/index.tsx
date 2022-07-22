import React from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import amplifiIcon from 'assets/images/AmpliFi.svg'
import { RowBetween } from 'components/Row';
import useAirdrop from 'hooks/useAirdrop';

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
  width: ${({width}) => width? width : '100px'};
  white-space: nowrap;
  `;
  
  //width should be 5px more than height
  const AmplifiLogo = styled.img<{height?: string, width?: string}>`
  height: ${({height}) => height ? height : '20px'};
  width:  ${({width}) => width ? width : '20px'};
  background: ${({ theme }) => theme.white};
  outline: 1px black;
  margin-right: 5px;
  border-radius: 50%;
  // border: 1px solid black;
  padding: 2px;
  // background: white;
`

export function MysteryAmplifiCard ({width}: {width?: string}) {
  const airdropAmount = useAirdrop();
  return (
    <ColoredCard width={width} >
      <RowBetween>
        <AmplifiLogo style={{marginRight: '5px'}} src={amplifiIcon} /> 
        <div style={{paddingRight: '5px'}}>{airdropAmount ? airdropAmount : <span style={{background:'#493991', padding: 3, borderRadius: 5}}>-</span>}{` $AMP`}</div>
      </RowBetween>
    </ColoredCard>
  )
}

export default MysteryAmplifiCard