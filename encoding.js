const alphanumericTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

const modeIndicators = {
  'Numeric': '0001',
  'Alphanumeric': '0010',
  'Byte': '0100',
  'Kanji': '1000',
};

const bitLengthsBitLengths = {
  'Numeric': [10, 12, 14],
  'Alphanumeric': [9, 11, 13],
  'Byte': [8, 16, 16],
  'Kanji': [8, 10, 12],
}

function getAutomaticEncoding(text, version) {
  const encoders = {
    'Numeric':encodeNumeric,
    'Alphanumeric':encodeAlphanumeric,
    'Byte':encodeByte,
  };

  const inputLength = text.length;
  const encodingMode = determineMode(text);
  const encoder = encoders[encodingMode];
  const binaryString = encoder(text);

  if (version === undefined)
    return { encodingMode, inputLength, binaryString };

  const headerMode = modeIndicators[encodingMode]
  const headerLength = encodeLength(version, encodingMode, inputLength);
  const segments = [
    {'type':'mode', 'content':headerMode, 'description':encodingMode},
    {'type':'length', 'content':headerLength, 'description':`${inputLength} bytes`},
    {'type':'data', 'content':binaryString, 'description':JSON.stringify(text)},
  ];

  return { encodingMode, inputLength, binaryString:headerMode+headerLength+binaryString, segments }
}

function determineMode(text) {
  if (/^\d*$/.test(text)) {
    return 'Numeric';
  } else if (/^[0-9A-Z \$\%\*\+\.\/\:\-]+$/.test(text)) {
    return 'Alphanumeric';
  } else {
    return 'Byte';
  }
}

function determineLengthBits(version, mode) {
  if (version <= 9)
    return bitLengthsBitLengths[mode][0];
  else if (version <= 26)
    return bitLengthsBitLengths[mode][1];
  else
    return bitLengthsBitLengths[mode][2];
}

function encodeLength(version, mode, length) {
  const bits = determineLengthBits(version, mode);
  const binaryString = length.toString(2).padStart(bits, '0');
  if (binaryString.length > bits)
    throw new Error("String too long to be encoded for this version!");
  return binaryString;
}

function encodeNumeric(text) {
  let binary = '';
  let i = 0;
  while (i < text.length) {
    if (i + 3 <= text.length) {
      const group = text.substring(i, i + 3);
      const value = parseInt(group, 10);
      binary += value.toString(2).padStart(10, '0');
      i += 3;
    } else if (i + 2 <= text.length) {
      // Last group with 2 digits
      const group = text.substring(i, i + 2);
      const value = parseInt(group, 10);
      binary += value.toString(2).padStart(7, '0');
      i += 2;
    } else {
      // Last group with 1 digit
      const group = text.substring(i, i + 1);
      const value = parseInt(group, 10);
      binary += value.toString(2).padStart(4, '0');
      i += 1;
    }
  }
  return binary;
}

function encodeAlphanumeric(text) {
  let binary = '';
  let i = 0;
  while (i < text.length) {
    if (i + 2 <= text.length) {
      // Process pairs of characters
      const char1 = text.charAt(i);
      const char2 = text.charAt(i + 1);
      const value1 = alphanumericTable.indexOf(char1);
      const value2 = alphanumericTable.indexOf(char2);
      const combinedValue = value1 * 45 + value2;
      binary += combinedValue.toString(2).padStart(11, '0');
      i += 2;
    } else {
      // Last character
      const char = text.charAt(i);
      const value = alphanumericTable.indexOf(char);
      binary += value.toString(2).padStart(6, '0');
      i += 1;
    }
  }
  return binary;
}

function encodeByte(text) {
  let binary = '';
  for (let char of text) {
    const code = char.charCodeAt(0);
    binary += code.toString(2).padStart(8, '0');
  }
  return binary;
}



function parseNumeric(binaryString) {
  let text = '';
  let i = 0;
  const totalBits = binaryString.length;

  while (i < totalBits) {
    const remaining = totalBits - i;
    if (remaining >= 10) {
      const group = binaryString.substring(i, i + 10);
      const value = parseInt(group, 2);
      text += value.toString().padStart(3, '0');
      i += 10;
    } else if (remaining >= 7) {
      const group = binaryString.substring(i, i + 7);
      const value = parseInt(group, 2);
      text += value.toString().padStart(2, '0');
      i += 7;
    } else if (remaining >= 4) {
      const group = binaryString.substring(i, i + 4);
      const value = parseInt(group, 2);
      text += value.toString();
      i += 4;
    } else {
      // Invalid or incomplete encoding
      text += '?';
      break;
    }
  }

  return text;
}

function parseAlphanumeric(binaryString) {
  let text = '';
  let i = 0;
  const totalBits = binaryString.length;

  while (i < totalBits) {
    const remaining = totalBits - i;
    if (remaining >= 11) {
      const group = binaryString.substring(i, i + 11);
      const value = parseInt(group, 2);
      const char1 = alphanumericTable[Math.floor(value / 45)];
      const char2 = alphanumericTable[value % 45];
      text += char1 + char2;
      i += 11;
    } else if (remaining >= 6) {
      const group = binaryString.substring(i, i + 6);
      const value = parseInt(group, 2);
      const char = alphanumericTable[value];
      text += char;
      i += 6;
    } else {
      // Invalid or incomplete encoding
      text += '?';
      break;
    }
  }

  return text;
}

function parseByte(binaryString) {
  let text = '';
  let i = 0;
  const totalBits = binaryString.length;

  while (i < totalBits) {
    if (i + 8 <= totalBits) {
      const byte = binaryString.substring(i, i + 8);
      const charCode = parseInt(byte, 2);
      text += String.fromCharCode(charCode);
      i += 8;
    } else {
      // Invalid or incomplete encoding
      text += '?';
      break;
    }
  }

  return text;
}