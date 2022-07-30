import config from "config";
import { AirdropList, fetchList } from "data/list";
import { useActiveWeb3React } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { useVerifiedHandle } from "state/social/hooks";
import { updateAmplifiAirdropList } from "state/user/actions";
export function useAirdrop () {
  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const dispatch = useDispatch();
  const airdropList = useSelector<AppState, AppState["user"]["amplifiAirdrop"]>((state) => {
    return state.user.amplifiAirdrop;
  }, shallowEqual);
  useEffect(() => {
    if (account && verifiedHandleEntry) {
      console.log(account)
      console.log(verifiedHandleEntry)
      fetchList({
        id: config.airdrop.excel.id,
        source: "excel",
        type: "airdrop", //todo - currently this field is ignored
        excelSheetName: "example",
        query: undefined
      }).then((res) => {
        if (res) {
          dispatch(updateAmplifiAirdropList({amplifiAirdrop: res}))
        }
      })
    }
  } , [account, verifiedHandleEntry])
  return verifiedHandleEntry && verifiedHandleEntry.handle && airdropList && airdropList[verifiedHandleEntry.handle]
}

export default useAirdrop