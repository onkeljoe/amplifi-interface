import autoAnimate from "@formkit/auto-animate";
import { useRef, useState, useEffect } from "react";

/**
 * AutoAnimate hook for adding dead-simple transitions and animations to react.
 * @param options - Auto animate options or a plugin
 * @returns
 */
function useAutoAnimate(options = {}) {
  const element = useRef(null);
  const [controller, setController] = useState();
  //@ts-ignore
  const setEnabled = (enabled) => {
    if (controller) {
      //@ts-ignore
      enabled ? controller.enable() : controller.disable();
    }
  };
  useEffect(() => {
    //@ts-ignore
    if (element.current instanceof HTMLElement)
      //@ts-ignore
      setController(autoAnimate(element.current, options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [element, setEnabled];
}

export { useAutoAnimate };
