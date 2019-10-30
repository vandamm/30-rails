import React from "react";
import Cell from "./Cell";

import "./Board.css";

export default function Board(props) {
  const { rows = [], selected, updateCell } = props;

  return (
    <div className="board">
      {mapBoard(rows, cell => (
        <Cell
          key={`${cell.x}-${cell.y}`}
          onClick={() => updateCell(cell)}
          {...{ ...cell, selected }}
        />
      ))}
    </div>
  );
}

export function mapBoard(rows, fn) {
  return rows.map((cells, x) => cells.map((cell, y) => fn(cell, x, y)));
}
