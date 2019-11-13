import React from "react";
import Cell from "./Cell";

import "./Board.css";

export default function Board(props) {
  const { rows = [], selected, updateCell: onClick } = props;

  const isActive = cell =>
    (selected === cell.x || selected === cell.y) &&
    (cell.value === undefined || cell.updated) &&
    !cell.isOccupied;

  return (
    <div className="board">
      {mapBoard(rows, cell => (
        <Cell
          key={`${cell.x}-${cell.y}`}
          {...{ cell, onClick, isActive: isActive(cell) }}
        />
      ))}
    </div>
  );
}

export function mapBoard(rows, fn) {
  return rows.map((cells, x) => cells.map((cell, y) => fn(cell, x, y)));
}
