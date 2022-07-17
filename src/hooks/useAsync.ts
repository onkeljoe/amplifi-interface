import { DependencyList, EffectCallback, useEffect } from "react"


const useAsync = (effect: (isMounted : boolean) => void | (() => void), deps?: DependencyList) => {
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = effect(isMounted)
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      isMounted = false;
    }
  }, deps)
}


export default useAsync