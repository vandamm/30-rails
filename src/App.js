import React, { useState } from "react";
import Board, { mapBoard } from "./Board";
import Dice, { getRollResult } from "./Dice";
import { maxRotation, canFlip } from "./logic/tile";

import "./App.css";

function App() {
  const [rows, setRows] = useState(initBoard());
  const [positionDie, setPositionDie] = useState();
  const [tileDie, setTileDie] = useState();
  const [placed, setPlaced] = useState(true);
  const [round, setRound] = useState(0);

  const min = 1;
  const max = 6;
  const dice = [{ value: positionDie }, { value: tileDie, css: "track" }];

  return (
    <div className="App">
      <Board {...{ rows, selected: positionDie, updateCell }} />
      <Dice dice={dice} roll={rollDice} />
    </div>
  );

  function updateCell({ x, y }) {
    if ((positionDie !== x && positionDie !== y) || rows[x][y].isOccupied)
      return;

    setPlaced(true);

    setRows(
      mapBoard(rows, cell => {
        if (cell.x !== x || cell.y !== y)
          return cell.updated ? clean(cell) : cell;

        if (!cell.updated) {
          // Don't reset rotation/flip if placing same tile elsewhere
          const { rotation, flip } = findPrevious(rows);

          return { ...cell, value: tileDie, updated: true, rotation, flip };
        }

        let flip = cell.flip;
        let rotation = (cell.rotation || 0) + 90;

        if (rotation > maxRotation(tileDie)) {
          rotation = 0;
          flip = canFlip(tileDie) ? !flip : false;
        }

        console.log(
          tileDie,
          cell.rotation,
          rotation,
          maxRotation(tileDie),
          flip
        );

        return { ...cell, rotation, flip };
      })
    );
  }

  function findPrevious(rows) {
    return rows.reduce(
      (result, row) =>
        row.reduce((result, cell) => (cell.updated ? cell : result), result),
      {}
    );
  }

  function clean({ value, rotation, flip, updated, ...cell }) {
    return cell;
  }

  function rollDice() {
    if (!placed) return;

    setPositionDie(getRollResult(min, max));
    setTileDie(getRollResult(min, max));
    setPlaced(false);
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

    return {
      x,
      y,
      isOccupied,
      isBorder,
      type,
      rotation: 0,
      ...(station && { station })
    };
  });
}

function getType(cell) {
  if (cell.m) return "MOUNTAIN";
  if (cell.b) return "BONUS";
  if (cell.mine) return "MINE";
  if (cell.s) return "STATION";
}
