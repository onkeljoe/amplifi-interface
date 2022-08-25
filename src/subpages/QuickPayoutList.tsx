import React from "react";
import { nFormatter } from "utils/format";
import { nameOrAddress } from "utils/getName";

function QuickPayoutList({ lastPayout }: any) {
  return (
    <>
      <div>
        <h1>
          Payouts for{" "}
          <a href='https://snapshot.org/#/beets.eth/proposal/0x9b3b328e77e2d5b99a26ede7b4f6c36ee0bf6b4c06241e84f50f01735270d6e9'>
            Beets Round 15
          </a>
        </h1>
      </div>
      <div>
        {lastPayout
          .sort((a: any, b: any) => b.payoutUSD - a.payoutUSD)
          .map(({ address, payoutUSD }: any) => {
            return (
              <div key={address}>
                {nameOrAddress(address, undefined, true)}:{" "}
                {nFormatter(payoutUSD, 2)} USD
              </div>
            );
          })}
      </div>
    </>
  );
}

export default QuickPayoutList;
