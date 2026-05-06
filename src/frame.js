const PAD = '⠀';

export function trimEdges(lines) {
  let s = 0;
  let e = lines.length;
  while (s < e && /^\s*$/.test(lines[s])) s++;
  while (e > s && /^\s*$/.test(lines[e - 1])) e--;
  return lines.slice(s, e);
}

export function padLeading(line) {
  const m = line.match(/^( *)(.*)$/);
  return PAD.repeat(m[1].length) + m[2];
}

export function prepareFrame(rawLines, { trim = 'edges' } = {}) {
  const lines = trim === 'none' ? rawLines : trimEdges(rawLines);
  return lines.map(padLeading);
}

export function pickFrameIndex(total, frameSeconds, time = Math.floor(Date.now() / 1000)) {
  return Math.floor(time / Math.max(1, frameSeconds)) % total;
}
