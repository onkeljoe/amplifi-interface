interface ListConfig {
  source: 'excel';
  type: string; //airdrop
  id: string;
  query?: string;
  excelSheetName?: string;
}

export async function fetchList(config: ListConfig) {
  switch (config.source) {
    case 'excel':
      if (!config.excelSheetName) {
        console.error('Unable to fetch excel sheet, sheet name must be the sheet TAB name')
        return;
      }
      const res = await fetchListExcel(config.id, config.excelSheetName, config.query)
      return convertExcelResponseToAirdropList(res)
    default:
      return;
  }
}

interface ExcelTableRow {
  c : Array<{v: string}>
}
function fetchListExcel(sheetId : string, sheetName: string, query : string | undefined) : Promise<Array<ExcelTableRow>> {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const url = `${base}&sheet=${sheetName}&tq=${encodeURIComponent(query || 'Select *')}`
  return fetch(url)
  .then(res => res.text())
  .then(rep => {
      //Remove additional text and extract only JSON:
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      return jsonData.table.rows

  })
}

export interface AirdropList {
  [twitterHandle: string]: number
}

function convertExcelResponseToAirdropList(excelRows : Array<ExcelTableRow>) : AirdropList {
  let _airdropList = {}
  excelRows.forEach((r) => {
    _airdropList = {
      ..._airdropList,
      [r.c[0].v]: r.c[1].v
    }
  })
  console.log(_airdropList)
  return _airdropList
}
