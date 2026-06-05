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

// Ensure the destination public directory exists
fs.mkdirSync('public', { recursive: true });

// Copy assets and images from build/client to public
copyFolderSync('build/client', 'public');
console.log('Successfully copied build/client static assets to public folder for Vercel');
