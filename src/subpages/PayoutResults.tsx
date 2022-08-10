import axios from "axios";
import CRE8RPriceCard from "components/CRE8RPriceCard";
import { LoadingRows } from "components/Loader";
import { useActiveWeb3React } from "hooks";
import useCountdown from "hooks/useCountdown";
import React, { useEffect, useState } from "react";
import { useBlockNumber } from "state/application/hooks";
import styled from "styled-components";
import { nFormatter } from "utils/format";
import { nameOrAddress } from "utils/getName";
import useBribe, {
  BLOCKNUMBER,
  strategiesToUSDConverter,
} from "./hooks/useBribe";
import { calcChange, formatChange } from "./math";
import snapshot from "@snapshot-labs/snapshot.js";
import { toast } from "react-toastify";
import { calcProjectedPayouts } from "./data/projectedPayouts";
import useCRE8RPrice from "hooks/useCRE8RPrice";
import { AutoColumn } from "components/Column";
import { AutoRow } from "components/Row";

const AMP_PRICE_USD = 0.001666666667;
const PAYOUT_PER_TOTAL_PERCENT_USD = 664.34;

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const lastPayoutUri =
  "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-44457923.json";
const linkToSnapshot = "https://snapshot.org/#/beets.eth/proposal/0xbc5785e1323c70986d77d33ab734c1c18f122c2a6082f84fbc437c549d8b84ad";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
`;

const VoteButton = styled.a`
  background-image: ${({ theme }) => theme.special};
  margin: 5px;
  font-size: 12px;
  padding: 10px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: #fff;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    margin: 8px 10px 12px;
    background-position: right center;
    cursor: pointer;
  }
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 132px 100px 1fr;
  grid-column-gap: 1rem;

  position: relative;
  margin: 6px 0;
  border-left: 3px solid transparent;

  :hover::after {
    content: "";
    border-left: 3px solid ${({ theme }) => theme.primary1};
    position: absolute;
    margin-left: calc(-2rem - 4px);
    height: 100%;
    width: 1px;
  }

  &:first-child {
    :hover {
      border-left: 3px solid transparent;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    grid-template-columns: 1fr 100px 1fr;
     > *:nth-child(2){
      display: none;
    }
  `};

  @media (max-width: 1370px) {
    grid-template-columns: 1fr 1fr;
    padding: 0 0.5rem;
    > *:nth-child(3) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr 1fr;
    margin: 0;
    padding: 0 1rem;
  `};
`;

function PayoutMethodology() {
  const { library, account } = useActiveWeb3React();
  const {cre8rPrice} = useCRE8RPrice();
  const [lastPayout, setLastPayout] = useState<any>();

  useEffect(() => {
    axios.get(lastPayoutUri).then((res) => {
      if (res.status === 200) {
        setLastPayout(res.data);
      }
    });
  }, []);


  return (
    <>
      {/* TODO: Get snapshot query: https://docs.snapshot.org/snapshot.js */}
      {!lastPayout ? <>
        <LoadingRows>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LoadingRows>
      </> : <>
      {/* <div>
        <h1>
          Payouts for{" "}
          <a href={linkToSnapshot}>
            Beets Round 16
          </a>
        </h1>
      </div> */}
      <div>
      <AutoColumn gap="6px">
        {lastPayout
          .sort((a: any, b: any) => b.payoutUSD - a.payoutUSD)
          .map(({ address, payoutUSD }: any) => {
            return (
              <DataRow key={address}>
                <AutoRow gap="10px" style={{ flexWrap: "nowrap" }}>
                  <div style={{minWidth: 200}}>
                    {nameOrAddress(address, undefined, true)}:{" "}
                  </div>
                  <div>
                    {nFormatter(payoutUSD, 2)} USD
                  </div>
                </AutoRow>
              </DataRow>
            );
          })}
          </AutoColumn>
      </div>
      </>}
      
    </>
  );
}

export default PayoutMethodology;