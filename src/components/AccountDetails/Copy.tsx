import React from 'react'
import styled from 'styled-components'
import useCopyClipboard from '../../hooks/useCopyClipboard'

import { CheckCircle, Copy } from 'react-feather'
import { LinkStyledButton } from '../../theme'

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

const CopyHelper = (props: { toCopy: string; children?: React.ReactNode }): JSX.Element => {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={'35'} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <Copy size={'35'} />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}

export default CopyHelper
