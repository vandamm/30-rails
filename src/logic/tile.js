import Node from "./node";

const MATRIX = [[0, 1, 0], [2, 0, 3], [0, 4, 0]];
const SIZE = 3;
const TILES = {
  // ⌜
  1: {
    maxRotation: 270,
    connections: [[3, 4]]
  },
  // |
  2: {
    maxRotation: 90,
    connections: [[1, 4]]
  },
  // ⌟⌜
  3: {
    maxRotation: 90,
    connections: [[1, 2], [3, 4]]
  },
  // +
  4: {
    maxRotation: 0,
    connections: [[1, 4], [2, 3]]
  },
  // ⌝⌜
  5: {
    maxRotation: 270,
    connections: [[2, 4], [3, 4]]
  },
  // ⌝|
  6: {
    maxRotation: 270,
    canFlip: true,
    connections: [[1, 4], [2, 4]]
  }
};

const TILE_TYPES = {
  TILE: {
    matrix: ({ value }) => connect(TILES[value].connections)
  },
  STATION: {
    matrix({ value, x, y }) {
      const node = new Node("STATION", value);
      const matrix = [new Array(3), new Array(3), new Array(3)];

      if (x === 0) matrix[2][1] = node;
      else if (y === 0) matrix[1][2] = node;
      else if (x > y) matrix[0][1] = node;
      else matrix[1][0] = node;

      return matrix;
    }
  },
  MINE: {
    matrix() {
      return [
        [null, new Node("MINE"), null],
        [new Node("MINE"), null, new Node("MINE")],
        [null, new Node("MINE"), null]
      ];
    }
  }
};

export function maxRotation(tile) {
  return TILES[tile].maxRotation;
}

export function canFlip(tile) {
  return TILES[tile].canFlip || false;
}

export function getNodes(tile) {
  const { type, rotation, flip } = tile;
  const config = TILE_TYPES[type];

  if (!config) return;

  return transform({ rotation, flip }, config.matrix(tile));
}

function connect(connections) {
  const nodes = [0, 1, 2, 3, 4].map(() => new Node("TILE"));

  for (const [left, right] of connections) nodes[left].linkWith(nodes[right]);

  return MATRIX.map(row => {
    return row.map(num => (num > 0 ? nodes[num] : null));
  });
}

function transform(params, matrix) {
  return rotate(params.rotation, params.flip ? flip(matrix) : matrix);
}

function flip(matrix) {
  let result = [];

  for (let i = 0; i < SIZE; i++) {
    result[i] = [...matrix[i]].reverse();
  }

  return result;
}

function rotate(angle, matrix) {
  let result = matrix;

  for (let i = 0; i < angle; i += 90) result = rotate90(result);

  return result;
}

function rotate90(matrix) {
  let result = [];

  for (let i = 0; i < SIZE; i++) {
    result[i] = [];

    for (let j = 0; j < SIZE; j++) {
      result[i][j] = matrix[SIZE - j - 1][i];
    }
  }

  return result;
}
