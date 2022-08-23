import { fetchList, ListSettings } from "data/list";
import { useEffect, useState } from "react";
export function useList(settings: ListSettings) {
  const [data, setData] = useState<any>();
  const [status, setStatus] = useState<'loading' | 'success'>('loading');
  useEffect(() => {
    if ('success' == status) return; 
    fetchList(settings).then((res) => {
      if (!res) return;
      console.log('hisafhasifhdasifhdi')
      setStatus('success')
      setData(res.data);
    });
  });
  return data;
}

export default useList;
