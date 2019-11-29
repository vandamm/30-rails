const topNode = node(0, 1);
const leftNode = node(1, 0);
const rightNode = node(1, 2);
const bottomNode = node(2, 1);

/**
 * Build a graph of connected nodes from matrix of node matrices
 * Mutates nodes for easier operating
 *
 * @param {Array} matrix
 * @returns {Node[]}
 */
export function buildGraph(matrix) {
  let graph = [];

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

function node(x, y) {
  return matrix => (matrix && matrix[x] ? matrix[x][y] : void 0);
}

function merge(from, to) {
  if (!from) return to;
  if (!to) return from;

  return from.replaceWith(to);
}
