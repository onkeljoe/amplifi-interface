import { useState, useEffect } from "react";
import snapshot from "@snapshot-labs/snapshot.js";
import {
  getBeetsLPCRE8R,
  getCRE8RPrice,
  getFBeetsPrice,
  getSpiritLPCRE8R,
} from "subpages/data";

//todo- refactor this into ts
const BEETS = "beets.eth";
const CRE8R = "cre8r.eth";

export const strategiesToUSDConverter = {
  "BPT-CRE8R-F": getBeetsLPCRE8R,
  OLA: () => 1, //legacy
  CRE8R: getCRE8RPrice,
  reaper: () => 1, //legacy
  moo: () => 1, //legacy
  beluga: () => 1, //legacy
  spiritLPCRE8R: getSpiritLPCRE8R,
};

export const strategies = {
  [CRE8R]: [
    {
      name: "masterchef-pool-balance",
      network: "250",
      params: {
        pid: "39",
        symbol: "BPT-CRE8R-F",
        weight: 1, //202,
        tokenIndex: null,
        chefAddress: "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
        uniPairAddress: null,
        weightDecimals: 1, //3
      },
    },
    {
      name: "erc20-balance-of",
      network: "250",
      params: {
        address: "0xbbB192f66256002C96Dae28770b2622DB41d56Cc",
        symbol: "OLA",
        decimals: 18,
      },
    },
    {
      name: "erc20-balance-of",
      network: "250",
      params: {
        address: "0x2aD402655243203fcfa7dCB62F8A08cc2BA88ae0",
        symbol: "CRE8R",
        decimals: 18,
        // "weight": 9
      },
    },
    {
      name: "erc20-balance-of-weighted",
      network: "250",
      params: {
        symbol: "reaper",
        // "weight": 0.2021571004,
        address: "0xd70257272b108677B017A942cA80fD2b8Fc9251A",
        decimals: 18,
      },
    },
    {
      name: "erc20-balance-of-weighted",
      network: "250",
      params: {
        symbol: "moo",
        address: "0x503FF2102D51ec816C693017d26E31df666Cadf0",
        decimals: 18,
        // "weight": 2.950783334
      },
    },
    {
      name: "erc20-balance-of-weighted",
      network: "250",
      params: {
        symbol: "beluga",
        weight: 1,
        address: "0x6D931508d47f1D858c209C5296E9afC091a2Ddff",
        decimals: 18,
      },
    },
    {
      name: "contract-call",
      network: "250",
      params: {
        symbol: "spiritLPCRE8R",
        address: "0xDcD990038d9CBe98B84a6aD9dBc880e3d4b06599",
        decimals: 18,
        methodABI: {
          name: "balanceOf",
          type: "function",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
      },
    },
  ],
  [BEETS]: [
    {
      name: "masterchef-pool-balance",
      network: "250",
      params: {
        pid: "22",
        symbol: "fBEETS-STAKED",
        weight: 1,
        decimals: 18,
        tokenIndex: null,
        chefAddress: "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
        uniPairAddress: null,
        weightDecimals: 0,
      },
    },

    {
      name: "erc20-balance-of-weighted",
      network: "250",
      params: {
        symbol: "fbeets",
        weight: 1,
        address: "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1",
        decimals: 18,
      },
    },
  ],
};
const bribeSettings = {
  [CRE8R]: {
    strategies: strategies[CRE8R],
    network: 250,
  },
  [BEETS]: {
    strategies: strategies[BEETS],
    network: 250,
  },
};

/**
 *
 * @param {*} provider
 * @param {*} address
 * @param {*} pollTime
 * @param {*} blockNumber
 * @param {*} space
 * @returns {{cre8rScore: number | undefined, beetsScore: number | undefined, cre8rScoreBreakdown: any | undefined, beetsScoreBreakdown: {beetsScore: number, numBeets: number, fBeetsPrice: number} | undefined, cre8rPrice: number | undefined}}
 */
export default function useBribe(address, blockNumber = BLOCKNUMBER) {
  const [cre8rScore, setCre8rScore] = useState();
  const [cre8rScoreBreakdown, setCre8rScoreBreakdown] = useState();
  const [beetsScoreBreakdown, setBeetsScoreBreakdown] = useState();
  const [beetsScore, setBeetsScore] = useState();

  // used to know how much an Fbeets holder voted for cre8r-ftm on the beets snapshot
  useEffect(() => {
    if (!address) return;
    snapshot.utils
      .getScores(
        CRE8R,
        bribeSettings[CRE8R].strategies,
        bribeSettings[CRE8R].network,
        [address],
        blockNumber
      )
      .then(async (scores) => {
        if (!scores) return;
        const _cre8rScoreBreakdown = [];
        let total = 0;
        for (let i = 0; i < scores.length; i++) {
          const currentStrategy = scores[i];
          const { symbol } = bribeSettings[CRE8R].strategies[i].params;
          const fetchUSDToSymbol = strategiesToUSDConverter[symbol];
          //todo - refactor so more efficient
          const priceUSD = await fetchUSDToSymbol();
          let numTokens;
          if (symbol == "BPT-CRE8R-F") {
            //for some reason snapshot api reduces holdings by a factor of 10
            numTokens = currentStrategy[address] * 10;
          } else {
            numTokens = currentStrategy[address];
          }
          if (numTokens == undefined) {
            continue;
          }
          const valueUSD = numTokens * priceUSD;
          _cre8rScoreBreakdown.push({ symbol, numTokens, priceUSD, valueUSD });
          total += valueUSD;
        }
        setCre8rScore(total);
        setCre8rScoreBreakdown(_cre8rScoreBreakdown);
      });
  }, [address, blockNumber]);

  // used for beets VP
  useEffect(() => {
    if (!address) return;
    snapshot.utils
      .getScores(
        BEETS,
        bribeSettings[BEETS].strategies,
        bribeSettings[BEETS].network,
        [address],
        blockNumber
      )
      .then(async (scores) => {
        if (!scores) return;
        const scoresWithValues = scores.filter((val) => val[address] != null);
        let totalScore = 0;
        if (!scoresWithValues) return;
        for (let i = 0; i < scoresWithValues.length; i++) {
          if (scoresWithValues[i][address]) {
            totalScore += scoresWithValues[i][address];
          }
        }
        const beetsPrice = await getFBeetsPrice();
        const scoreUSD = totalScore * beetsPrice;
        setBeetsScoreBreakdown({
          beetsScore: scoreUSD,
          numBeets: totalScore,
          fBeetsPrice: beetsPrice,
        });
        setBeetsScore(scoreUSD);
      });
  }, [address, blockNumber]);

  return {
    cre8rScore,
    beetsScore,
    cre8rScoreBreakdown,
    beetsScoreBreakdown,
  };
}

// configure to show Fbeets VP and cre8r vp separatley
