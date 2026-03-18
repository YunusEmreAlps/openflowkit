const GIF_HEADER = 'GIF89a';
const RGB332_PALETTE: Uint8Array = buildRgb332Palette();

function buildRgb332Palette(): Uint8Array {
  const palette = new Uint8Array(256 * 3);
  for (let index = 0; index < 256; index += 1) {
    const red = ((index >> 5) & 0x07) * 255 / 7;
    const green = ((index >> 2) & 0x07) * 255 / 7;
    const blue = (index & 0x03) * 255 / 3;
    palette[index * 3] = Math.round(red);
    palette[index * 3 + 1] = Math.round(green);
    palette[index * 3 + 2] = Math.round(blue);
  }
  return palette;
}

function stringToBytes(value: string): number[] {
  return [...value].map((char) => char.charCodeAt(0));
}

function pushUint16(buffer: number[], value: number): void {
  buffer.push(value & 0xff, (value >> 8) & 0xff);
}

function clampDelay(delayMs: number): number {
  return Math.max(2, Math.round(delayMs / 10));
}

function quantizeToRgb332(imageData: ImageData): Uint8Array {
  const out = new Uint8Array(imageData.width * imageData.height);
  const { data } = imageData;
  for (let pixelIndex = 0; pixelIndex < out.length; pixelIndex += 1) {
    const dataIndex = pixelIndex * 4;
    const red = data[dataIndex];
    const green = data[dataIndex + 1];
    const blue = data[dataIndex + 2];
    out[pixelIndex] = (red & 0xe0) | ((green & 0xe0) >> 3) | ((blue & 0xc0) >> 6);
  }
  return out;
}

function lzwEncode(indices: Uint8Array, minCodeSize = 8): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const endCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = endCode + 1;
  let dictionary = new Map<string, number>();
  for (let index = 0; index < clearCode; index += 1) {
    dictionary.set(String(index), index);
  }

  const codes: number[] = [clearCode];
  let prefix = String(indices[0] ?? 0);

  for (let index = 1; index < indices.length; index += 1) {
    const suffix = String(indices[index]);
    const combined = `${prefix},${suffix}`;
    if (dictionary.has(combined)) {
      prefix = combined;
      continue;
    }

    codes.push(dictionary.get(prefix)!);
    dictionary.set(combined, nextCode);
    nextCode += 1;
    prefix = suffix;

    if (nextCode === 1 << codeSize && codeSize < 12) {
      codeSize += 1;
    }

    if (nextCode >= 4095) {
      codes.push(clearCode);
      dictionary = new Map<string, number>();
      for (let resetIndex = 0; resetIndex < clearCode; resetIndex += 1) {
        dictionary.set(String(resetIndex), resetIndex);
      }
      codeSize = minCodeSize + 1;
      nextCode = endCode + 1;
    }
  }

  codes.push(dictionary.get(prefix)!);
  codes.push(endCode);

  const output: number[] = [];
  let bitBuffer = 0;
  let bitCount = 0;
  codeSize = minCodeSize + 1;
  nextCode = endCode + 1;

  for (const code of codes) {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;

    while (bitCount >= 8) {
      output.push(bitBuffer & 0xff);
      bitBuffer >>= 8;
      bitCount -= 8;
    }

    if (code === clearCode) {
      codeSize = minCodeSize + 1;
      nextCode = endCode + 1;
      continue;
    }

    if (code !== endCode) {
      nextCode += 1;
      if (nextCode === 1 << codeSize && codeSize < 12) {
        codeSize += 1;
      }
    }
  }

  if (bitCount > 0) {
    output.push(bitBuffer & 0xff);
  }

  return new Uint8Array(output);
}

function chunkSubBlocks(bytes: Uint8Array): number[] {
  const out: number[] = [];
  for (let offset = 0; offset < bytes.length; offset += 255) {
    const chunk = bytes.slice(offset, offset + 255);
    out.push(chunk.length, ...chunk);
  }
  out.push(0);
  return out;
}

export interface GifFrameInput {
  imageData: ImageData;
  delayMs: number;
}

export function encodeGif(frames: GifFrameInput[]): Blob {
  if (frames.length === 0) {
    throw new Error('GIF export requires at least one frame.');
  }

  const width = frames[0].imageData.width;
  const height = frames[0].imageData.height;
  const bytes: number[] = [];

  bytes.push(...stringToBytes(GIF_HEADER));
  pushUint16(bytes, width);
  pushUint16(bytes, height);
  bytes.push(0xf7, 0x00, 0x00);
  bytes.push(...RGB332_PALETTE);
  bytes.push(0x21, 0xff, 0x0b, ...stringToBytes('NETSCAPE2.0'), 0x03, 0x01, 0x00, 0x00, 0x00);

  for (const frame of frames) {
    const indexedPixels = quantizeToRgb332(frame.imageData);
    const compressed = lzwEncode(indexedPixels);
    bytes.push(0x21, 0xf9, 0x04, 0x04);
    pushUint16(bytes, clampDelay(frame.delayMs));
    bytes.push(0x00, 0x00);
    bytes.push(0x2c);
    pushUint16(bytes, 0);
    pushUint16(bytes, 0);
    pushUint16(bytes, width);
    pushUint16(bytes, height);
    bytes.push(0x00);
    bytes.push(0x08, ...chunkSubBlocks(compressed));
  }

  bytes.push(0x3b);
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}
