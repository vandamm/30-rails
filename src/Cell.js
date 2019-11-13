import React from "react";
import "./Cell.css";

export default function Cell(props) {
  const { cell, onClick, isActive } = props;

  const classes = [
    "cell",
    isActive ? "selected" : "",
    cell.isBorder ? "border" : "",
    cellClass(cell)
  ].filter(s => s);

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      {cell.station ? <div className="circle">{cell.station}</div> : cell.value}
    </div>
  );
}

function cellClass({ type = "" }) {
  return type.toLowerCase();
}
