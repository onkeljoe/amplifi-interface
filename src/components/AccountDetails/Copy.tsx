import React from "react";
import styled from "styled-components";
import useCopyClipboard from "../../hooks/useCopyClipboard";

import { CheckCircle, Copy } from "react-feather";
import { LinkStyledButton } from "../../theme";

const CopyIcon = styled(LinkStyledButton)`
  color: #ff3700;
  min-height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  // text-decoration: none;
  font-size: 15px;
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
    color: white;
  }
`;

// to now show copy icon on mobile (takes precious space)
const CopyIconWrapper = styled.span`
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

const CopyHelper = (props: {
  toCopy: string;
  children?: React.ReactNode;
}): JSX.Element => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={"20"} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <CopyIconWrapper>
            <Copy size={"20"} />
          </CopyIconWrapper>
        </TransactionStatusText>
      )}
      {isCopied ? "" : props.children}
    </CopyIcon>
  );
};

export default CopyHelper;
