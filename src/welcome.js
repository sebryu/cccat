import fs from 'node:fs';
import pc from 'picocolors';
import { isInstalled, install, CLAUDE_SETTINGS } from './claude.js';
import { saveSettings, loadSettings, SETTINGS_PATH } from './settings.js';

export function runDefaultInstall() {
  // Make the settings file discoverable on disk even if user never opens config.
  if (!fs.existsSync(SETTINGS_PATH)) saveSettings(loadSettings());

  if (isInstalled()) {
    process.stdout.write(
      [
        '',
        pc.bold('  ≽^•⩊•^≼  cccat is already set up.'),
        '',
        `  ${pc.dim('Customize:')}  ${pc.cyan('cccat config')}`,
        `  ${pc.dim('Preview:')}    ${pc.cyan('cccat preview')}`,
        `  ${pc.dim('Remove:')}     ${pc.cyan('cccat uninstall')}`,
        `  ${pc.dim('Settings:')}   ${pc.dim(SETTINGS_PATH)}`,
        '',
      ].join('\n')
    );
    return;
  }

  const { command, backupPath } = install({ runtime: 'bun' });
  process.stdout.write(
    [
      '',
      pc.bold(pc.green('  ✓ cccat installed!')),
      '',
      `  ${pc.dim('Status line:')}  ${pc.dim(CLAUDE_SETTINGS)}`,
      ...(backupPath ? [`  ${pc.dim('Backup:')}       ${pc.dim(backupPath)}`] : []),
      `  ${pc.dim('Settings:')}     ${pc.dim(SETTINGS_PATH)}`,
      `  ${pc.dim('Command:')}      ${pc.cyan(command)}`,
      '',
      `  ${pc.dim('Try:')} ${pc.cyan('cccat preview')}    ${pc.dim('— animated preview')}`,
      `  ${pc.dim('     ')} ${pc.cyan('cccat config')}     ${pc.dim('— pick colors etc.')}`,
      '',
      pc.dim('  Restart Claude Code to see the cat above your prompt.'),
      '',
    ].join('\n')
  );
}
