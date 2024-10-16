const transpose = (arr) => {let ret = []; arr[0].forEach((v,i)=>ret.push(arr.map(a=>a[i])));return ret};
const clone = a=>JSON.parse(JSON.stringify(a));
const alignmentPatternLookupTable = [
  /*00s*/  [],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],
  /*10s*/ [6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],
  /*20s*/ [6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],
  /*30s*/ [6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],
  /*40s*/ [6,30,58,86,114,142,170]]

const errorCorrectionLookupTable = {
    "L": [[], [19, 7,1,19,0,0,19], [34,10,1,34,0,0,34], [55,15,1,55,0,0,55], [80,20,1,80,0,0,80], [108,26,1,108,0, 0,108], [136,18,2,68,0,0,136], [156,20,2,78,0, 0,156], [194,24,2,97,0, 0,194], [232,30,2,116,0, 0,232], [274,18,2,68,2,69,274], [324,20,4,81,0, 0,324], [370,24,2,92,2,93,370], [428,26, 4,107,0, 0,428], [461,30, 3,115,1,116,461], [523,22, 5,87,1,88,523], [589,24, 5,98, 1,99,589], [647,28, 1,107, 5,108,647], [721,30, 5,120, 1,121,721], [795,28, 3,113, 4,114,795], [861,28, 3,107, 5,108,861], [932,28, 4,116,4,117,932], [1006,28, 2,111, 7,112,1006], [1094,30, 4,121, 5,122,1094], [1174,30, 6,117, 4,118,1174], [1276,26, 8,106, 4,107,1276], [1370,28,10,114,2,115,1370], [1468,30, 8,122, 4,123,1468], [1531,30, 3,117,10,118,1531], [1631,30, 7,116, 7,117,1631], [1735,30, 5,115,10,116,1735], [1843,30,13,115, 3,116,1843], [1955,30,17,115, 0, 0,1955], [2071,30,17,115, 1,116,2071], [2191,30,13,115, 6,116,2191], [2306,30,12,121, 7,122,2306], [2434,30, 6,121,14,122,2434], [2566,30,17,122, 4,123,2566], [2702,30, 4,122,18,123,2702], [2812,30,20,117, 4,118,2812], [2956,30,19,118, 6,119,2956] ],
    "M": [[], [16,10,1,16,0,0,16], [28,16,1,28,0,0,28], [44,26,1,44,0,0,44], [64,18,2,32,0,0,64], [ 86,24,2, 43,0, 0, 86], [108,16,4,27,0,0,108], [124,18,4,31,0, 0,124], [154,22,2,38,2,39,154], [182,22,3, 36,2,37,182], [216,26,4,43,1,44,216], [254,30,1,50,4,51,254], [290,22,6,36,2,37,290], [334,22, 8, 37,1,38,334], [365,24, 4, 40,5, 41,365], [415,24, 5,41,5,42,415], [453,28, 7,45, 3,46,453], [507,28,10, 46, 1, 47,507], [563,26, 9, 43, 4, 44,563], [627,26, 3, 44,11, 45,627], [669,26, 3, 41,13, 42,669], [714,26,17, 42,0,  0,714], [ 782,28,17, 46, 0,  0, 782], [ 860,28, 4, 47,14, 48, 860], [ 914,28, 6, 45,14, 46, 914], [1000,28, 8, 47,13, 48,1000], [1062,28,19, 46,4, 47,1062], [1128,28,22, 45, 3, 46,1128], [1193,28, 3, 45,23, 46,1193], [1267,28,21, 45, 7, 46,1267], [1373,28,19, 47,10, 48,1373], [1455,28, 2, 46,29, 47,1455], [1541,28,10, 46,23,47,1541], [1631,28,14, 46,21, 47,1631], [1725,28,14, 46,23, 47,1725], [1812,28,12, 47,26, 48,1812], [1914,28, 6, 47,34, 48,1914], [1992,28,29, 46,14, 47,1992], [2102,28,13, 46,32, 47,2102], [2216,28,40, 47, 7, 48,2216], [2334,28,18, 47,31, 48,2334] ],
    "Q": [[], [13,13,1,13,0,0,13], [22,22,1,22,0,0,22], [34,18,2,17,0,0,34], [48,26,2,24,0,0,48], [ 62,18,2, 15,2,16, 62], [ 76,24,4,19,0,0, 76], [ 88,18,2,14,4,15, 88], [110,22,4,18,2,19,110], [132,20,4, 16,4,17,132], [154,24,6,19,2,20,154], [180,28,4,22,4,23,180], [206,26,4,20,6,21,206], [244,24, 8, 20,4,21,244], [261,20,11, 16,5, 17,261], [295,30, 5,24,7,25,295], [325,24,15,19, 2,20,325], [367,28, 1, 22,15, 23,367], [397,28,17, 22, 1, 23,397], [445,26,17, 21, 4, 22,445], [485,30,15, 24, 5, 25,485], [512,28,17, 22,6, 23,512], [ 568,30, 7, 24,16, 25, 568], [ 614,30,11, 24,14, 25, 614], [ 664,30,11, 24,16, 25, 664], [ 718,30, 7, 24,22, 25, 718], [ 754,28,28, 22,6, 23, 754], [ 808,30, 8, 23,26, 24, 808], [ 871,30, 4, 24,31, 25, 871], [ 911,30, 1, 23,37, 24, 911], [ 985,30,15, 24,25, 25, 985], [1033,30,42, 24, 1, 25,1033], [1115,30,10, 24,35,25,1115], [1171,30,29, 24,19, 25,1171], [1231,30,44, 24, 7, 25,1231], [1286,30,39, 24,14, 25,1286], [1354,30,46, 24,10, 25,1354], [1426,30,49, 24,10, 25,1426], [1502,30,48, 24,14, 25,1502], [1582,30,43, 24,22, 25,1582], [1666,30,34, 24,34, 25,1666] ],
    "H": [[], [ 9,17,1, 9,0,0, 9], [16,28,1,16,0,0,16], [26,22,2,13,0,0,26], [36,16,4, 9,0,0,36], [ 46,22,2, 11,2,12, 46], [ 60,28,4,15,0,0, 60], [ 66,26,4,13,1,14, 66], [ 86,26,4,14,2,15, 86], [100,24,4, 12,4,13,100], [122,28,6,15,2,16,122], [140,24,3,12,8,13,140], [158,28,7,14,4,15,158], [180,22,12, 11,4,12,180], [197,24,11, 12,5, 13,197], [223,24,11,12,7,13,223], [253,30, 3,15,13,16,253], [283,28, 2, 14,17, 15,283], [313,28, 2, 14,19, 15,313], [341,26, 9, 13,16, 14,341], [385,28,15, 15,10, 16,385], [406,30,19, 16,6, 17,406], [ 442,24,34, 13, 0,  0, 442], [ 464,30,16, 15,14, 16, 464], [ 514,30,30, 16, 2, 17, 514], [ 538,30,22, 15,13, 16, 538], [ 596,30,33, 16,4, 17, 596], [ 628,30,12, 15,28, 16, 628], [ 661,30,11, 15,31, 16, 661], [ 701,30,19, 15,26, 16, 701], [ 745,30,23, 15,25, 16, 745], [ 793,30,23, 15,28, 16, 793], [ 845,30,19, 15,35,16, 845], [ 901,30,11, 15,46, 16, 901], [ 961,30,59, 16, 1, 17, 961], [ 986,30,22, 15,41, 16, 986], [1054,30, 2, 15,64, 16,1054], [1096,30,24, 15,46, 16,1096], [1142,30,42, 15,32, 16,1142], [1222,30,10, 15,67, 16,1222], [1276,30,20, 15,61, 16,1276] ]
    }

const alphanumericTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

// version.binary + versionChecks[version-7]
const versionChecks = ["000111110010010100","001000010110111100","001001101010011001","001010010011010011","001011101111110110","001100011101100010","001101100001000111","001110011000001101","001111100100101000","010000101101111000","010001010001011101","010010101000010111","010011010100110010","010100100110100110","010101011010000011","010110100011001001","010111011111101100","011000111011000100","011001000111100001","011010111110101011","011011000010001110","011100110000011010","011101001100111111","011110110101110101","011111001001010000","100000100111010101","100001011011110000","100010100010111010","100011011110011111","100100101100001011","100101010000101110","100110101001100100","100111010101000001","101000110001101001"];

const formatInformation = {
      "L": ["111011111000100","111001011110011","111110110101010","111100010011101","110011000101111","110001100011000","110110001000001","110100101110110"],
      "M": ["101010000010010","101000100100101","101111001111100","101101101001011","100010111111001","100000011001110","100111110010111","100101010100000"],
      "Q": ["011010101011111","011000001101000","011111100110001","011101000000110","010010010110100","010000110000011","010111011011010","010101111101101"],
      "H": ["001011010001001","001001110111110","001110011100111","001100111010000","000011101100010","000001001010101","000110100001100","000100000111011"]
    }


// const alignmentPatternLookupTable = { 1:[], 2:[6,18], 3:[6,22] ... };
function generateQRMatrix(version) {
  const size = 21 + (version - 1) * 4;
  const matrix = new Array(size).fill(null).map(() => new Array(size).fill(undefined));

  // Set a value in the matrix, if it is not out of bounds.
  function set(x, y, value) {
    if (x>=0 && x<size && y>=0 && y<size && matrix[x][y]==undefined)
      matrix[x][y] = value;
  }

  // Fill a ring of value with radius r around (x,y).
  function ring(x,y,r,value) {
    for (let i=-r; i<=r; i++) {
      set(x-r, y+i, value);
      set(x+r, y+i, value);
    }
    for (let i=-r+1; i<r; i++) {
      set(x+i, y-r, value);
      set(x+i, y+r, value);
    }
  }

  // Helper function to draw the finder patterns
  function drawFinderPattern(x, y) {
    set (x+3,y+3,  1);
    ring(x+3,y+3,1,1);
    ring(x+3,y+3,2,0);
    ring(x+3,y+3,3,1);
    ring(x+3,y+3,4,0);
  }

  // Helper function to draw the finder patterns
  function drawAlignmentPattern(x, y) {
    set (x,y,  1);
    ring(x,y,1,0);
    ring(x,y,2,1);
  }

  // Draw finder patterns
  drawFinderPattern(0, 0);
  drawFinderPattern(size - 7, 0);
  drawFinderPattern(0, size - 7);

  // Draw timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[i][6] = !(i % 2);
    matrix[6][i] = !(i % 2);
  }

  // Draw alignment patterns
  if (version > 1) {
    const positions = alignmentPatternLookupTable[version] || [];
    const last = positions.length - 1;
    positions.forEach((x,i)=>positions.forEach((y,j)=>{
      if (!(i==0&&j==0) && !(i==0&&j==last) && !(i==last&&j==0))
        drawAlignmentPattern(x,y)
    }))
  }

  // Draw Dark-Module
  set(8,size-8,1)

  return matrix;
}


function markInfoRegions(matrix) {
  const size = matrix.length;
  const version = (size-21)/4+1;

  // Set a value in the matrix to null, if it is not out of bounds.
  function setNull(x, y, condition=true) {
    if (x>=0 && x<size && y>=0 && y<size && condition)
      matrix[x][y] = null;
  }

  // Mark format information regions
  setNull(8, 8)
  for (let i=0; i<8; i++) {
    setNull(8, i, i!=6); // Skip timing region
    setNull(i, 8, i!=6); // Skip timing region
    setNull(8, size-1-i, i!=7); // Skip dark module
    setNull(size-1-i, 8);
  }

  // Mark version information regions for version 7 and higher
  if (version >= 7) {
    for (let i=0; i<6; i++) {
      for (let j=0; j<3; j++) {
        setNull(size-11+j, i);
        setNull(i, size-11+j);
      }
    }
  }

  return matrix;
}


function dataModuleCoordinates(matrix) {
  const size = matrix.length;
  const coordinates = [];
  let direction = -1; // -1 for up, 1 for down
  let x = size - 1;
  let y = size - 1;

  while (x>0) {

    // Add next location(s)
    if (matrix[x][y] === undefined)
      coordinates.push({ x, y });
    if (matrix[x-1][y] === undefined)
      coordinates.push({ x:x-1, y });

    // Move vertically
    y += direction;

    // Switch directions at edges
    if (y < 0 || y >= size) {
      direction *= -1;
      y += direction;
      x -= 2;
      // Skip the vertical timing pattern
      if (x==6)
        x--;
    }
  }

  return coordinates;
}




// const errorCorrectionLookupTable = {"L":{1:[19, 7, 1, 19, 0, 0], ...}, "M": {...}, "Q": {...}, "H": {1:[9, 17, 1, 9, 0, 0], ...}};
// const errorCorrectionLookupTableHeaders = [
//     "Total Number of Data Codewords for this Version and EC Level",
//     "EC Codewords Per Block",
//     "Number of Blocks in Group 1",
//     "Number of Data Codewords in Each of Group 1's Blocks",
//     "Number of Blocks in Group 2",
//     "Number of Data Codewords in Each of Group 2's Blocks"
//   ];
function getMode(str){
  if (/^[0-9]*$/.test(str))
    return ["Numeric", "0001"];
  if (/^[0-9A-Z $%*+-./:]+$/.test(str))
    return ["Alphanumeric", "0010"];
  return ["Byte", "0100"];
}
function getTotalDataCodewords(version, ecc) {
  return errorCorrectionLookupTable[ecc][version][0];
}
function getMinVersionForBits(bits, ecc) {
  let minVersion = 0;
  while (++minVersion < 40) {
    if (getTotalDataCodewords(minVersion, ecc)*8 >= bits)
      return minVersion;
  }
  return minVersion;
}
function getMinVersionForData(str, mode, ecc) {
  let dataBits;
  if (mode[0] === "Numeric")
    dataBits = Math.ceil(str.length * 10 / 3);
  else if (mode[0] === "Alphanumeric")
    dataBits = Math.ceil(str.length * 11 / 2);
  else
    dataBits = str.length * 8;

  return getMinVersionForBits(dataBits, ecc);
}
// version can be specified to be a larger size than necessary if the user wants. If the version is too small,
// it will be bumped up to the smallest size that can fit that string with that level of error correction.
function getHeader(str, mode, ecc="L", version=1) {
  const minVersion = getMinVersionForData(str, mode, ecc);

  if (version<minVersion) {
    version = minVersion;
  }

  // Character count indicator
  let countBits;
  if (version<=9)
    countBits = mode[0]=="Numeric"?10:mode[0]=="Alphanumeric"?9:8;
  else if (version<=26)
    countBits = mode[0]=="Numeric"?12:mode[0]=="Alphanumeric"?11:16;
  else
    countBits = mode[0]=="Numeric"?14:mode[0]=="Alphanumeric"?13:16;

  const countIndicator = str.length.toString(2).padStart(countBits, "0");
  const header = mode[1] + countIndicator;

  return header;
}
function getEncodedData(str, mode) {
  let encodedData = [];

  if (mode[0] === "Numeric") {
    for (let i = 0; i < str.length; i += 3) {
      const chunk = str.slice(i, i+3);
      const chunkSize = chunk.length;
      const binaryChunk = parseInt(chunk).toString(2).padStart(3*chunkSize+1, "0");
      encodedData.push(binaryChunk);
    }
  } else if (mode[0] === "Alphanumeric") {
    for (let i = 0; i < str.length; i += 2) {
      const firstChar = alphanumericTable.indexOf(str[i]);
      const secondChar = alphanumericTable.indexOf(str[i+1]);
      if (secondChar == -1) {
        encodedData.push(firstChar.toString(2).padStart(6, "0"));
      } else {
        const value = 45*firstChar + secondChar;
        const binaryValue = value.toString(2).padStart(11, "0");
        encodedData.push(binaryValue);
      }
    }
  } else {
    // Byte mode
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const binaryCharCode = charCode.toString(2).padStart(8, "0");
      encodedData.push(binaryCharCode);
    }
  }

  return encodedData.join("");
}

// Not tested
function parseNumeric(binaryString, len) {
  return binaryString.slice(0,Math.floor(len/3)*10 + len%3>0?(len%3)*3+1:0).split(/(.{10})/g).filter(a=>a).map(a=>[a.length,parseInt(a,2).toString().padStart(3,"0")]).map(a=>a[1].slice((10-a.length)/3)).join("")
}
// Not tested
function parseAlphanumeric(binaryString, len) {
  return binaryString.slice(0,Math.floor(len/2)*11 + len%2>0?(len%2)*5+1:0).split(/(.{11})/g).filter(a=>a).map(a=>[a.length,parseInt(a,2)]).map(a=>a[0]==6?alphanumericTable[a[1]]:alphanumericTable[(a[1]-a[1]%45)/45]+alphanumericTable[a[1]%45]).join("")
}
function parseBinary(binaryString, len) {
  return binaryString.slice(0,len*8).split(/(.{8})/g).filter(a=>a).map(a=>parseInt(a,2)).map(a=>String.fromCharCode(a)).join("")
}




function addPadBytes(encodedData, requiredDataCodewords) {
  const requiredBits = requiredDataCodewords * 8;
  const currentBits = encodedData.length;

  // Add a terminator of 0s if necessary
  const terminatorBits = Math.min(4, requiredBits - currentBits);
  encodedData = encodedData.padEnd(currentBits + terminatorBits, '0');

  // Add more 0s to make the length a multiple of 8
  while (encodedData.length % 8 != 0) {
    const bitsToAdd = 8 - (encodedData.length%8);
    encodedData = encodedData + "0".repeat(bitsToAdd);
  }

  // Add pad bytes if the string is still too short
  const padBytesCount = (requiredBits - encodedData.length) / 8;
  const padding = ("11101100"+"00010001").repeat(padBytesCount/2) + (padBytesCount%2==1?"11101100":"");

  encodedData += padding;

  if (encodedData.length!=requiredBits)
    console.log("Bit length is not correct.");

  return encodedData.substring(0, requiredBits);
}
function createQRCodeBinaryString(str, mode, ecc = "L", version = 1) {
  // Ensure the version is large enough to hold the input string
  version = Math.max(version, getMinVersionForData(str, mode, ecc));

  // Get the header and encoded data
  const header = getHeader(str, mode, ecc, version);
  const encodedData = getEncodedData(str, mode);

  return header+encodedData;
}

// const errorCorrectionLookupTable = {"Q":{5:[62, 18, 2, 15, 2, 16], ... }, ... }




























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

// // Example usage:
// console.log(galoisMultiply(2, 3)); // Output: 6
// console.log(galoisDivide(6, 2)); // Output: 3

// console.log(galoisMultiply(2, 3)); // Output: 6
// console.log(galoisMultiply(127, 100)); // Output: 12

// console.log(galoisDivide(6, 2)); // Output: 3
// console.log(galoisDivide(12, 127)); // Output: 100

// const polyA = [1, 2, 3];
// const polyB = [1, 1];
// console.log(multiplyPolynomials(polyA, polyB)); // Output: [1, 3, 1, 3]



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
const generatedPolynomials = Array(70).fill(undefined);
function getGeneratorPolynomial(eccCodewords) {
  if (!generatedPolynomials[eccCodewords])
    generatedPolynomials[eccCodewords] = createGeneratorPolynomial(eccCodewords);
  return generatedPolynomials[eccCodewords];
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

// polynomialLongDivision(mine.concat(Array(10).fill(0)),getGeneratorPolynomial(10),logTable,expTable).join() == "196,35,39,119,235,215,231,226,93,23")

function calculateErrorCorrectionCodewords(data, eccCodewords) {
  const generator = getGeneratorPolynomial(eccCodewords);
  const paddedData = data.concat(Array(eccCodewords).fill(0));
  const remainder = polynomialLongDivision(paddedData, generator);
  return remainder;
}


// console.log()
// console.log(getGeneratorPolynomial(2).map(a=>logTable[a]))
// console.log(getGeneratorPolynomial(3).map(a=>logTable[a]))
// console.log(getGeneratorPolynomial(10).map(a=>logTable[a]))







































function divideMessageIntoBlocks(binaryString, ecc, version) {
  const info = errorCorrectionLookupTable[ecc][version];
  const group1Blocks = info[2];
  const group1DataCodewords = info[3];
  const group2Blocks = info[4];
  const group2DataCodewords = info[5];

  const blocks = [];
  let currentIndex = 0;

  for (let i = 0; i < group1Blocks; i++) {
    blocks.push(binaryString.slice(currentIndex, currentIndex + group1DataCodewords * 8));
    currentIndex += group1DataCodewords * 8;
  }

  for (let i = 0; i < group2Blocks; i++) {
    blocks.push(binaryString.slice(currentIndex, currentIndex + group2DataCodewords * 8));
    currentIndex += group2DataCodewords * 8;
  }

  return blocks;
}

function binaryStringToDataPolynomial(blockBinaryString) {
  const dataPolynomial = [];
  for (let i = 0; i < blockBinaryString.length; i += 8) {
    dataPolynomial.push(parseInt(blockBinaryString.slice(i, i + 8), 2));
  }
  return dataPolynomial;
}


function finalizeQRBinary(inputString, ecc = "L", version = 1) {
  if (!/^[01]+$/.test(inputString))
    inputString = createQRCodeBinaryString(inputString, getMode(inputString), ecc, version);

  // Calculate the required number of data codewords
  const requiredDataCodewords = getTotalDataCodewords(version, ecc);
  // Add pad bytes to the binary data
  const binaryString = addPadBytes(inputString, requiredDataCodewords);

  const dataBlocks = divideMessageIntoBlocks(binaryString, ecc, version).map(binaryStringToDataPolynomial);
  const eccCodewordCount = errorCorrectionLookupTable[ecc][version][1];
  const eccBlocks = dataBlocks.map(dataPolynomial=>
    calculateErrorCorrectionCodewords(dataPolynomial, eccCodewordCount, version)
  );
  square=mat=>{let max=mat.reduce((c,n)=>Math.max(c,n.length),0);mat.forEach(row=>{while(row.length<max)row.push(null)});return mat}
  interleavedData = transpose(square(dataBlocks)).flat().concat(transpose(square(eccBlocks)).flat()).filter(a=>a)

  return interleavedData.map(a=>a.toString(2).padStart(8,"0")).join("");
}

function fillQRCodeData(matrix, binaryString, order=dataModuleCoordinates(matrix)) {
  order.forEach((a,i)=>matrix[a.x][a.y]=Number(binaryString[i]??0));
  return matrix;
}

function placeFormatAndVersionStrings(matrix, formatString, versionString) {
  const size = matrix.length;
  setF=(x,y,i)=>matrix[x][y]=parseInt(formatString[i]);
  setV=(x,y,i)=>matrix[x][y]=parseInt(versionString[17-i]);

  // Place format string
  for (let i=0; i<6; i++) {
    setF(  i,      8  ,    i);
    setF(  8,      i  , 14-i);
    setF(  8, size-1-i,    i);
    setF(size-1-i, 8  , 14-i);
  }
  setF(7,8,6);
  setF(8,size-7,6);
  setF(8,8,7);
  setF(size-8,8,7);
  setF(8,7,8);
  setF(size-7,8,8);

  // Place version string (for version 7 and higher)
  if (versionString) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        setV(size - 11 + j, i, 3*i+j);
        setV(i, size - 11 + j, 3*i+j);
      }
    }
  }

  return matrix;
}

function applyMask(matrix, order, ecc, version, maskId) {
  const masks = [
    (row,column) => (row + column) % 2 == 0,
    (row,column) => (row) % 2 == 0,
    (row,column) => (column) % 3 == 0,
    (row,column) => (row + column) % 3 == 0,
    (row,column) => ( Math.floor(row / 2) + Math.floor(column / 3) ) % 2 == 0,
    (row,column) => ((row * column) % 2) + ((row * column) % 3) == 0,
    (row,column) => ( ((row * column) % 2) + ((row * column) % 3) ) % 2 == 0,
    (row,column) => ( ((row + column) % 2) + ((row * column) % 3) ) % 2 == 0
  ]
  const mask = (pos) => masks[maskId](pos.y, pos.x);
  matrix = clone(matrix);
  order.map(mask).forEach((flip,i)=>{if (flip) matrix[order[i].x][order[i].y] = !matrix[order[i].x][order[i].y]});

  placeFormatAndVersionStrings(matrix, formatInformation[ecc][maskId], versionChecks[version-7]);
  return matrix;
}

function scoreMasking(matrix) {
  const size = matrix.length;

  // Rule 1: Consecutive modules of the same color in a row or column
  function rule1(matrix) {
    return rule1rows(matrix) + rule1rows(transpose(matrix))
  }
  function rule1rows(matrix) {
    let score = 0;
    for (let row = 0; row < size; row++) {
      let count = 1;
      for (let col = 1; col < size; col++) {
        if (matrix[row][col] === matrix[row][col - 1]) {
          count++;
        } else {
          if (count >= 5) score += 3 + count - 5;
          count = 1;
        }
      }
      if (count >= 5) score += 3 + count - 5;
    }
    return score;
  }

  // Rule 2: 2x2 blocks of the same color
  function rule2(matrix) {
    let score = 0;
    for (let row = 0; row < size - 1; row++)
      for (let col = 0; col < size - 1; col++)
        if (  matrix[row][col] === matrix[row][col + 1] &&
              matrix[row][col] === matrix[row + 1][col] &&
              matrix[row][col] === matrix[row + 1][col + 1] )
          score += 3;
    return score;
  }

  // Rule 3: Finder-like pattern in rows or columns
  function rule3(matrix) {
    let score = 0;
    const pattern1 = [0,0,0,0,1, 0, 1, 1, 1, 0, 1];
    const pattern2 = [        1, 0, 1, 1, 1, 0, 1,0,0,0,0];
    for (let row = 0; row < size; row++)
      for (let col = 0; col <= size - 11; col++) {
        if (  pattern1.every((v, i) => matrix[row][col + i] === v) ||
              pattern2.every((v, i) => matrix[row][col + i] === v) )
          score += 40;
        if (  pattern1.every((v, i) => matrix[col + i][row] === v) ||
              pattern2.every((v, i) => matrix[col + i][row] === v) )
          score += 40;
      }
    return score;
  }

  // Rule 4: Ratio of dark modules to total modules
  function rule4(matrix) {
    const totalModules = size * size;
    let darkModules = 0;
    for (let row = 0; row < size; row++)
      for (let col = 0; col < size; col++)
        if (matrix[row][col]) darkModules++;

    const darkRatio = darkModules / totalModules;
    const prevMultiple = Math.floor(darkRatio * 100 / 5) * 5;
    const nextMultiple = Math.ceil(darkRatio * 100 / 5) * 5;
    return Math.min(Math.abs(prevMultiple - 50), Math.abs(nextMultiple - 50)) * 2;
  }

  // Calculate the total score by applying all four rules
  const totalScore = rule1(matrix) + rule2(matrix) + rule3(matrix) + rule4(matrix);
  console.log([rule1(matrix), rule2(matrix), rule3(matrix), rule4(matrix)]);
  return totalScore;
}



function stringToQR(strs, ecc="L", version=1) {
  if (!(strs instanceof Array))
    strs = [strs];

  let binaryMessage = "";

  strs.forEach(str=>{
    const mode = getMode(str);
    version = Math.max(version, getMinVersionForData(str, mode, ecc));
    binaryMessage += createQRCodeBinaryString(str, mode, ecc, version);
  })

  const finalBinary = finalizeQRBinary(binaryMessage, ecc, version);

  // Setup matrix
  let matrix = generateQRMatrix(version);
      matrix = markInfoRegions(matrix);
  const order = dataModuleCoordinates(matrix);
  matrix = fillQRCodeData(matrix, finalBinary, order);

  let bestMask = applyMask(matrix, order, ecc, version, 0);
  let bestScore = scoreMasking(bestMask);
  for (let mask=1; mask<8; mask++) {
    const masked = applyMask(matrix, order, ecc, version, mask);
    const score = scoreMasking(masked);
    console.log(mask,score)
    if (score<bestScore) {
      bestScore = score;
      bestMask = masked;
    }
  }

  return bestMask;
}





// str = "HELLO WORLD"
// mine = createQRCodeBinaryString(str, getMode(str), "M",1);
// console.log("Correct generates M-1 of `HELLO WORLD`:", mine == "00100000010110110000101101111000110100010111001011011100010011010100001101000000111011000001000111101100000100011110110000010001")

// console.log("Correct ecc for M-1 of `HELLO WORLD`:", polynomialLongDivision(binaryStringToDataPolynomial(mine).concat(Array(10).fill(0)),getGeneratorPolynomial(10),logTable,expTable).join() == "196,35,39,119,235,215,231,226,93,23")

// // console.log(finalizeQRBinary("HELLO WORLD", "M", 1).map(a=>a.toString(2).padStart(8,"0")).join(""))

// src = "There\\'s a frood who really knows where his towel is!"
// outputString = finalizeQRBinary(src,"Q",5);
// console.log(outputString);

boarder=matrix=>Array(3).fill(Array(matrix.length+6).fill(0)).concat(matrix.map(a=>[0,0,0].concat(a).concat([0,0,0]))).concat(Array(3).fill(Array(matrix.length+6).fill(0)))
display=(matrix,scan=false)=>console.log(transpose(scan?boarder(matrix):matrix).map(a=>a.map(a=>a==1?(scan?"██":"#"):a==0?(scan?"  ":"."):a===null?"x":a==3?"/":" ").join("")).join("\n"));

// qr = generateQRMatrix(5);
// display(qr);
// console.log();
// qr = markInfoRegions(qr);
// display(qr);
// console.log();

// data = dataModuleCoordinates(qr)

// data.forEach((a,i)=>qr[a.x][a.y]=Number(outputString[i]??0))
// display(qr);
// console.log();

// // placeFormatAndVersionStrings(qr, "110011000101111", "000111110010010100")
// // placeFormatAndVersionStrings(qr, "333333333333333", "003030000000000000")
// display(qr);
// console.log();

// display(applyMask(qr,data,"Q",5,7))

// display(stringToQR("HELLO WORLD","Q"),true)
display(stringToQR("https://hyec.gg/members/selkie.html","Q"),true)


