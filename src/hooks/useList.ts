import config from "config";
import { AirdropList, fetchList, ListSettings } from "data/list";
import { useActiveWeb3React } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { useVerifiedHandle } from "state/social/hooks";
import { updateAmplifiAirdropList } from "state/user/actions";
export function useList (settings: ListSettings) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    fetchList(settings).then((res) => {
      if (!res) return;
      setData(res.data)
    })
  })
  return data
}

export default useList