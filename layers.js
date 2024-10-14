function drawCombinedGrid() {
  let accumulatedMask = createEmptyMask(layers[0].input);
  
  layers.forEach((layer, index) => {
    drawLayer(layer, accumulatedMask);
    accumulatedMask = updateMaskWithLayer(accumulatedMask, layer.input);
  });
}

function createEmptyMask(inputArea) {
  const rows = inputArea.value.split('\n');
  return Array(rows.length).fill('').map(() => Array(Math.max(...rows.map(row => row.length))).fill(undefined));
}

function updateMaskWithLayer(mask, inputArea) {
  const rows = inputArea.value.split('\n');
  const newMask = mask.map(row => [...row]); // Clone the existing mask
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
      const char = rows[rowIndex][colIndex];
      if ((char === '0' || char === '1') && newMask[rowIndex][colIndex] === undefined) {
        newMask[rowIndex][colIndex] = char; // Update only if the current cell is undefined
      }
    }
  }
  return newMask;
}

function drawLayer(layer, mask) {
  const rows = layer.input.value.split('\n');
  const canvas = layer.canvas;
  const ctx = canvas.getContext('2d');
  
  // Determine the maximum number of columns and rows
  const maxCols = Math.max(...rows.map(row => row.length), mask[0].length);
  const maxRows = Math.max(rows.length, mask.length);

  // Resize the canvas to match the size of the grid
  canvas.width = maxCols * cellSize;
  canvas.height = maxRows * cellSize;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the grid cells
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    for (let colIndex = 0; colIndex < maxCols; colIndex++) {
      let maskChar = mask[rowIndex] ? mask[rowIndex][colIndex] : undefined;
      let char = rows[rowIndex] ? rows[rowIndex][colIndex] : undefined;
      let color;

      // Determine color based on the mask precedence
      if (maskChar === '0' || maskChar === '1') {
        // If masked by a higher layer, use a distinct gray version
        color = maskChar === '0' ? 'rgba(192, 192, 192, 1)' : 'rgba(64, 64, 64, 1)';
      } else if (char === '0' || char === '1') {
        // Use the current layer's character if no higher mask is defined
        color = char === '0' ? 'white' : 'black';
      } else {
        // Default to a lighter gray for undefined cells with a slight blue tint
        color = 'rgba(210, 220, 240, 1)';
      }

      // Set the fill color and draw the rectangle
      ctx.fillStyle = color;
      ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);

      // Apply transparency texture for undefined cells
      if (color === 'rgba(210, 220, 240, 1)') {
        ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(colIndex * cellSize + i * cellSize / 2, rowIndex * cellSize + j * cellSize / 2, cellSize / 2, cellSize / 2);
            }
          }
        }
      }

      // Apply tint for conflicting areas (where mask and current layer differ)
      if ((maskChar === '0' || maskChar === '1') && (char === '0' || char === '1')) {
        if (char === maskChar) {
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; // Red outline for matching conflicts
          ctx.lineWidth = 1.5;
          ctx.strokeRect(colIndex * cellSize + 1, rowIndex * cellSize + 1, cellSize - 2, cellSize - 2);
        } else {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Red highlight for mismatched conflicts
          ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // Draw a boundary around the entire grid
  const boundaryWidth = maxCols * cellSize;
  const boundaryHeight = maxRows * cellSize;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, boundaryWidth, boundaryHeight);
}