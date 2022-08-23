import axios from 'axios'
export interface ListSettings {
  source: 'excel' | 'url-json';
  idOrUrl: string;
  type: 'airdrop' | 'payout'; //type determines how the data is processed
  excelSheetName?: string;

}

export async function fetchList(settings: ListSettings) {
  switch (settings.source) {
    case 'excel':
      if (!settings.excelSheetName) {
        console.error('Unable to fetch excel sheet, sheet name must be the sheet TAB name')
        return;
      }
      if (settings.type === 'airdrop') {
        const res = await fetchListExcel(settings.idOrUrl, settings.excelSheetName, settings.type, undefined)
        return {
          data: convertExcelResponseToAirdropList(res), 
          type: settings.type
        }
      } else {
        const res = await fetchListExcel(settings.idOrUrl, settings.excelSheetName, settings.type, 'Select *')
        return {
          data: [convertExcelResponseToAmpPayoutBasicBoostList(res), convertExcelResponseToAmpPayoutBoostedBonusList(res)],
          type: settings.type
        }
      }
    case 'url-json':
      const res = await axios.get(settings.idOrUrl)
      return {
        data: res.data,
        type: settings.type
      }
    default:
      return;
  }
}

interface ExcelResponse {
  version: string;
  reqId: string;
  status: string;
  sig: string;
  table: {
    cols: Array<{id: string, label: string, type: string, pattern?: string}>,
    parsedNumHeader: 1,
    rows: Array<ExcelTableRow>
  }
}

interface ExcelTableRow {
  c : Array<{v: string | null} | null>
}
function fetchListExcel(sheetId : string, sheetName: string, type : string, query : string | undefined) : Promise<ExcelResponse> {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const url = `${base}&sheet=${sheetName}&tq=${encodeURIComponent(query || 'Select *')}`
  return fetch(url)
  .then(res => res.text())
  .then(rep => {
    //Remove additional text and extract only JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      return jsonData

  })
}

export interface AmpPayoutList {
  [address: string]: number | string
}
function convertExcelResponseToAmpPayoutBasicBoostList(excelRes : ExcelResponse) : AmpPayoutList {
  let _airdropList = {}

  let basicBoost2AmpInUSDPos : number | undefined; 
  for (let i = 0; i < excelRes.table.cols.length; i++) {
    if (excelRes.table.cols[i].label == 'basicBoost2AmpInUSD') {
      basicBoost2AmpInUSDPos = i
    }
  }
  if (basicBoost2AmpInUSDPos === undefined) {
    throw `basicBoost2AmpInUSD header is not found on table ${excelRes.reqId}`
  }
  excelRes.table.rows.forEach((r) => {
    _airdropList = {
      ..._airdropList,
      [r!.c[0]!.v!]: basicBoost2AmpInUSDPos && r && r.c && r.c[basicBoost2AmpInUSDPos] && r.c[basicBoost2AmpInUSDPos]?.v //must always have something like col A
    }
  })
  return _airdropList
}
function convertExcelResponseToAmpPayoutBoostedBonusList(excelRes : ExcelResponse) : AmpPayoutList {
  let _airdropList = {}

  let basicBoost2AmpInUSDPos : number | undefined; 
  for (let i = 0; i < excelRes.table.cols.length; i++) {
    if (excelRes.table.cols[i].label == 'boostedBonus2AmpInUSD') {
      basicBoost2AmpInUSDPos = i
    }
  }
  if (basicBoost2AmpInUSDPos === undefined) {
    throw `basicBoost2AmpInUSD header is not found on table ${excelRes.reqId}`
  }
  excelRes.table.rows.forEach((r) => {
    _airdropList = {
      ..._airdropList,
      [r!.c[0]!.v!]: basicBoost2AmpInUSDPos && r && r.c && r.c[basicBoost2AmpInUSDPos] && r.c[basicBoost2AmpInUSDPos]?.v //must always have something like col A
    }
  })
  return _airdropList
}

export interface AirdropList {
  [twitterHandle: string]: number
}



function convertExcelResponseToAirdropList(excelRes : ExcelResponse) : AirdropList {
  let _airdropList = {}
  //must follow airdrop layout: https://docs.google.com/spreadsheets/d/1u8IBLhr3Bk9MUkDquCEq2_q-IE-1KRiVYfo1la4nV_Y/edit#gid=0
  excelRes.table.rows.forEach((r) => {
    _airdropList = {
      ..._airdropList,
      [r!.c[0]!.v!]: r!.c[1]!.v! 
    }
  })
  return _airdropList
}
