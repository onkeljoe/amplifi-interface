import React, { useCallback, useContext } from "react";
import { ShepherdTourContext } from "react-shepherd";

export default () => {
  const tour = useContext(ShepherdTourContext);
  const startTour = useCallback(() => {
    tour?.start()
  }, [tour])
  return {
    tour,
    startTour
  }
}