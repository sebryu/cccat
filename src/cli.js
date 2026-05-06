#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const cmd = args[0];

async function main() {
  if (cmd === '-h' || cmd === '--help') return printHelp();
  if (cmd === '-v' || cmd === '--version') return printVersion();

  if (cmd === 'render') {
    const { render } = await import('./render.js');
    return render();
  }
  if (cmd === 'preview') {
    const { livePreview } = await import('./preview.js');
    return livePreview({ durationMs: 5000 });
  }
  if (cmd === 'install' || cmd === 'pspsps') {
    const { install } = await import('./claude.js');
    const runtime = args.includes('--node')
      ? 'node'
      : args.includes('--bun')
        ? 'bun'
        : undefined;
    const { path: p, command, backupPath } = install({ runtime });
    process.stdout.write(`installed: ${command}\n  -> ${p}\n`);
    if (backupPath) process.stdout.write(`  backup: ${backupPath}\n`);
    return;
  }
  if (cmd === 'uninstall' || cmd === 'shoo') {
    const { uninstall } = await import('./claude.js');
    const result = uninstall();
    if (!result.removed) {
      process.stdout.write('cccat was not installed\n');
      return;
    }
    process.stdout.write('uninstalled\n');
    if (result.restoredCommand) {
      process.stdout.write(`  restored previous statusLine: ${result.restoredCommand}\n`);
      process.stdout.write(`  from: ${result.backupPath}\n`);
    }
    return;
  }
  if (cmd === 'config') {
    if (!process.stdin.isTTY) {
      process.stderr.write('cccat config: requires a TTY\n');
      process.exit(1);
    }
    const { tui } = await import('./tui.js');
    return tui();
  }

  // No subcommand:
  //   piped stdin (Claude Code calling) → render one frame
  //   TTY (user just ran `bunx cccat`) → idempotent install + status
  if (!process.stdin.isTTY) {
    const { render } = await import('./render.js');
    return render();
  }
  const { runDefaultInstall } = await import('./welcome.js');
  return runDefaultInstall();
}

function printVersion() {
  const pkgPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
  const { version } = JSON.parse(readFileSync(pkgPath, 'utf8'));
  process.stdout.write(version + '\n');
}

function printHelp() {
  process.stdout.write(
    [
      'cccat — a cat status line for Claude Code',
      '',
      'Usage:',
      '  cccat                   first run: install. otherwise: show status.',
      '                          (piped stdin → render one frame)',
      '  cccat config            interactive config (TUI)',
      '  cccat preview           5-second animated preview in your terminal',
      '  cccat pspsps [--node|--bun]',
      '                          add cccat to ~/.claude/settings.json (call the cat in)',
      '                          runtime is auto-detected (bunx if available, else npx)',
      '  cccat install           alias for pspsps',
      '  cccat shoo              remove cccat from ~/.claude/settings.json',
      '                          (restores previous statusLine if a backup exists)',
      '  cccat uninstall         alias for shoo',
      '  cccat render            render one frame to stdout',
      '  cccat --version         print version',
      '  cccat --help            this help',
      '',
      'Settings: $XDG_CONFIG_HOME/cccat/settings.json (defaults baked in).',
      'Custom animations: drop .txt files into ~/.config/cccat/animations/.',
      '',
    ].join('\n')
  );
}

main().catch((err) => {
  process.stderr.write(`cccat: ${err.message || err}\n`);
  process.exit(1);
});
