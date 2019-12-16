import Node, { Identity } from "./node";
import { Matrix } from "./matrix";

export type Graph = Node[];
export type Route = Node[];

const topNode = node(0, 1);
const leftNode = node(1, 0);
const rightNode = node(1, 2);
const bottomNode = node(2, 1);

/**
 * Build a graph of connected nodes from matrix of node matrices
 * Mutates nodes for easier operating
 */
export function buildGraph(matrix: Matrix): Graph {
  let graph: Graph = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j];

      if (!item) continue;

      const topNeighbour = node(i - 1, j)(matrix);
      const leftNeighbour = node(i, j - 1)(matrix);

      // Top and left nodes of matrix can intersect with nodes
      // from previous rows and columns so we need to merge them
      const top = merge(topNode(item), bottomNode(topNeighbour));
      const left = merge(leftNode(item), rightNode(leftNeighbour));
      const right = rightNode(item);
      const bottom = bottomNode(item);

      for (const node of [top, left, right, bottom]) {
        if (node && !graph.includes(node)) {
          graph.push(node);
        }
      }
    }
  }

  return graph;
}

/**
 * Return a function that gets a node from matrix by coordinates
 */
function node(x: number, y: number) {
  return (matrix?: Matrix) => (matrix && matrix[x] ? matrix[x][y] : void 0);
}

/**
 * Merge first node into second and return the result
 */
function merge(from: Node, to: Node): Node {
  if (!from) return to;
  if (!to) return from;

  return from.replaceWith(to);
}

/**
 * Search for all routes between nodes from and to
 * Expects them to be connected
 */
export function findRoutes(from?: Node, to?: Node): Route[] {
  if (!from || !to) return [];

  return search(from, to);

  function search(
    from: Node,
    to: Node,
    route = [from],
    visited = [from]
  ): Route[] {
    const routes = [];

    for (const node of from.connections) {
      if (visited.includes(node)) continue;

      if (node === to) {
        visited.push(to);

        routes.push([...route, node]);
      } else {
        const result = search(node, to, [...route, node], [...visited, node]);

        if (result) routes.push(...result);
      }
    }

    return routes;
  }
}

export function findNode(graph: Graph, identity: Identity) {
  return graph.find(node => node.is(identity));
}
