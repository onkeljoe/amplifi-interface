import { AirdropList, fetchList } from "data/list";
import { useActiveWeb3React } from "hooks";
import { useEffect, useState } from "react";
import { useVerifiedHandle } from "state/social/hooks";
export function useAirdrop () {
  const { account } = useActiveWeb3React();
  const verifiedHandleEntry = useVerifiedHandle(account);
  const [airdropList, setAirdropList] = useState<AirdropList>()
  useEffect(() => {
    if (account && verifiedHandleEntry) {
      fetchList({
        id: "1u8IBLhr3Bk9MUkDquCEq2_q-IE-1KRiVYfo1la4nV_Y", //todo - currently this field is ignored
        source: "excel",
        type: "airdrop", //todo - currently this field is ignored
        excelSheetName: "example",
        query: undefined
      }).then((res) => {
        if (res) {
          setAirdropList(res)
        }
      })
    }
  } , [account, verifiedHandleEntry])
  return verifiedHandleEntry && verifiedHandleEntry.handle && airdropList && airdropList[verifiedHandleEntry.handle]
}

export default useAirdrop