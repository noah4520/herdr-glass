# Changelog

Herdr Glass follows [semantic versioning](https://semver.org): a patch release fixes things, a
minor release adds something or re-clones the mods for a newer Herdr, and a major release
changes file names or needs a fresh install. The current number is in `VERSION`.

## 0.1.1 — 2026-11-25

Built on herdr-app 0.1.18: the cloned mods are re-based on Herdr 0.1.18's, keeping Herdr
Glass's changes.

- **Pane headers** show a pane's name set with `pane.rename`.
- **Status bar** says how many agents need you.
- **Agents**: cleaner titles (status emoji), sub-agents count toward their parent's urgency,
  and on the folded rail the focused agent is highlighted with its number.
- **Spaces**: repository names for bare repos and their worktrees, and a space named with a
  leading emoji still hides a branch or repository of the same name.
- **Notifications** that ask for it grow to show every line.
- The sidebar's panel icons follow Herdr's updated set.

## 0.1.0 — 2026-11-17

First release, built on herdr-app 0.1.16.

- **Glass layout.** Translucent rounded cards over a background picture, a
  Ghostty-coloured theme, terminals in rounded frames, and Herdr's bars without their
  divider lines. One spacing throughout: 16px card corners, pills 8px from the edge,
  text and icons 16px in.
- **Sidebar.** Spaces without letter avatars; agents grouped by space, with a fold
  chevron after each space's name; on the macOS rail, the fold button under the traffic
  lights.
- **Appearance dialog.** Five glass levels (Clear to Solid); backgrounds picked from
  `~/.config/herdr-app/backgrounds/`, with Graphite as the default and Sunset, Ocean,
  Forest, Violet, Rose and Aurora copied in on first open; one Components switch between
  the restyled Spaces, Agents, pane headers and notifications and Herdr's own.
- **Notifications** with a colour bar by level and the agent's live title.
- An install script, a recipe for agents, and license notices for the parts
  derived from Herdr.
