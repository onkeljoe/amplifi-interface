import { useState, useEffect, useRef } from "react"
import { getCRE8RPrice } from "subpages/data"

const useCRE8RPrice = () => {
  const cache = useRef<number>();
  const [status, setStatus] = useState<'idle' | 'fetching' | 'fetched' | 'error'>('idle')
  const [cre8rPrice, setCre8rPrice] = useState<number>()
  useEffect(() => {
    setStatus('fetching')
    if (cache.current) return;
    getCRE8RPrice().then(num => {
      cache.current = num
      setCre8rPrice(num)
      setStatus('fetched')
    }).catch(err => {
      console.error(err)
      setStatus('error')
    })
  }, [])
  return {cre8rPrice, status}
}

export default useCRE8RPrice