# cccat

A status line cat for [Claude Code](https://claude.com/claude-code). Relax with a cute cat while Claude does the work.

```
              /\_/\
             ( -.- )
              > w <   purr~
              /___\
```

## Install

Pick whichever runtime you have on hand.

### With bunx

```bash
bunx @sebryu/cccat pspsps
```

### With npx

```bash
npx -y @sebryu/cccat pspsps
```

Either one writes the status line into `~/.claude/settings.json`, pinned to this version — no silent auto-upgrade every refresh.

## Commands

```bash
cccat pspsps     # call the cat in   (alias: install)
cccat shoo       # send it away      (alias: uninstall — restores any previous statusLine)
cccat config     # interactive config: colors, paths
cccat preview    # 5-second animated preview
```

To upgrade later: `bunx @sebryu/cccat@latest pspsps` (the `@latest` is needed to bust bunx's cache).

## License

MIT
