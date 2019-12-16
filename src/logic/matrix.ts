// TODO: Figure out if I can find a better typing for matrices
export type Matrix = any[][];

interface TransformParams {
  rotation: number;
  flip?: boolean;
}

const SIZE = 3;

export function transform(params: TransformParams, matrix: Matrix): Matrix {
  return rotate(params.rotation, params.flip ? flip(matrix) : matrix);
}

function flip(matrix: Matrix): Matrix {
  let result = [];

  for (let i = 0; i < SIZE; i++) {
    result[i] = [...matrix[i]].reverse();
  }

  return result;
}

function rotate(angle: number, matrix: Matrix): Matrix {
  let result = matrix;

  for (let i = 0; i < angle; i += 90) result = rotate90(result);

  return result;
}

function rotate90(matrix: Matrix): Matrix {
  let result: Matrix = [];

  for (let i = 0; i < SIZE; i++) {
    result[i] = [];

    for (let j = 0; j < SIZE; j++) {
      result[i][j] = matrix[SIZE - j - 1][i];
    }
  }

  return result;
}
