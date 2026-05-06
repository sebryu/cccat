import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { USER_ANIM_DIR } from './settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILTIN_ANIM_DIR = path.resolve(__dirname, '..', 'animations');

export function listAnimations() {
  const map = new Map();
  for (const [dir, source] of [[BUILTIN_ANIM_DIR, 'built-in'], [USER_ANIM_DIR, 'user']]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.txt')) continue;
      const name = file.slice(0, -4);
      map.set(name, { name, path: path.join(dir, file), source });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function loadAnimation(name) {
  const found = listAnimations().find((a) => a.name === name);
  if (!found) {
    const available = listAnimations().map((a) => a.name).join(', ') || '(none)';
    throw new Error(`animation not found: "${name}". available: ${available}`);
  }
  const text = fs.readFileSync(found.path, 'utf8');
  const frames = text
    .split(/\r?\n---FRAME---\r?\n/)
    .map((chunk) => chunk.replace(/\r?\n$/, '').split(/\r?\n/));
  return { ...found, frames };
}
