import * as React from "react";

export const useIsOverflow = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (value: boolean) => void
) => {
  const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(
    undefined
  );

  React.useLayoutEffect(() => {
    const { current } = ref;
    let trigger: () => void | undefined;
    if (current) {
      trigger = () => {
        const hasOverflow = current.scrollWidth > current.clientWidth;
        setIsOverflow(hasOverflow);

        if (callback) {
          callback(hasOverflow);
        }
      };
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
