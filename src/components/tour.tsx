import React, { cloneElement } from 'react';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

const newSteps : any =  [
  // step Connect wallet - should advance on click to left side of walletconnect modal
  {
    id: 'welcome',
    text: [
      `
      <p>
      AmpliFi is an Affiliate marketing & referral program platform for Web3 its flexible enough to handle incentive payouts in any token based on referrers contribution to any onchain or offchain outcome </p>

      <p>
      It only takes a couple of minutes to get verified, check if you are on the publisher airdrop list, check out protocols & their campaigns & grab a unique link & start earning. Lets go!
      </p>
      <p>Connect Your Wallet to get started</p>
      `
    ],
    attachTo: { element: '.sc-ehmTmK', on: 'left' },
    advanceOn: { element: '.sc-ehmTmK', event: 'click' },
    classes: 'shepherd shepherd-welcome',

    buttons: [
      {
        type: 'cancel',
        classes: 'shepherd-button-secondary',
        text: 'Exit'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  

  // step 2 we should be at wallet connect modal now - advance on click of any wallet option ie metamask etc
  
  {
    id: 'wallet-connect',
    title: 'Wallet Connect',
    text: [
      `<p> Select your wallet then click "add a public identity"</p>
      <p> You will be redirected to Twitter. See you back here in a sec!</p>`
    ],
    attachTo: { element: '.sc-kgflAQ.ccLhmY.css-613mex', on: 'bottom-left' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'connect',
    title: 'Connect Wallet',
    text:
      'Connect wallet - make sure you are on Ethereum network',
    attachTo: { element: '.sc-ehmTmK', on: 'bottom' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'installation',
    title: 'Installation',
    text:
      'Lets get you verified anon. Its the first step to checking your publisher',
    attachTo: { element: '.sc-bUbCnL', on: 'bottom' },
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'centered-example',
    title: 'Centered Shepherd Element',
    text: `But attachment is totally optional!\n \
    Without a target, a tour step will create an element that's centered within the view. \
    Check out the <a href="https://shepherdjs.dev/docs/">documentation</a> to learn more.`,
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Next'
      }
    ]
  },
  {
    id: 'followup',
    title: 'Learn more',
    text: 'Star Shepherd on Github so you remember it for your next project',
    attachTo: { element: '.hero-followup', on: 'top' },
    scrollTo: true,
    buttons: [
      {
        type: 'back',
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        type: 'next',
        text: 'Done'
      }
    ]
  }
];

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    }
  },
  useModalOverlay: false
};

export default function Tour({ children } : any) {
  return (
    <ShepherdTour steps={newSteps} tourOptions={tourOptions}>
      {cloneElement(children, {tourContext: ShepherdTourContext})}
    </ShepherdTour>
  );
}
