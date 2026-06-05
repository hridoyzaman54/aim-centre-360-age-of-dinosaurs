import fs from 'node:fs';
import path from 'node:path';

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// Copy build/client/assets to .vercel_static/assets (root-level static output)
const outDir = '.vercel_static';
fs.mkdirSync(outDir, { recursive: true });

// Copy compiled JS/CSS assets
copyFolderSync('build/client/assets', path.join(outDir, 'assets'));

// Copy images from public/images (these are committed to git)
copyFolderSync('public/images', path.join(outDir, 'images'));

// Copy any other static files from build/client root (manifests, etc.)
const clientRoot = 'build/client';
if (fs.existsSync(clientRoot)) {
  fs.readdirSync(clientRoot).forEach(item => {
    const src = path.join(clientRoot, item);
    if (!fs.lstatSync(src).isDirectory()) {
      fs.copyFileSync(src, path.join(outDir, item));
    }
  });
}

console.log('Successfully copied static assets to .vercel_static/ for Vercel deployment');
