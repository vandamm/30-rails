import React from "react";
import classNames from "classnames";
import "./Cell.css";

export default function Cell(props) {
  const { cell, onClick } = props;
  const classes = classNames([
    "cell",
    cell.type && cell.type.toLowerCase(),
    {
      selected: props.isActive,
      border: cell.isBorder,
      flipped: cell.flip,
      [`rotated-${cell.rotation}`]: cell.rotation,
      [`track track-${cell.value}`]: cell.type === "TILE"
    }
  ]);

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
