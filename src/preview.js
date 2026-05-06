import pc from 'picocolors';
import { loadSettings } from './settings.js';
import { loadAnimation } from './animations.js';
import { colorize } from './color.js';
import { prepareFrame, pickFrameIndex } from './frame.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function livePreview({ durationMs = 5000 } = {}) {
  const settings = loadSettings();
  const anim = loadAnimation(settings.animation);
  const total = anim.frames.length;
  const frameMs = Math.max(100, settings.frameSeconds * 1000);
  const totalSteps = Math.max(1, Math.ceil(durationMs / frameMs));
  const startTime = Math.floor(Date.now() / 1000);
  const startIdx = pickFrameIndex(total, settings.frameSeconds, startTime);

  process.stdout.write(
    `\n${pc.dim(`preview · ${pc.cyan(anim.name)} · color=${settings.color} · ${(durationMs / 1000).toFixed(0)}s`)}\n\n`
  );

  // Hide cursor while we redraw frames in place; restore on exit.
  process.stdout.write('\x1b[?25l');
  let prevLineCount = 0;
  const restore = () => {
    process.stdout.write('\x1b[?25h');
  };
  process.on('SIGINT', () => {
    restore();
    process.exit(130);
  });

  try {
    for (let step = 0; step < totalSteps; step++) {
      const time = startTime + step * settings.frameSeconds;
      const idx = (startIdx + step) % total;
      const lines = colorize(prepareFrame(anim.frames[idx], settings), settings.color, {
        ...settings,
        time,
      });

      if (prevLineCount > 0) {
        process.stdout.write(`\x1b[${prevLineCount}A\x1b[J`);
      }
      process.stdout.write(lines.join('\n') + '\n');
      prevLineCount = lines.length;

      if (step < totalSteps - 1) await sleep(frameMs);
    }
  } finally {
    restore();
    process.stdout.write('\n');
  }
}
