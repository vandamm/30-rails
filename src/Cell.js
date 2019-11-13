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
      {getContent(cell)}
    </div>
  );
}

function getContent(cell) {
  if (cell.station) return <div className="circle">{cell.station}</div>;
  if (cell.type === "MOUNTAIN") return "⛰";
  if (cell.type === "MINE") return "⚒️";
  return cell.value;
}

function cellClass({ type = "" }) {
  return type.toLowerCase();
}
