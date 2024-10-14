const alignmentPatternLookupTable = [
  /*00s*/  [],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],
  /*10s*/ [6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],
  /*20s*/ [6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],
  /*30s*/ [6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],
  /*40s*/ [6,30,58,86,114,142,170]];

const errorCorrectionLookupTable = {
    "L":[[],[19, 7, 1, 19, 0, 0, 19],[34, 10, 1, 34, 0, 0, 34],[55, 15, 1, 55, 0, 0, 55],[80, 20, 1, 80, 0, 0, 80],[108, 26, 1, 108, 0, 0, 108],[136, 18, 2, 68, 0, 0, 136],[156, 20, 2, 78, 0, 0, 156],[194, 24, 2, 97, 0, 0, 194],[232, 30, 2, 116, 0, 0, 232],[274, 18, 2, 68, 2, 69, 274],[324, 20, 4, 81, 0, 0, 324],[370, 24, 2, 92, 2, 93, 370],[428, 26, 4, 107, 0, 0, 428],[461, 30, 3, 115, 1, 116, 461],[523, 22, 5, 87, 1, 88, 523],[589, 24, 5, 98, 1, 99, 589],[647, 28, 1, 107, 5, 108, 647],[721, 30, 5, 120, 1, 121, 721],[795, 28, 3, 113, 4, 114, 795],[861, 28, 3, 107, 5, 108, 861],[932, 28, 4, 116, 4, 117, 932],[1006, 28, 2, 111, 7, 112, 1006],[1094, 30, 4, 121, 5, 122, 1094],[1174, 30, 6, 117, 4, 118, 1174],[1276, 26, 8, 106, 4, 107, 1276],[1370, 28, 10, 114, 2, 115, 1370],[1468, 30, 8, 122, 4, 123, 1468],[1531, 30, 3, 117, 10, 118, 1531],[1631, 30, 7, 116, 7, 117, 1631],[1735, 30, 5, 115, 10, 116, 1735],[1843, 30, 13, 115, 3, 116, 1843],[1955, 30, 17, 115, 0, 0, 1955],[2071, 30, 17, 115, 1, 116, 2071],[2191, 30, 13, 115, 6, 116, 2191],[2306, 30, 12, 121, 7, 122, 2306],[2434, 30, 6, 121, 14, 122, 2434],[2566, 30, 17, 122, 4, 123, 2566],[2702, 30, 4, 122, 18, 123, 2702],[2812, 30, 20, 117, 4, 118, 2812],[2956, 30, 19, 118, 6, 119, 2956]],
    "M":[[],[16, 10, 1, 16, 0, 0, 16],[28, 16, 1, 28, 0, 0, 28],[44, 26, 1, 44, 0, 0, 44],[64, 18, 2, 32, 0, 0, 64],[86, 24, 2, 43, 0, 0, 86],[108, 16, 4, 27, 0, 0, 108],[124, 18, 4, 31, 0, 0, 124],[154, 22, 2, 38, 2, 39, 154],[182, 22, 3, 36, 2, 37, 182],[216, 26, 4, 43, 1, 44, 216],[254, 30, 1, 50, 4, 51, 254],[290, 22, 6, 36, 2, 37, 290],[334, 22, 8, 37, 1, 38, 334],[365, 24, 4, 40, 5, 41, 365],[415, 24, 5, 41, 5, 42, 415],[453, 28, 7, 45, 3, 46, 453],[507, 28, 10, 46, 1, 47, 507],[563, 26, 9, 43, 4, 44, 563],[627, 26, 3, 44, 11, 45, 627],[669, 26, 3, 41, 13, 42, 669],[714, 26, 17, 42, 0, 0, 714],[782, 28, 17, 46, 0, 0, 782],[860, 28, 4, 47, 14, 48, 860],[914, 28, 6, 45, 14, 46, 914],[1000, 28, 8, 47, 13, 48, 1000],[1062, 28, 19, 46, 4, 47, 1062],[1128, 28, 22, 45, 3, 46, 1128],[1193, 28, 3, 45, 23, 46, 1193],[1267, 28, 21, 45, 7, 46, 1267],[1373, 28, 19, 47, 10, 48, 1373],[1455, 28, 2, 46, 29, 47, 1455],[1541, 28, 10, 46, 23, 47, 1541],[1631, 28, 14, 46, 21, 47, 1631],[1725, 28, 14, 46, 23, 47, 1725],[1812, 28, 12, 47, 26, 48, 1812],[1914, 28, 6, 47, 34, 48, 1914],[1992, 28, 29, 46, 14, 47, 1992],[2102, 28, 13, 46, 32, 47, 2102],[2216, 28, 40, 47, 7, 48, 2216],[2334, 28, 18, 47, 31, 48, 2334]],
    "Q":[[],[13, 13, 1, 13, 0, 0, 13],[22, 22, 1, 22, 0, 0, 22],[34, 18, 2, 17, 0, 0, 34],[48, 26, 2, 24, 0, 0, 48],[62, 18, 2, 15, 2, 16, 62],[76, 24, 4, 19, 0, 0, 76],[88, 18, 2, 14, 4, 15, 88],[110, 22, 4, 18, 2, 19, 110],[132, 20, 4, 16, 4, 17, 132],[154, 24, 6, 19, 2, 20, 154],[180, 28, 4, 22, 4, 23, 180],[206, 26, 4, 20, 6, 21, 206],[244, 24, 8, 20, 4, 21, 244],[261, 20, 11, 16, 5, 17, 261],[295, 30, 5, 24, 7, 25, 295],[325, 24, 15, 19, 2, 20, 325],[367, 28, 1, 22, 15, 23, 367],[397, 28, 17, 22, 1, 23, 397],[445, 26, 17, 21, 4, 22, 445],[485, 30, 15, 24, 5, 25, 485],[512, 28, 17, 22, 6, 23, 512],[568, 30, 7, 24, 16, 25, 568],[614, 30, 11, 24, 14, 25, 614],[664, 30, 11, 24, 16, 25, 664],[718, 30, 7, 24, 22, 25, 718],[754, 28, 28, 22, 6, 23, 754],[808, 30, 8, 23, 26, 24, 808],[871, 30, 4, 24, 31, 25, 871],[911, 30, 1, 23, 37, 24, 911],[985, 30, 15, 24, 25, 25, 985],[1033, 30, 42, 24, 1, 25, 1033],[1115, 30, 10, 24, 35, 25, 1115],[1171, 30, 29, 24, 19, 25, 1171],[1231, 30, 44, 24, 7, 25, 1231],[1286, 30, 39, 24, 14, 25, 1286],[1354, 30, 46, 24, 10, 25, 1354],[1426, 30, 49, 24, 10, 25, 1426],[1502, 30, 48, 24, 14, 25, 1502],[1582, 30, 43, 24, 22, 25, 1582],[1666, 30, 34, 24, 34, 25, 1666]],
    "H":[[],[9, 17, 1, 9, 0, 0, 9],[16, 28, 1, 16, 0, 0, 16],[26, 22, 2, 13, 0, 0, 26],[36, 16, 4, 9, 0, 0, 36],[46, 22, 2, 11, 2, 12, 46],[60, 28, 4, 15, 0, 0, 60],[66, 26, 4, 13, 1, 14, 66],[86, 26, 4, 14, 2, 15, 86],[100, 24, 4, 12, 4, 13, 100],[122, 28, 6, 15, 2, 16, 122],[140, 24, 3, 12, 8, 13, 140],[158, 28, 7, 14, 4, 15, 158],[180, 22, 12, 11, 4, 12, 180],[197, 24, 11, 12, 5, 13, 197],[223, 24, 11, 12, 7, 13, 223],[253, 30, 3, 15, 13, 16, 253],[283, 28, 2, 14, 17, 15, 283],[313, 28, 2, 14, 19, 15, 313],[341, 26, 9, 13, 16, 14, 341],[385, 28, 15, 15, 10, 16, 385],[406, 30, 19, 16, 6, 17, 406],[442, 24, 34, 13, 0, 0, 442],[464, 30, 16, 15, 14, 16, 464],[514, 30, 30, 16, 2, 17, 514],[538, 30, 22, 15, 13, 16, 538],[596, 30, 33, 16, 4, 17, 596],[628, 30, 12, 15, 28, 16, 628],[661, 30, 11, 15, 31, 16, 661],[701, 30, 19, 15, 26, 16, 701],[745, 30, 23, 15, 25, 16, 745],[793, 30, 23, 15, 28, 16, 793],[845, 30, 19, 15, 35, 16, 845],[901, 30, 11, 15, 46, 16, 901],[961, 30, 59, 16, 1, 17, 961],[986, 30, 22, 15, 41, 16, 986],[1054, 30, 2, 15, 64, 16, 1054],[1096, 30, 24, 15, 46, 16, 1096],[1142, 30, 42, 15, 32, 16, 1142],[1222, 30, 10, 15, 67, 16, 1222],[1276, 30, 20, 15, 61, 16, 1276]]
  };

function drawPoint(matrix, x, y, value) {
  if (x>=0 && x<matrix.length && y>=0 && y<matrix[x].length)
    matrix[x][y] = value;
}

// Fill a ring of value with radius r around (x,y).
function drawRing(matrix, x, y, r, value) {
  for (let i=-r; i<=r; i++) {
    drawPoint(matrix, x-r, y+i, value);
    drawPoint(matrix, x+r, y+i, value);
  }
  for (let i=-r+1; i<r; i++) {
    drawPoint(matrix, x+i, y-r, value);
    drawPoint(matrix, x+i, y+r, value);
  }
}

// Helper function to draw the finder patterns
function drawFinderPattern(matrix, x, y) {
  drawPoint(matrix, x,y,  '1');
  drawRing (matrix, x,y,1,'1');
  drawRing (matrix, x,y,2,'0');
  drawRing (matrix, x,y,3,'1');
  drawRing (matrix, x,y,4,'0');
}

// Helper function to draw the finder patterns
function drawOneAlignmentPattern(matrix, x, y) {
  drawPoint(matrix, x,y,  '1');
  drawRing (matrix, x,y,1,'0');
  drawRing (matrix, x,y,2,'1');
}

function drawAlignmentPatterns(matrix, version) {
  const alignmentPositions = alignmentPatternLookupTable[version] || [];
  const last = alignmentPositions.length - 1;

  // For each (x,y) where x and y are both in alignmentPositions:
  for (let i=0; i<=last; i++) {
    for (let j=0; j<=last; j++) {
      // Skip top left, top right, and bottom left (would overlap finder patterns)
      if ((i==0&&j==0) || (i==0&&j==last) || (i==last&&j==0))
        continue;

      drawOneAlignmentPattern(matrix, alignmentPositions[i], alignmentPositions[j]);
    }
  }
}

function drawTimingPattern(matrix) {
  for (let i=8; i<matrix.length-8; i++) {
    drawPoint(matrix, i, 6, i%2==0?'1':'0');
    drawPoint(matrix, 6, i, i%2==0?'1':'0');
  }
}

function drawAlwaysOnDot(matrix) {
  drawPoint(matrix, matrix.length-6, 8, '1');
}

function drawConstantPatterns(version) {
  const size = 17 + 4 * version;
  const matrix = new Array(size).fill(null).map(_=>new Array(size).fill('-'));

  drawFinderPattern(matrix, 3, 3);
  drawFinderPattern(matrix, 3, size-4);
  drawFinderPattern(matrix, size-4, 3);
  
  drawTimingPattern(matrix);

  drawAlwaysOnDot(matrix);

  drawAlignmentPatterns(matrix, version);

  return matrix;
}