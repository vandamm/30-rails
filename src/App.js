import React, { useState } from "react";
import Board, { mapBoard } from "./Board";
import Dice, { getRollResult } from "./Dice";

import "./App.css";

function App() {
  const [rows, setRows] = useState(initBoard());
  const [selected, setSelected] = useState();
  const [tile, setTile] = useState();

  const min = 1;
  const max = 6;
  const dice = [{ value: selected }, { value: tile, css: "track" }];

  return (
    <div className="App">
      <Board {...{ rows, selected, updateCell }} />
      <Dice dice={dice} roll={rollDice} />
    </div>
  );

  function updateCell({ x, y }) {
    const clicked = rows[x][y];
    if (
      (selected !== x && selected !== y) ||
      clicked.value !== undefined ||
      clicked.isOccupied
    )
      return;

    setRows(
      mapBoard(rows, cell => {
        if (selected !== cell.x && selected !== cell.y) return cell;

        if (cell.x === x && cell.y === y)
          return { ...cell, value: tile, updated: true };

        if (!cell.updated) return cell;

        const { value, updated, ...rest } = cell;

        return rest;
      })
    );
  }

  function rollDice() {
    setSelected(getRollResult(min, max));
    setTile(getRollResult(min, max));
    setRows(
      mapBoard(rows, ({ updated, ...cell }) => ({
        ...cell,
        // Set "occupied" flag so this cell cannot be changed any more
        ...(updated && { isOccupied: true })
      }))
    );
  }
}

export default App;

function initBoard() {
  return [
    [{}, {}, {}, { s: 1 }, {}, {}, {}, {}],
    [{}, {}, { m: true }, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, { m: true }, {}, {}],
    [{ s: 2 }, {}, {}, {}, { b: true }, {}, {}, {}],
    [{}, {}, {}, { m: true }, { mine: true }, {}, {}, { s: 4 }],
    [{}, {}, {}, {}, {}, {}, { m: true }, {}],
    [{}, {}, {}, {}, {}, { m: true }, {}, {}],
    [{}, {}, {}, { s: 3 }, {}, {}, {}, {}]
  ].map(setupBoard);
}

function setupBoard(row, x) {
  return row.map((cell, y) => {
    const { s: station, m: mountain, mine } = cell;

    const borders = [0, 7];
    const isBorder = borders.includes(x) || borders.includes(y);
    const isOccupied = isBorder || station > 0 || mountain || mine;
    const type = getType(cell);

    return { x, y, isOccupied, isBorder, type, ...(station && { station }) };
  });
}

function getType(cell) {
  if (cell.m) return "MOUNTAIN";
  if (cell.b) return "BONUS";
  if (cell.mine) return "MINE";
  if (cell.s) return "STATION";
}
