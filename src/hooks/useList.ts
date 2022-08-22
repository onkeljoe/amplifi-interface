import config from "config";
import { AirdropList, fetchList } from "data/list";
import { useActiveWeb3React } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { useVerifiedHandle } from "state/social/hooks";
import { updateAmplifiAirdropList } from "state/user/actions";
export function useList () {
  const { account } = useActiveWeb3React();
  const [data, setData] = useState<any>();
  useEffect(() => {
    if (account) {
      fetchList({
        id: '1b7UGQy62ysOwhUcH5uPFPDlINGMUyK7uEhZwqjoBSXo', // config.airdrop.excel.id,
        source: "excel",
        type: "payout", //todo - currently this field is ignored
        excelSheetName: "Bribes Payout",
      }).then((res) => {
        if (!res) return;
        setData(res.data)
      })
    }
  } , [account])
  return data
}

export default useList