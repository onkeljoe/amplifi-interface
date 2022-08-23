import { fetchList, ListSettings } from "data/list";
import { useEffect, useState } from "react";
export function useList(settings: ListSettings) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    fetchList(settings).then((res) => {
      if (!res) return;
      setData(res.data);
    });
  });
  return data;
}

export default useList;
