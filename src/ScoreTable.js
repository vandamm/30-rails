import React from "react";
import "./ScoreTable.css";
import { getNodes } from "./logic/tile";
import { buildGraph, findNode, findRoutes } from "./logic/graph";

const station = id => ({ type: "STATION", id });

const STATION_ROUTES = [
  { from: station(1), to: station(2), routeBonus: 1 },
  { from: station(1), to: station(3), routeBonus: 2 },
  { from: station(1), to: station(4), routeBonus: 3 },
  { from: station(2), to: station(3), routeBonus: 3 },
  { from: station(2), to: station(4), routeBonus: 4 },
  { from: station(3), to: station(4), routeBonus: 5 }
];

const STATION_ICONS = {
  1: "\u2460",
  2: "\u2461",
  3: "\u2462",
  4: "\u2463"
};

const stationIcon = ({ id }) => STATION_ICONS[id];

export default function ScoreTable(props) {
  const graph = buildGraph(props.rows.map(row => row.map(getNodes)));
  const rows = STATION_ROUTES.map(params => calculatePoints(graph, params));

  return (
    <div className="score-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="star">⍟</th>
            <th>□□</th>
            <th>+2</th>
            <th>∑</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                {stationIcon(row.from)}–{stationIcon(row.to)}
              </td>
              <td className={row.total ? "" : "inactive"}>{row.routeBonus}</td>
              <td>{row.lengthBonus}</td>
              <td>{row.squareBonus}</td>
              <td className="total">{row.total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Total</td>
            <td className="total">
              {rows.reduce((sum, value = 0) => sum + value, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function calculatePoints(graph, params) {
  const { from, to, routeBonus } = params;
  const start = findNode(graph, from);
  const end = findNode(graph, to);
  const routes = findRoutes(start, end);

  if (!routes.length) return { ...params };

  const sorted = routes.sort((a, b) => b.length - a.length);
  const [longest] = sorted;

  const lengthBonus = longest.length - 1;
  const squareBonus = longest.find(node => node.is({ type: "BONUS" })) ? 2 : 0;

  return {
    ...params,
    lengthBonus,
    squareBonus,
    total: routeBonus + lengthBonus + squareBonus
  };
}
