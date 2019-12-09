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
    <table className="board">
      {rows.map((row, x) => (
        <tr key={x}>
          {row.map(cell => (
            <td key={`${cell.x}-${cell.y}`}>
              <Cell {...{ cell, onClick, isActive: isActive(cell) }} />
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export function mapBoard(rows, fn) {
  return rows.map(cells => cells.map(fn));
}
