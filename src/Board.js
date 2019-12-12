import React from "react";
import Cell from "./Cell";

import "./Board.css";

export default function Board(props) {
  const { rows = [], selected, updateCell: onClick } = props;
  const isAvailable = availabilityChecker(rows, selected);

  return (
    <table className="board">
      <tbody>
        {rows.map((row, x) => (
          <tr key={x}>
            {row.map(cell => (
              <td key={`${cell.x}-${cell.y}`}>
                <Cell {...{ cell, onClick, isAvailable: isAvailable(cell) }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function availabilityChecker(rows, selected) {
  const anywhere = !hasValidPlacement(rows, selected);

  return cell => isAvailable(cell, selected, anywhere);
}

function isAvailable(cell, selected, anywhere) {
  if (!selected || cell.isOccupied) return false;
  return anywhere || selected === cell.x || selected === cell.y;
}

export function mapBoard(rows, fn) {
  return rows.map(cells => cells.map(fn));
}

export function hasValidPlacement(rows, selected) {
  for (const row of rows) {
    for (const cell of row) {
      if (isAvailable(cell, selected)) return true;
    }
  }
}

/*

.tile path {
  fill: transparent;
  stroke: #000;
  stroke-width: 6px;
}

<svg class="tile" viewBox="0 0 50 50">
  <g transform="rotate(90 25 25)">
    <path d="M 25 0 Q 25 25 0 25 L 50 25" />
  </g>
</svg>

*/
