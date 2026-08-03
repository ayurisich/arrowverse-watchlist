# UI Cleanup Design

**Date:** 2026-08-02  
**Status:** Approved

## Overview

Five targeted UI cleanups to the Arrowverse watchlist app (`src/App.jsx`, `src/App.css`). Each change ships as its own commit, tested locally and pushed to remote before moving to the next.

## Changes

### 1. Remove "Original Air Date" column
- Delete `<th className="col-date">` and its corresponding `<td className="col-date">{ep.airDate}</td>` from the table.
- Remove `.col-date` CSS rule.

### 2. Remove "Source" (link) column
- Delete `<th className="col-source">` and its corresponding `<td className="col-source">` block from the table.
- Remove `.col-source` and `.col-source a` CSS rules.
- Remove the dark-mode rule `.dark-mode #episode-list td a` (no longer needed).

### 3. Remove the date filter
- Delete the entire `date-filter` div (both `<input type="date">` elements and the ✕ clear button).
- Remove `fromDate` and `toDate` state declarations.
- Remove the two date-comparison lines from the `filtered` useMemo.
- Remove CSS: `.date-filter`, `.date-input`, `.date-input.dark-input`, `.clear-dates-btn`, `.clear-dates-btn:hover`.
- Note: `darkMode` state is kept — it is used by other parts of the app.

### 4. Add side margins to the list
- Add `padding: 0 24px` to `.table-wrap` in `App.css`.

### 5. Remove sort toggle + add confirm() to destructive buttons
- Remove the "NEWEST FIRST / OLDEST FIRST" `<button>` and its preceding `<span className="sep">` from the toggle row.
- Remove `newestFirst` state declaration.
- Remove `if (newestFirst) list = [...list].reverse()` from the `filtered` useMemo.
- Remove `newestFirst` from the `filtered` useMemo dependency array.
- Add `if (!window.confirm('Mark all episodes as watched?')) return` at the top of `markAllWatched`.
- Add `if (!window.confirm('Clear all watched progress?')) return` at the top of `clearWatched`.

## Commit & Deploy Workflow

For each change:
1. Make the code edit
2. Start dev server and visually verify in browser
3. `git commit`
4. `git push`

## Out of Scope

- No new features
- No other UI changes beyond the five listed
