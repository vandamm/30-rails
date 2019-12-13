import Node from "./node";
import { Matrix, transform } from "./matrix";

export type TileType = "TILE" | "MINE" | "STATION" | "MOUNTAIN";
export interface Tile {
  value: number;
  type: TileType;
  rotation: number;
  flip?: boolean;
  x: number;
  y: number;
}
type NodeIndexPair = [number, number];
interface TileConfig {
  maxRotation: number;
  connections: NodeIndexPair[];
  canFlip?: boolean;
}

const MATRIX: Matrix = [
  [0, 1, 0],
  [2, 0, 3],
  [0, 4, 0]
];
const TILES: { [key: string]: TileConfig } = {
  // ⌜
  "1": {
    maxRotation: 270,
    connections: [[3, 4]]
  },
  // |
  "2": {
    maxRotation: 90,
    connections: [[1, 4]]
  },
  // ⌟⌜
  "3": {
    maxRotation: 90,
    connections: [
      [1, 2],
      [3, 4]
    ]
  },
  // +
  "4": {
    maxRotation: 0,
    connections: [
      [1, 4],
      [2, 3]
    ]
  },
  // ⌝⌜
  "5": {
    maxRotation: 270,
    connections: [
      [2, 4],
      [3, 4]
    ]
  },
  // ⌝|
  "6": {
    maxRotation: 270,
    canFlip: true,
    connections: [
      [1, 4],
      [2, 4]
    ]
  }
};

const TILE_MATRICES: { [key in TileType]?: (tile: Tile) => Matrix } = {
  TILE: tile => connect(TILES[tile.value].connections),
  STATION: tile => {
    const { value, x, y } = tile;
    const node = new Node("STATION", value);
    const matrix = [new Array(3), new Array(3), new Array(3)];

    if (x === 0) matrix[2][1] = node;
    else if (y === 0) matrix[1][2] = node;
    else if (x > y) matrix[0][1] = node;
    else matrix[1][0] = node;

    return matrix;
  },
  MINE: () => {
    return [
      [null, new Node("MINE", 1), null],
      [new Node("MINE", 2), null, new Node("MINE", 3)],
      [null, new Node("MINE", 4), null]
    ];
  }
};

export function maxRotation(tile: string): number {
  return TILES[tile].maxRotation;
}

export function canFlip(tile: string): boolean {
  return TILES[tile].canFlip || false;
}

export function getNodes(tile: Tile) {
  const { type, rotation, flip } = tile;
  const matrix = TILE_MATRICES[type];

  if (!matrix) return;

  return transform({ rotation, flip }, matrix(tile));
}

function connect(connections: NodeIndexPair[]): Matrix {
  const nodes = [0, 1, 2, 3, 4].map(() => new Node("TILE"));

  for (const [left, right] of connections) nodes[left].linkWith(nodes[right]);

  return MATRIX.map(row => {
    return row.map(num => (num > 0 ? nodes[num] : null));
  });
}
