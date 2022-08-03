import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { BigNumber, ethers } from "ethers";
import ERC20_ABI from '../abi/ERC20-abi.json';
// todo - create config file of all of these constants
/**
 * Assumes that there are only 2 tokens in the lp pool that are of value
 * @param {BigNumber} circulatingSupply 
 * @param {BigNumber} token1Amount 
 * @param {BigNumber} token1Price 
 * @param {BigNumber} token2Amount 
 * @param {BigNumber} token2Price 
 * @returns 
 */
 function calculateLPTokenPriceInUSD (circulatingSupply: BigNumber, token1Amount: BigNumber, token1Price: BigNumber, token2Amount: BigNumber, token2Price: BigNumber) {
  return token1Amount.mul(token1Price).add(token2Amount.mul(token2Price)).div(circulatingSupply )
}

export async function getCRE8RPrice() {
  return fetch("https://api.dexscreener.com/latest/dex/pairs/fantom/0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140-0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83-0x2aD402655243203fcfa7dCB62F8A08cc2BA88ae0").then(res => {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
  }).then(data => {
    if (data.schemaVersion !== '1.0.0') {
      throw 'Schema was updated, please confirm mappings are still correct'
    }
    return parseFloat(data.pairs[0].priceUsd)
  })
}

export async function getFTMPrice() {
  return fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=FTM&tsyms=USD").then(res => {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
  }).then(data => {
    return data.RAW.FTM.USD.PRICE
  })
}

async function getTokenBalance(provider : ethers.providers.JsonRpcProvider, erc20Abi : any, erc20Address: any, account: string) {
  const contract = new ethers.Contract(erc20Address, erc20Abi, provider);
  return await contract.balanceOf(account);
}

async function getTotalSupply(provider: ethers.providers.JsonRpcProvider, erc20Abi : any, erc20Address : string) {
  const contract = new ethers.Contract(erc20Address, erc20Abi, provider);
  return await contract.totalSupply();
}
function convertPriceToBigNumber(price : number | string) : BigNumber {
  return BigNumber.from((parseFloat(price.toString())*1e18).toString())
}

export async function getSpiritLPCRE8R (){
  const provider = new ethers.providers.JsonRpcProvider("https://rpcapi.fantom.network");
  const ftmAddress = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
  const cre8rAddress = "0x2aD402655243203fcfa7dCB62F8A08cc2BA88ae0";
  const spiritLPCRE8rAddress = "0x459e7c947E04d73687e786E4A48815005dFBd49A";
  const ftmBalance = await getTokenBalance(provider, ERC20_ABI, ftmAddress, spiritLPCRE8rAddress)
  const cre8rBalance = await getTokenBalance(provider, ERC20_ABI, cre8rAddress, spiritLPCRE8rAddress)
  const circulatingSupply = await getTotalSupply(provider, ERC20_ABI, spiritLPCRE8rAddress);
  const cre8rPrice = convertPriceToBigNumber(await getCRE8RPrice());
  const ftmPrice = convertPriceToBigNumber(await getFTMPrice());
  const spiritLPCRE8RPrice = calculateLPTokenPriceInUSD(circulatingSupply, ftmBalance, ftmPrice, cre8rBalance, cre8rPrice);

  return spiritLPCRE8RPrice
}

const beetsClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://backend.beets-ftm-node.com/graphql', fetch }),
  cache: new InMemoryCache(),
});

const beetsPoolQuery = gql`
query BeetsPool($id: String!) {
  pool (id: $id){
    totalShares
    tokensList
    totalLiquidity
  
  }
}

`

export async function getBeetsLPCRE8R () {
  const poolId = "0xbb4607bede4610e80d35c15692efcb7807a2d0a6000200000000000000000140"
  const { loading, error, data } = await beetsClient.query({
    query: beetsPoolQuery,
    variables: {
      "id": poolId
    }
  })
  if (data) {
    const lpCRE8RBeets = parseFloat(data.pool.totalLiquidity)/parseFloat(data.pool.totalShares);
    return lpCRE8RBeets
  } else {
    console.error(error)
    return undefined
  }
}