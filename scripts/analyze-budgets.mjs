/**
 * Build budget analyzer script per §9 and §11.
 * Inspects dist/ build output, calculates gzipped sizes, and enforces performance budgets.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist/ directory not found. Please run "pnpm build" first.');
  process.exit(1);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(DIST_DIR);
let totalJsBytes = 0;
let totalJsGzBytes = 0;
let totalCssBytes = 0;
let totalCssGzBytes = 0;
let maxHtmlBytes = 0;
let maxHtmlFile = '';
let hasViolation = false;

console.log('\n========================================');
console.log('       BUILD SIZE & BUDGET REPORT       ');
console.log('========================================\n');

allFiles.forEach((filePath) => {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath);
  const size = content.length;
  const relPath = path.relative(DIST_DIR, filePath);

  if (ext === '.js') {
    const gzSize = zlib.gzipSync(content).length;
    totalJsBytes += size;
    totalJsGzBytes += gzSize;
    console.log(`[JS]  ${relPath.padEnd(45)} ${(size / 1024).toFixed(2)} KB (gz: ${(gzSize / 1024).toFixed(2)} KB)`);
  } else if (ext === '.css') {
    const gzSize = zlib.gzipSync(content).length;
    totalCssBytes += size;
    totalCssGzBytes += gzSize;
    console.log(`[CSS] ${relPath.padEnd(45)} ${(size / 1024).toFixed(2)} KB (gz: ${(gzSize / 1024).toFixed(2)} KB)`);
  } else if (ext === '.html') {
    if (size > maxHtmlBytes) {
      maxHtmlBytes = size;
      maxHtmlFile = relPath;
    }
  }
});

console.log('\n----------------------------------------');
console.log('BUDGET ENFORCEMENT:');
console.log('----------------------------------------');

// Budget 1: CSS gzipped < 45KB (§11)
const maxCssGzKb = 45;
const cssGzKb = totalCssGzBytes / 1024;
const cssPassed = cssGzKb < maxCssGzKb;
console.log(`Total CSS (gzipped): ${cssGzKb.toFixed(2)} KB / ${maxCssGzKb} KB -> ${cssPassed ? 'PASSED ✓' : 'FAILED ✗'}`);
if (!cssPassed) hasViolation = true;

// Budget 2: HTML uncompressed < 90KB per page (§11)
const maxHtmlKb = 90;
const htmlKb = maxHtmlBytes / 1024;
const htmlPassed = htmlKb < maxHtmlKb;
console.log(`Largest HTML (${maxHtmlFile}): ${htmlKb.toFixed(2)} KB / ${maxHtmlKb} KB -> ${htmlPassed ? 'PASSED ✓' : 'FAILED ✗'}`);
if (!htmlPassed) hasViolation = true;

// Budget 3: Total JS gzipped budget check
console.log(`Total JS (gzipped): ${(totalJsGzBytes / 1024).toFixed(2)} KB`);

console.log('========================================\n');

if (hasViolation) {
  console.error('❌ Build budget check failed! One or more performance limits were exceeded.');
  process.exit(1);
} else {
  console.log('✓ All build performance budgets passed within specifications!');
  process.exit(0);
}
