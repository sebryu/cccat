import { loadSettings } from './settings.js';
import { loadAnimation } from './animations.js';
import { colorize } from './color.js';
import { prepareFrame, pickFrameIndex } from './frame.js';

export function render() {
  const settings = loadSettings();
  let anim;
  try {
    anim = loadAnimation(settings.animation);
  } catch (err) {
    process.stdout.write(String(err.message));
    return;
  }

  const time = Math.floor(Date.now() / 1000);
  const idx = pickFrameIndex(anim.frames.length, settings.frameSeconds, time);
  const lines = colorize(prepareFrame(anim.frames[idx], settings), settings.color, {
    ...settings,
    time,
  });

  process.stdout.write(lines.join('\n'));
}
