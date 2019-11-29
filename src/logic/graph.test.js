import Node from "./node";
import { buildGraph } from "./graph";

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
  const first = matrix([1, 2], [2, 1]);
  const second = matrix([1, 0], [1, 2]);

  first[1][2].linkWith(first[2][1]);
  second[1][0].linkWith(second[1][2]);

  const graph = buildGraph([[first, second]]);

  expect(graph.length).toEqual(3);
  expect(graph[0].connections).toContain(graph[1]);
  expect(graph[0].connections).toContain(graph[2]);
});

/**
 * Create matrix with nodes at specified positions
 * @param  {...Number[]} nodes
 * @returns {Node[][]}
 */
function matrix(...nodes) {
  const matrix = [new Array(3), new Array(3), new Array(3)];

  for (const [x, y] of nodes) matrix[x][y] = new Node();

  return matrix;
}