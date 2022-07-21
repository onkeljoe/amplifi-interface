import React from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import amplifiIcon from 'assets/images/AmpliFi.svg'
import { RowBetween } from 'components/Row';

const ColoredCard = styled(Card)`
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.white};
  text-decoration: none;
  padding: 7px;
  font-size: 14px;
  border: 2px solid black;
  border-radius: 12px;
  :hover {
    cursor: help;
  }
  `;
  
  
  const AmplifiLogo = styled.img`
  height: 20px;
  width: 25px;
  background: ${({ theme }) => theme.white};
  outline: 1px black;
  margin-right: 5px;
  border-radius: 50%;
  border: 2px solid black;
  // background: white;
`

export function MysteryAmplifiCard () {
  return (
    <ColoredCard>
      <RowBetween>
        <AmplifiLogo src={amplifiIcon} /> 
        {" -"} 
      </RowBetween>
    </ColoredCard>
  )
}

export default MysteryAmplifiCard