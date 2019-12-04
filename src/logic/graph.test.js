import Node from "./node";
import { buildGraph, findRoutes } from "./graph";

it("flattens all nodes into single graph", () => {
  const graph = buildGraph([
    [matrix([1, 0], [1, 2], [2, 1]), matrix([1, 2], [2, 1])]
  ]);

  expect(graph.length).toEqual(5);
});

it("replaces nodes in overlapping positions", () => {
  const graph = buildGraph([
    [matrix(), matrix([2, 1])],
    [matrix([1, 2]), matrix([0, 1], [1, 0], [1, 2], [2, 1]), matrix([1, 0])],
    [matrix(), matrix([0, 1])]
  ]);

  expect(graph.length).toEqual(4);
});

it("merges connections from one node to another", () => {
  const a = matrix([1, 2], [2, 1]);
  const b = matrix([1, 0], [1, 2]);

  a[1][2].linkWith(a[2][1]);
  b[1][0].linkWith(b[1][2]);

  const graph = buildGraph([[a, b]]);

  expect(graph.length).toEqual(3);
  expect(graph[0].connections).toContain(graph[1]);
  expect(graph[0].connections).toContain(graph[2]);
});

it("finds a route between graph nodes", () => {
  const a = matrix("A", [1, 0], [1, 2]);
  const b = matrix("B", [1, 0], [1, 2]);
  const c = matrix("C", [1, 0], [1, 2]);

  const graph = buildGraph([[a, b, c]]);

  const start = graph.find(n => n.is({ id: "A0" }));
  const end = graph.find(n => n.is({ id: "C1" }));

  const routes = findRoutes(start, end);

  expect(routes).toHaveLength(1);
  expect(routes[0]).toEqual(
    expect.arrayContaining([start, a[1][2], b[1][2], end])
  );
});

/**
 * Create matrix with nodes at specified positions
 *
 * @param {String} [name]
 * @param  {...Number[]} nodes
 * @returns {Node[][]}
 */
function matrix(name, ...nodes) {
  if (Array.isArray(name)) {
    nodes = [name, ...nodes];
    name = "";
  }

  const matrix = [new Array(3), new Array(3), new Array(3)];

  let i = 0;
  for (const [x, y] of nodes) matrix[x][y] = new Node(null, `${name}${i++}`);

  return matrix;
}
