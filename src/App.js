import React, { useState } from "react";
import Board, { mapBoard } from "./Board";
import Dice, { getRollResult } from "./Dice";

import "./App.css";

function App() {
  const [rows, setRows] = useState(initRows(6, 6));
  const [selected, setSelected] = useState();
  const [tile, setTile] = useState();

  const min = 0;
  const max = 5;
  const dice = [{ value: selected }, { value: tile }];

  return (
    <div className="App">
      <Board {...{ rows, selected, updateCell }} />
      <Dice dice={dice} roll={rollDice} />
    </div>
  );

  function updateCell({ x, y }) {
    if (rows[x][y].value !== undefined) return;

    setRows(
      mapBoard(rows, (cell, cellX, cellY) => {
        if (selected !== cellX && selected !== cellY) return cell;

        if (cellX === x && cellY === y)
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
    setRows(mapBoard(rows, ({ updated, ...cell }) => cell));
  }
}

export default App;

function initRows(width, height) {
  return Array.from(Array(height)).map((_, x) =>
    Array.from(Array(width)).map((_, y) => ({ x, y }))
  );
}
