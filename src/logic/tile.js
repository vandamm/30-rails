const TILES = {
  // ⌜
  1: {
    maxRotation: 270
  },
  // |
  2: {
    maxRotation: 90
  },
  // ⌟⌜
  3: {
    maxRotation: 90
  },
  // +
  4: {
    maxRotation: 0
  },
  // ⌝⌜
  5: {
    maxRotation: 270
  },
  // ⌝|
  6: {
    maxRotation: 270,
    canFlip: true
  }
};

export function maxRotation(tile) {
  return TILES[tile].maxRotation;
}

export function canFlip(tile) {
  return TILES[tile].canFlip || false;
}
