import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPng(size, bgR, bgG, bgB, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (width * 4 + 1));

  let offset = 0;
  const center = size / 2;
  const radius = isMaskable ? size * 0.42 : size * 0.46;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Book / Light icon in the center
      const inBook = (Math.abs(dx) < size * 0.22 && Math.abs(dy) < size * 0.18);
      const isBookFold = (Math.abs(dx) < size * 0.02 && Math.abs(dy) < size * 0.18);

      if (dist < radius) {
        if (inBook && !isBookFold) {
          // White book pages
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
        } else {
          // Vibrant indigo-blue gradient background
          const grad = Math.min(1, Math.max(0, (y / size)));
          rawData[offset++] = Math.round(bgR * (1 - grad * 0.2));
          rawData[offset++] = Math.round(bgG * (1 - grad * 0.1));
          rawData[offset++] = Math.round(bgB);
          rawData[offset++] = 255;
        }
      } else {
        if (isMaskable) {
          // Maskable background fills entire canvas
          rawData[offset++] = bgR;
          rawData[offset++] = bgG;
          rawData[offset++] = bgB;
          rawData[offset++] = 255;
        } else {
          // Transparent outside circle
          rawData[offset++] = 0;
          rawData[offset++] = 0;
          rawData[offset++] = 0;
          rawData[offset++] = 0;
        }
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Non-interlaced

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, len + 8);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write icons (indigo: 37, 99, 235)
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPng(192, 37, 99, 235, false));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPng(512, 37, 99, 235, false));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createPng(512, 37, 99, 235, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 37, 99, 235, false));

console.log('Successfully generated PWA icons in /public');
