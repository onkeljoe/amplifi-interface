import React, { useEffect, useState } from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import cre8rIcon from 'assets/images/cre8r-logo.png'
import useAirdrop from 'hooks/useAirdrop';
import { nFormatter } from 'utils/format';
import { getCRE8RPrice } from 'subpages/data';

const ColoredCard = styled(Card)<{width?: string}>`
  color: ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.bg2};
  text-decoration: none;
  padding: 9px;
  font-size: 14px;
  // border: 2px solid black;
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
  const Cre8rLogo = styled.img<{height?: string, width?: string}>`
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

export function CRE8RPriceCard ({width}: {width?: string}) {
  const [cre8rPrice, setCre8rPrice] = useState<string>('-')
  useEffect(() => {
    getCRE8RPrice().then(num => {
      setCre8rPrice('$' + num.toFixed(3))
    })
  }, [])
  return (
    <ColoredCard width={width} >
      <div>
        <Cre8rLogo style={{marginRight: '5px'}} src={cre8rIcon} /> 
        <span>{cre8rPrice}</span>
      </div>
    </ColoredCard>
  )
}

export default CRE8RPriceCard