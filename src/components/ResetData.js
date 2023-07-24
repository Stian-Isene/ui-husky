import React, { useContext } from "react";
import { RobotDataContext } from "./RobotDataContext";

/* The `ResetData` function is a React component that returns a button element with an `onClick` event
handler that calls the `handleReset` function. The `handleReset` function uses the `setMarkerPos`
and `setMarkerPath` functions from the `RobotDataContext` to reset the marker position and path to
their initial values. 
This component is used to remove markers from a map. */
function ResetData() {
  // Next line is used to disable the eslint warning about unused variables. Remove it when you start using these variables.
  // eslint-disable-next-line
  const { markerPos, setMarkerPos, markerPath, setMarkerPath } = useContext(RobotDataContext);

  const handleReset = () => {
    setMarkerPos(null);
    setMarkerPath([]);
  };

  return (
    <button onClick={handleReset} class="btn btn-warning" type="button">Remove markers</button>
  );
}

export default ResetData;