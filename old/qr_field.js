function createGaloisField(modulo) {
  const size = 255;
  const logTable = new Array(size);
  const expTable = new Array(size);
  let x = 1;

  for (let i = 0; i < size; i++) {
    expTable[i] = x;
    logTable[x] = i;
    x = x * 2;
    if (x >= size) {
      x = x ^ modulo;
    }
  }

  return { logTable, expTable };
}
const { logTable, expTable } = createGaloisField(285);

function galoisMultiply(a, b) {
  if (a === 0 || b === 0) {
    return 0;
  }
  const logA = logTable[a];
  const logB = logTable[b];
  const logResult = (logA + logB) % 255;
  return expTable[logResult];
}

function galoisDivide(a, b) {
  if (a === 0) {
    return 0;
  }
  if (b === 0) {
    throw new Error("Division by zero");
  }
  const logA = logTable[a];
  const logB = logTable[b];
  const logResult = (logA - logB + 255) % 255;
  return expTable[logResult];
}

// Example usage:
console.log(galoisMultiply(2, 3)); // Output: 6
console.log(galoisDivide(6, 2)); // Output: 3

console.log(galoisMultiply(2, 3)); // Output: 6
console.log(galoisMultiply(127, 100)); // Output: 12

console.log(galoisDivide(6, 2)); // Output: 3
console.log(galoisDivide(12, 127)); // Output: 100

const polyA = [1, 2, 3];
const polyB = [1, 1];
console.log(multiplyPolynomials(polyA, polyB)); // Output: [1, 3, 1, 3]



function multiplyPolynomials(a, b) {
  const result = new Array(a.length + b.length - 1).fill(0);

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const product = galoisMultiply(a[i], b[j]);
      result[i + j] ^= product;
    }
  }

  return result;
}

function createGeneratorPolynomial(eccCodewords) {
  let generator = [1];
  for (let i = 0; i < eccCodewords; i++) {
    generator = multiplyPolynomials(generator, [1, expTable[i]]);
  }
  return generator;
}

function polynomialLongDivision(dividend, divisor) {
  let remainder = [...dividend];

  for (let i = 0; i < dividend.length - divisor.length + 1; i++) {
    const ratio = galoisDivide(remainder[i], divisor[0]);
    for (let j = 0; j < divisor.length; j++) {
      remainder[i + j] ^= galoisMultiply(divisor[j], ratio);
    }
  }

  return remainder.slice(dividend.length - divisor.length + 1);
}

// polynomialLongDivision(mine.concat(Array(10).fill(0)),createGeneratorPolynomial(10),logTable,expTable).join() == "196,35,39,119,235,215,231,226,93,23")

function calculateErrorCorrectionCodewords(data, eccCodewords) {
  const generator = createGeneratorPolynomial(eccCodewords);
  const paddedData = data.concat(Array(eccCodewords).fill(0));
  const remainder = polynomialLongDivision(paddedData, generator);
  return remainder;
}


console.log()
console.log(createGeneratorPolynomial(2).map(a=>logTable[a]))
console.log(createGeneratorPolynomial(3).map(a=>logTable[a]))
console.log(createGeneratorPolynomial(10).map(a=>logTable[a]))


























