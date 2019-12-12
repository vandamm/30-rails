import React from "react";
import { getNodes } from "./logic/tile";
import { buildGraph, findNode, findRoutes } from "./logic/graph";

import "./ScoreTable.css";

const station = id => ({ type: "STATION", id });

const STATION_ROUTES = [
  { from: station(1), to: station(2), routeBonus: 1 },
  { from: station(1), to: station(3), routeBonus: 2 },
  { from: station(1), to: station(4), routeBonus: 3 },
  { from: station(2), to: station(3), routeBonus: 3 },
  { from: station(2), to: station(4), routeBonus: 4 },
  { from: station(3), to: station(4), routeBonus: 5 }
];
const MINE_POINTS = [2, 6, 12, 20];

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
  const mineConnections = getMineConnections(graph);
  const total =
    rows.reduce((sum, { total = 0 }) => sum + total, 0) +
    (MINE_POINTS[mineConnections - 1] || 0);

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
          <tr>
            <td colSpan="5" className="spacer"></td>
          </tr>
          <tr>
            <td>M</td>
            {MINE_POINTS.map((value, index) => (
              <td
                key={index}
                className={index >= mineConnections ? "inactive" : ""}
              >
                {value}
              </td>
            ))}
          </tr>
          <tr>
            <td colSpan="5" className="spacer"></td>
          </tr>
          <tr>
            <td colSpan="3" className="spacer"></td>
            <td>∑</td>
            <td className="total">{total || ""}</td>
          </tr>
        </tbody>
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

function getMineConnections(graph) {
  const mines = graph.filter(node => node.is({ type: "MINE" }));
  const stations = [1, 2, 3, 4].map(id => findNode(graph, station(id)));

  const connected = [];

  for (const station of stations) {
    if (connected.includes(station.id)) continue;

    for (const mine of mines) {
      const routes = findRoutes(mine, station);

      if (routes.length) {
        connected.push(station.id);
        break;
      }
    }
  }

  return connected.length;
}
