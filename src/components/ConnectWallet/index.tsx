import React, { useEffect } from "react";
import { useActiveWeb3React } from "hooks";
import { ApplicationModal } from "state/application/actions";
import { useToggleModal } from "state/application/hooks";
import { TYPE } from "theme";
import { ButtonBasic } from "components/Button";
import toast from "react-hot-toast";
import styled from "styled-components";

// got from RefferalLinksCard
const ButtonText = styled(TYPE.white)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`;

function ConnectWalletButton() {
  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);
  const { account } = useActiveWeb3React();
  useEffect(() => {
    if (account) {
      toast("Congrats! You are now connected and almost ready to use the app!");
    }
  }, [account]);
  return (
    <>
      <ButtonBasic onClick={toggleWalletModal}>
        <ButtonText>Connect wallet</ButtonText>
      </ButtonBasic>
      {account ? (
        <TYPE.blue>
          Congrats! You are now connected and almost ready to use the app!
        </TYPE.blue>
      ) : null}
    </>
  );
}

export default ConnectWalletButton;
