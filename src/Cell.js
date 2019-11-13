import React from "react";
import "./Cell.css";

export default function Cell(props) {
  const { value, onClick, selected, station } = props;

  const noValue = value === undefined;
  const isActive =
    (selected === props.x || selected === props.y) &&
    (noValue || props.updated);

  const classes = [
    "cell",
    isActive ? "selected" : "",
    noValue ? "empty" : "",
    props.isBorder ? "border" : "",
    cellClass(props)
  ].filter(s => s);

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      {station ? <div className="circle">{station}</div> : value}
    </div>
  );
}

function cellClass({ type = "" }) {
  return type.toLowerCase();
}
