import { fetchList, ListSettings } from "data/list";
import { useEffect, useState } from "react";

export function useList(settings: ListSettings) {
  const [data, setData] = useState<any>();
  const [refreshs, setRefreshs] = useState<number>(0);
  useEffect(() => {
    if (refreshs > 0) return; 
    setRefreshs(r => ++r)
    fetchList(settings).then((res) => {
      if (!res) return;
      setData(res.data);
    });
  }, [settings, refreshs]);
  return data;
}

export default useList;
