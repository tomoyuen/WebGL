let identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

function mutiplyMatrixAndPoint(matrix, point) {
  // give a simple letiable name to each part of the matrix, a column and row number
  let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
  let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
  let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
  let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

  // now set some simple names for the point
  let x = point[0];
  let y = point[1];
  let z = point[2];
  let w = point[3];

  let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
  let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
  let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
  let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

  return [resultX, resultY, resultZ, resultW];
}

console.log(mutiplyMatrixAndPoint(identityMatrix, [4, 3, 2, 1]));

function mutiplyMatrices(matrixA, matrixB) {
  // slice the second matrix up into columns
  let column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
  let column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
  let column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
  let column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];

  // multiply each column by the matrix
  let result0 = mutiplyMatrixAndPoint(matrixA, column0);
  let result1 = mutiplyMatrixAndPoint(matrixA, column1);
  let result2 = mutiplyMatrixAndPoint(matrixA, column2);
  let result3 = mutiplyMatrixAndPoint(matrixA, column3);

  // turn the result columns back into a single matrix
  return [
    result0[0], result1[0], result2[0], result3[0],
    result0[1], result1[1], result2[1], result3[1],
    result0[2], result1[2], result2[2], result3[2],
    result0[3], result1[3], result2[3], result3[3],
  ];
}

let someMatrix = [
  4, 0, 0, 0,
  0, 3, 0, 0,
  0, 0, 5, 0,
  4, 8, 4, 1
];

console.log(mutiplyMatrices(identityMatrix, someMatrix));
