import axios from 'axios';
import CRE8RPriceCard from 'components/CRE8RPriceCard';
import { LoadingRows } from 'components/Loader';
import { useActiveWeb3React } from 'hooks';
import useCountdown from 'hooks/useCountdown';
import React, {useEffect, useState} from 'react'
import { useBlockNumber } from 'state/application/hooks';
import styled from 'styled-components';
import { nFormatter } from 'utils/format';
import { nameOrAddress } from 'utils/getName';
import useBribe, { BLOCKNUMBER, strategiesToUSDConverter } from './hooks/useBribe'
import { calcChange, formatChange } from './math';
import { calcLpToGetBasicBoosted, calcBasicBoostedToReceive, calcUSDBoostedBribeToRecieve, calcUSDBoostedBonusToRecieve } from './utils';
import snapshot from '@snapshot-labs/snapshot.js';
import { toast } from 'react-toastify';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);



const lastPayoutUri = "https://raw.githubusercontent.com/CRE8RDAO/booosted-bribes/master/payouts/out/bribe-payouts-43050170.json"

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
`

const VoteButton = styled.a`
  background-image: ${({theme}) => theme.special};
  margin: 10px;
  font-size: 20px;
  padding: 15px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: #FFF;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
  &:hover{
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    margin: 8px 10px 12px;
    background-position: right center;
    cursor: not-allowed;
}
`

function BoostCalculator () {
  const { library, account } = useActiveWeb3React();
  const {cre8rScore, beetsScore} = useBribe(library, account)
  const {cre8rScore : latestCS, beetsScore : latestBS, cre8rScoreBreakdown} = useBribe(library, account,0,BLOCKNUMBER + 4000000000) // what year would this be? 
  const cre8rChange = cre8rScore && (latestCS || latestCS == 0) && calcChange(cre8rScore, latestCS)
  const beetsChange = beetsScore && (latestBS || latestBS == 0) && calcChange(beetsScore, latestBS)
  const [lastPayout, setLastPayout] = useState([]);
  const amountUSDForBasicBoost = beetsScore && calcLpToGetBasicBoosted(beetsScore)
  const basicBoostToReceiveUSD = beetsScore && calcBasicBoostedToReceive(beetsScore)
  const amountUSDForBoostedBribe = cre8rScore &&  calcUSDBoostedBribeToRecieve(cre8rScore)
  const amountUSDForBoostedBonus = cre8rScore && calcUSDBoostedBonusToRecieve(cre8rScore)

  const hasBasicBoosted = beetsScore == 0 && latestCS && cre8rScore && amountUSDForBasicBoost && latestCS - cre8rScore > amountUSDForBasicBoost
  const accountLastPayout = lastPayout && lastPayout.filter((i : any) => i.address == account)[0]
  const hasBoostedBribe = lastPayout && latestCS && amountUSDForBoostedBribe && cre8rScore && accountLastPayout + cre8rScore * 1.25 + amountUSDForBoostedBribe <= latestCS
  const hasBoostedBonus = lastPayout && latestCS && amountUSDForBoostedBribe && cre8rScore && accountLastPayout + cre8rScore * 1.35 + amountUSDForBoostedBribe <= latestCS

  const loaded = amountUSDForBasicBoost && basicBoostToReceiveUSD && amountUSDForBoostedBribe && amountUSDForBoostedBonus && (cre8rScore || cre8rScore == 0) && (beetsScore || beetsScore == 0) && (cre8rChange || cre8rChange == 0) && (beetsChange || beetsChange == 0)

  const countdownText = useCountdown("Aug 3, 2022 9:00:00 GMT-07:00", "Vote on Beets Snapshot");


  useEffect(() => {
    axios.get(lastPayoutUri).then(res => {
      if (res.status === 200) {
        setLastPayout(res.data)
      }
    })
  } ,[])

  if (!account) {
    return <>
      <div>Connect a wallet that voted to view your Boosted Bribes VP</div>
    </>
  }
  if (!loaded) {
    <>
      <LoadingRows>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LoadingRows>
    </>
  }
  return (
    <>
    {/* TODO: Get snapshot query: https://docs.snapshot.org/snapshot.js */}
    <div>This button will unlock when the next beets snapshot comes</div>
      <VoteButton onClick={() => {
        if (!account || !library) return;
        (client as any).vote((library as any), account, {
          space: 'amplifidao.eth',
          proposal: '0x98101f1e0067605c050d621f9a8705495c4378a64604aff4722ce98b6127100e',
          type: 'weighted',
          choice: {"45":10},
          metadata: JSON.stringify({
            "47": 10
          })
        }).then((receipt : any) => {
          console.log(receipt)
          toast.success('Vote is successful! Thank you for voting for CRE8R.')
        }).catch((err : any) => console.log(err));
      }}>
        {countdownText}
      </VoteButton>
      <div>
        <h1>Bribe Tiers</h1>
      </div>
      <Table>
        <tr>
          <th>Bribe Tier</th>
          <th>Payout</th>
          <th>Condition</th>
          <th>Status</th>
        </tr>
        <tr>
          <td>
            Basic Bribe
          </td>
          <td>
            $664.34 per 1% of Beets vote
          </td>
          <td>
            Vote for CRE8R in F-Major on Beets snapshot
          </td>
          <td>⌛</td>
        </tr>
        <tr>
          <td>
            Basic Boosted {'(for new voter)'}
          </td>
          <td>
            {basicBoostToReceiveUSD == 0 ? `Get some fBeets and check later` : `$${nFormatter(basicBoostToReceiveUSD!,1)}`}
          </td>
          <td>
          {amountUSDForBasicBoost == 0 ? `Get some fBeets and check later` : `LP at least $${nFormatter(amountUSDForBasicBoost!,1)}`}
          </td>
          <td>{hasBasicBoosted ? <span style={{ color: 'green' }}>✔</span> : <>❌</>}</td>
        </tr>
        <tr>
          <td>
            Boosted Bribe
          </td>
          <td>
          25% bonus of Basic Bribe 
          </td>
          <td>
            Increase CRE8R Holdings + last bribe by ${nFormatter(amountUSDForBoostedBribe!,1)}
          </td>
          <td>{hasBoostedBribe ? <span style={{ color: 'green' }}>✔</span> : <>❌</>}</td>
        </tr>
        <tr>
          <td>
            Boosted Bonus
          </td>
          <td>
            35% of Basic Bribe
          </td>
          <td>
            Increase CRE8R Holdings + last bribe by  ${nFormatter(amountUSDForBoostedBonus!,1)}
          </td>
          <td>{hasBoostedBonus ? <span style={{ color: 'green' }}>✔</span>: <>❌</>}</td>
        </tr>
      </Table>
      <div>Last Holdings Block Number: {BLOCKNUMBER}</div>
      <div>
        <div>
          <h1>Your Stats at Block Number: {BLOCKNUMBER}</h1>
        </div>
        <div>
        Your CRE8R Holdings across Fantom Pools and Vaults: {cre8rScore && <span style={{color: ''}}>${nFormatter(cre8rScore, 1)}</span>}
        </div>
        <div>
        Your Beets VP: {beetsScore != undefined && <span style={{color: ''}}> ${nFormatter(beetsScore, 1)}</span>}
        </div>
      </div>
      <div>
        <div>
          <h1>Your Stats at the Latest Block</h1>
        </div>
        <div>
        Your CRE8R Holdings across Fantom Pools and Vaults: {(cre8rChange || cre8rChange == 0) && <span style={{color: cre8rChange > 0 ? 'green' : 'red'}}>${nFormatter(latestCS!, 1)} {`(${formatChange(cre8rChange)})`}</span>}
        </div>
        <div>
        Your Beets VP: {(beetsChange || beetsChange == 0) && <span style={{color: beetsChange > 0 ? 'green' : 'red'}}> ${nFormatter(latestBS!, 1)} {`(${formatChange(beetsChange)})`}</span>}
        </div>
        <div>
          <h2>CRE8R holdings breakdown</h2>
          {cre8rScoreBreakdown && cre8rScoreBreakdown.map((i : any) => {
            return <div key={i.symbol} style={{marginBottom: 10}}> 
              <div>symbol: {i.symbol}</div>
              <div>number of tokens: {nFormatter(i.numTokens, 1)}</div>
              <div>one token price: ${i.priceUSD.toFixed(4)}</div>
              <div>total value: ${i.valueUSD.toFixed(2)}</div>
            </div>
          })}
        </div>
      </div>


      <div>
        <h1>
          Payouts for <a href="https://snapshot.org/#/beets.eth/proposal/0x9b3b328e77e2d5b99a26ede7b4f6c36ee0bf6b4c06241e84f50f01735270d6e9">
          Beets Round 15  
          </a> 
        </h1>
      </div>
      <div>
        {lastPayout.sort((a : any, b: any) =>  b.payoutUSD - a.payoutUSD).map(({address, payoutUSD} : any) => {
          return <div key={address}>{nameOrAddress(address, undefined, true)}: {nFormatter(payoutUSD, 2)} USD</div>
        })}
      </div>
    </>
  )
}

export default BoostCalculator