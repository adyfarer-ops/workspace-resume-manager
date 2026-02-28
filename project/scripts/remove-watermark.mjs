#!/usr/bin/env node
/**
 * 图片水印去除工具 - 通过裁剪底部区域
 */

import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.log('用法: node remove-watermark.mjs <input.png> <output.png>');
  process.exit(1);
}

console.log(`处理: ${inputFile} -> ${outputFile}`);
console.log('注意: 此工具需要 ImageMagick，请先安装: apt-get install imagemagick');
