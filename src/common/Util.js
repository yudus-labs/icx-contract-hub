import React from "react";

import "./css/common.css";

export function HorizonalSeparator(props) {
  return <div className="horizonal-separator" style={{ width: props.width }} />;
}

export function VerticalSeparator(props) {
  return <div className="vertical-separator" style={{ height: props.height }} />;
}
