import config from "config";
import { AirdropList, fetchList, ListSettings } from "data/list";
import { useActiveWeb3React } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { useVerifiedHandle } from "state/social/hooks";
import { updateAmplifiAirdropList } from "state/user/actions";
export function useList (settings: ListSettings) {
  const { account } = useActiveWeb3React();
  const [data, setData] = useState<any>();
  useEffect(() => {
    if (account) {
      fetchList(settings).then((res) => {
        if (!res) return;
        setData(res.data)
      })
    }
  } , [account])
  return data
}

export default useList