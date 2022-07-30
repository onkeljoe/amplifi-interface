import axios from 'axios';
import { LoadingRows } from 'components/Loader';
import { useActiveWeb3React } from 'hooks';
import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
import { nFormatter } from 'utils/format';
import { nameOrAddress } from 'utils/getName';
import useBribe, { BLOCKNUMBER } from './hooks/useBribe'
import { calcLpToGetBasicBoosted, calcBasicBoostedToReceive, calcUSDBoostedBribeToRecieve, calcUSDBoostedBonusToRecieve } from './utils';

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
  const [lastPayout, setLastPayout] = useState([]);
  const amountUSDForBasicBoost = beetsScore && calcLpToGetBasicBoosted(beetsScore)
  const basicBoostToReceiveUSD = beetsScore && calcBasicBoostedToReceive(beetsScore)
  const amountUSDForBoostedBribe = cre8rScore &&  calcUSDBoostedBribeToRecieve(cre8rScore)
  const amountUSDForBoostedBonus = cre8rScore && calcUSDBoostedBonusToRecieve(cre8rScore)

  const loaded = amountUSDForBasicBoost && basicBoostToReceiveUSD && amountUSDForBoostedBribe && amountUSDForBoostedBonus && cre8rScore && beetsScore

  //countdown timer code - move to new file
  const [countdownText, setCountdownText] = useState('-');
  useEffect(() => {
    // Set the date we're counting down to
    const countDownDate = new Date("Aug 3, 2022 9:00:00 GMT-07:00").getTime();

    // Update the count down every 1 second
    const x = setInterval(function() {

      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      const displayCountdownText = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";
      setCountdownText(displayCountdownText)
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setCountdownText("Vote on Beets Snapshot")
      }
    }, 1000);
    return () => {
      clearInterval(x)
    }
  },[])

  useEffect(() => {
    axios.get(lastPayoutUri).then(res => {
      console.log(res)
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
      <VoteButton>
       {countdownText}
      </VoteButton>
      <div>Block Number: {BLOCKNUMBER}</div>
      <div>
        <h1>Your Stats</h1>
      </div>
      <div>
      Your CRE8R Holdings across Fantom Pools and Vaults: {cre8rScore && <span style={{color: 'green'}}>{nFormatter(cre8rScore, 1)}</span>}
      </div>
      <div>
      Your Beets VP: {beetsScore && <span style={{color: 'green'}}> {nFormatter(beetsScore, 1)}</span>}
      </div>
      <div>
        <h1>Bribe Tiers</h1>
      </div>
      <Table>
        <tr>
          <th>Bribe Tier</th>
          <th>Payout</th>
          <th>Condition</th>
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
        </tr>
        <tr>
          <td>
            Basic Boosted {'(for new voter)'}
          </td>
          <td>
            ${nFormatter(basicBoostToReceiveUSD!,1)}
          </td>
          <td>
            LP at least ${nFormatter(amountUSDForBasicBoost!,1)}
          </td>
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
        </tr>
      </Table>
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