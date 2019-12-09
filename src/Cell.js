import React from "react";
import "./Cell.css";

export default function Cell(props) {
  const { cell, onClick, isActive } = props;
  const classes = getClasses({ ...cell, isActive });

  return (
    <div className={classes} onClick={() => onClick(cell)}>
      {getContent(cell)}
    </div>
  );
}

function getContent(cell) {
  switch (cell.type) {
    case "STATION":
      return (
        <div className="station">
          <div className="circle">{cell.value}</div>
        </div>
      );
    case "MOUNTAIN":
      return <div className="mountain">⛰</div>;
    case "MINE":
      return <div className="mine">⚒️</div>;
    default:
      return "";
  }
}

function getClasses(cell) {
  return [
    "cell",
    cell.isActive && "selected",
    cell.isBorder && "border",
    cell.rotation && `rotated-${cell.rotation}`,
    cell.flip && "flipped",
    cell.type === "TILE" && `track track-${cell.value}`
  ]
    .filter(s => s)
    .join(" ");
}
