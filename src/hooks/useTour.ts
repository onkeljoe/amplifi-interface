import React, { useCallback, useContext } from "react";
import { ShepherdTourContext } from "react-shepherd";

export default () => {
  const tour = useContext(ShepherdTourContext);
  const startTour = useCallback(() => {
    if (tour) {
      tour.start()
    } else {
      console.error('ShepherdTour is undefined!')
    }
  }, [tour])
  return {
    tour,
    startTour
  }
}