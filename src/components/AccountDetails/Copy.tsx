import React from "react";
import styled from "styled-components";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { CheckCircle, Copy as CopyIcon } from "react-feather";
import { LinkStyledButton, Button } from "../../theme";

const CopyButton = styled(Button)<{ numOfLinks?: number }>`
  max-width: ${({ numOfLinks }) => (numOfLinks === 2 ? "342px" : "100%")};
  border-radius: 12px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
  height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     max-width: 100%;
     gap: 10px;
     margin-bottom: 10px;
  `}
  :hover {
    background-color: ${({ theme }) => theme.secondary1};
    color: ${({ theme }) => theme.primary1};
    svg.fillHover {
      fill: ${({ theme }) => theme.primary1};
    }
  }
  :active {
    transform: scale(0.95) translateY(4px);
  }
  :focus {
    text-decoration: none;
  }
`;

const Copy = styled(LinkStyledButton)<{
  minWidth?: string;
  minHeight?: string;
}>`
  color: #ff3700;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  min-width: ${({ minWidth }) => (minWidth ? minWidth : "fit-content")};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : "unset")};
  justify-content: center;
  align-items: center;
  :focus {
    text-decoration: none;
  }
  :active {
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
    color: #ffbc7d;
  }
  text-decoration: none;
  svg {
    fill: #ff3700;
  }
`;

// to now show copy icon on mobile (takes precious space)
const CopyIconWrapper = styled.span`
  margin-right: 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: none;
  `}
`;

const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`;

// this is copy buttons which are already implemented (mainly for copying eth address on DelegateInfo, AccountDetails and PayoutInfo)
const CopyHelper = (props: {
  toCopy: string;
  minWidth?: string;
  minHeight?: string;
  children?: React.ReactNode;
}): JSX.Element => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <Copy
      onClick={() => setCopied(props.toCopy)}
      minWidth={props.minWidth}
      minHeight={props.minHeight}
    >
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={"20"} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <CopyIconWrapper>
            <CopyIcon size={"20"} />
          </CopyIconWrapper>
        </TransactionStatusText>
      )}
      {isCopied ? "" : props.children}
    </Copy>
  );
};

// this is for main copy link button on Campaign page
export const CopyBtn = (props: {
  toCopy: string;
  numOfLinks?: number | undefined;
  children?: React.ReactNode;
}): JSX.Element => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyButton
      onClick={() => setCopied(props.toCopy)}
      numOfLinks={props.numOfLinks}
    >
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={"20"} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <CopyIconWrapper>
            <CopyIcon size={"20"} className='fillHover' />
          </CopyIconWrapper>
          Copy your unique link &amp; start earning
        </TransactionStatusText>
      )}
      {isCopied ? "" : props.children}
    </CopyButton>
  );
};

export default CopyHelper;
