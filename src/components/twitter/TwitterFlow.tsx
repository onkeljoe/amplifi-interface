import React, { useState } from "react";
import { AutoColumn } from "../Column";
import { ButtonPrimary } from "../Button";
import { TYPE, CloseIcon, BackArrowSimple } from "../../theme";
import { useActiveWeb3React } from "../../hooks";

import { RowBetween, RowFixed } from "../Row";
import styled from "styled-components";
import {
  useVerifyCallback,
  useAllVerifiedHandles,
  useTweetWatcher,
  useAllIdentities,
} from "../../state/social/hooks";
import { Tweet } from "react-twitter-widgets";
import { Dots } from "../../theme/components";
import { useTwitterAccount } from "../../state/user/hooks";
import { useActiveProtocol } from "../../state/governance/hooks";
import TwitterAccountPreview from "../../components/twitter/TwitterAccountPreview";
import TwitterLoginButton from "./TwitterLoginButton";
import { OffChainRequestModal } from "../TransactionConfirmationModal";
import { useSignedHandle } from "../../hooks/useSignedHandle";
import { fetchLatestTweet, LatestTweetResponse } from "../../data/social";
import { Identities } from "../../state/social/reducer";
import { CONNECT_CONFIG } from "state/governance/reducer";

const ModalContentWrapper = styled.div`
  padding: 2rem;
  width: 100%;

  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    opacity: 0.1;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background-color: #c0c1c1;
  }

  ::-webkit-scrollbar-thumb:hover {
    cursor: default;
  }
`;

const TweetWrapper = styled.div`
  padding: 1rem;
  color: ${({ theme }) => theme.blue1};
  background: #f2f2f2;
  word-break: break-word;
`;

export default function TwitterFlow({ onDismiss }: { onDismiss: () => void }) {
  const { account } = useActiveWeb3React();
  const [activeProtocol] = useActiveProtocol();

  // monitor user inputs
  const [twitterHandle] = useTwitterAccount();
  const [tweetID, setTweetID] = useState<undefined | string>();

  // update verified handles if succesful verification
  const verifiedHandles = useAllVerifiedHandles();
  const [allIndentities, setAllIdentities] = useAllIdentities();

  // monitor if user has signed message, reset if back arrow clicked
  const {
    sig,
    signMessage,
    setSig,
    error: sigError,
  } = useSignedHandle(twitterHandle);

  // monitor verification attempt
  const { verifyCallback } = useVerifyCallback(tweetID);
  const [attempting, setAttempting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [requestError, setRequestError] = useState<string | undefined>();

  async function onVerify() {
    //reset error and loading state
    setAttempting(true);
    setRequestError(undefined);

    // if callback not returned properly ignore
    if (!verifyCallback || !account || !tweetID) return;

    const res = await verifyCallback();

    // if error, display for user, if not update verified handle
    if (res.error || !res.success) {
      setRequestError(res.error);
      setAttempting(false);
    } else if (res.success && twitterHandle) {
      const newVerified: Identities = {};
      // new copy of verified list
      verifiedHandles &&
        allIndentities &&
        Object.keys(verifiedHandles).map((address) => {
          newVerified[address] = allIndentities[address];
          return true;
        });
      // reset global list of verified handles to account for new entry
      if (newVerified && allIndentities) {
        newVerified[account] = {
          ...allIndentities[account],
          twitter: {
            handle: twitterHandle,
            timestamp: Date.now(),
          },
        };
        setAllIdentities(newVerified);
      }
      setVerified(true);
    }
  }

  // check if we need to add a custom emoji to tweet
  const protocolEmojiFunc = (): string => {
    if (!activeProtocol || !activeProtocol.emoji) return "👀";
    if (activeProtocol.id === "AMPLIFI") return "";
    return activeProtocol.emoji;
  };
  const protocolEmoji = protocolEmojiFunc();

  // check if protocol has social or if it's APMPLIFI
  const socialTagsFunc = (): string => {
    // because if you just start with @AmplifiDAO tweeter treats it like a response
    // and app can't fetch it
    if (!activeProtocol || !activeProtocol.social) return "via";
    if (activeProtocol.id === "AMPLIFI") return "via ";
    return activeProtocol.social + " X ";
  };
  const socialTags = socialTagsFunc();

  //check if we need additional hashtags
  const socialHashtagFunc = (): string => {
    if (!activeProtocol || !activeProtocol.token) return "CRE8R";
    if (activeProtocol.token.symbol === "CRE8R") return "CRE8R";
    return `${activeProtocol?.token.symbol},CRE8R`;
  };
  const socialHashtag = socialHashtagFunc();

  const tweetText = `${protocolEmoji} ${socialTags}@AmpliFiDAO 📡
address: ${account}
${sig ? `sig: ${sig}` : ""}`;
  const urlProtocol = encodeURI(
    `https://amplifi.cre8r.vip/#/campaigns/${activeProtocol?.id}`
  );

  // then it goes here to make a good looking tweet
  const tweetCopyForLink = encodeURI(
    `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=${socialHashtag}&url=${urlProtocol}`
  );

  // used just for display in UI of amplifi interface (pre-tweet)
  const readableTweetText = `${protocolEmoji} ${socialTags}@AmpliFiDAO 📡
  <address>
  <sig>
  #${activeProtocol?.token.symbol ?? "CRE8R"}`;
  const readableTweetCopy = `${readableTweetText}\nhttps://amplifi.cre8r.vip/#/campaigns/${activeProtocol?.id}`;

  // watch for user tweet
  const [tweetError, setTweetError] = useState<string | undefined>();
  const [watch, setWatch] = useState<boolean>(false);

  // use hook to handle polling
  useTweetWatcher(
    sig,
    twitterHandle,
    watch,
    setWatch,
    setTweetID,
    setTweetError
  );

  function startWatching() {
    setWatch(true); // restart watcher
    setTweetError(undefined); // reset error
    window.open(
      `${tweetCopyForLink}`,
      "tweetWindow",
      "height=400,width=800,top=400px,left=400px"
    );
  }

  // start watching and open window
  function checkForTweet() {
    twitterHandle &&
      fetchLatestTweet(twitterHandle)
        .then((res: LatestTweetResponse | null) => {
          if (res?.data[0]) {
            const tweetData = res?.data?.[0];
            // check that tweet contains correct data
            const passedRegex = tweetData.text.includes("sig: " + sig);
            if (passedRegex) {
              setTweetID(tweetData.id);
              setTweetError(undefined);
              setWatch(false);
            } else {
              startWatching();
            }
          } else {
            startWatching();
          }
        })
        .catch(() => {
          startWatching();
        });
  }

  return (
    <ModalContentWrapper>
      {!twitterHandle ? (
        <AutoColumn gap='lg'>
          <RowBetween>
            <RowFixed>
              <TYPE.mediumHeader ml='6px'>Connect Twitter</TYPE.mediumHeader>
            </RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <TYPE.black>
            Sign in with Twitter to link your Ethereum address and Twitter
            handle.
          </TYPE.black>
          <TwitterAccountPreview />
          <TwitterLoginButton text='Connect Twitter' />
        </AutoColumn>
      ) : !sig ? (
        <AutoColumn gap='lg'>
          <RowBetween>
            <RowFixed>
              <TYPE.mediumHeader ml='6px'>
                Step 1: Sign Message
              </TYPE.mediumHeader>
            </RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <TYPE.black>
            Sign and tweet a message that will be used to link your wallet
            address and Twitter handle.
          </TYPE.black>
          <TwitterAccountPreview />
          <ButtonPrimary onClick={signMessage}>Sign</ButtonPrimary>
          {sigError && <TYPE.error error={true}>{sigError}</TYPE.error>}
        </AutoColumn>
      ) : !tweetID ? (
        <AutoColumn gap='lg'>
          <RowBetween>
            <RowFixed>
              <BackArrowSimple onClick={() => setSig(undefined)} />
              <TYPE.mediumHeader ml='6px'>Step 2: Announce</TYPE.mediumHeader>
            </RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <TwitterAccountPreview />
          <TweetWrapper>{readableTweetCopy}</TweetWrapper>
          <ButtonPrimary onClick={checkForTweet}>
            {watch ? (
              <Dots>Looking for tweet</Dots>
            ) : tweetError ? (
              "Check again"
            ) : (
              "Tweet This"
            )}
          </ButtonPrimary>
          {tweetError && <TYPE.error error={true}>{tweetError}</TYPE.error>}
        </AutoColumn>
      ) : !verified && !attempting ? (
        <AutoColumn gap='lg'>
          <RowBetween>
            <RowFixed>
              <BackArrowSimple
                onClick={() => {
                  setTweetID(undefined);
                  setRequestError(undefined);
                  setWatch(false);
                }}
              />
              <TYPE.mediumHeader ml='6px'>Step 3: Submit</TYPE.mediumHeader>
            </RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <TwitterAccountPreview />
          <Tweet tweetId={tweetID} />
          <TYPE.black>
            Verify your tweet and add your handle to the list of verified
            mappings.
          </TYPE.black>
          <ButtonPrimary
            onClick={onVerify}
            disabled={!account || !tweetID || !sig}
          >
            Submit
          </ButtonPrimary>
          {requestError && <TYPE.error error={true}>{requestError}</TYPE.error>}
        </AutoColumn>
      ) : (
        <OffChainRequestModal onDismiss={onDismiss} success={verified} />
      )}
    </ModalContentWrapper>
  );
}
