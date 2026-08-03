# UI Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unused columns, date filter, and sort toggle; add side margins; add confirm dialogs to destructive buttons — one commit + push per change.

**Architecture:** All changes are in two files: `src/App.jsx` (logic + JSX) and `src/App.css` (styles). No new files. No new dependencies. Each task is self-contained and independently verifiable in the browser.

**Tech Stack:** React 19, Vite 8, plain CSS. No test framework — verification is visual via `npm run dev` + Playwright browser.

## Global Constraints

- Each task ends with `git commit` followed by `git push` before moving to the next task.
- Visual verification is done via a running `npm run dev` server before committing.
- Do not add features, abstractions, or refactors beyond what each task requires.
- `darkMode` state is kept — it is used by other parts of the app unrelated to the date filter.

---

### Task 1: Remove "Original Air Date" column

**Files:**
- Modify: `src/App.jsx` — delete `col-date` `<th>` and `<td>`
- Modify: `src/App.css` — delete `.col-date` rule

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: nothing consumed by other tasks

- [ ] **Step 1: Edit `src/App.jsx`**

  In the `<thead>` block, delete this line:
  ```jsx
  <th className="col-date">Original Air Date</th>
  ```

  In the `<tbody>` row, delete this line:
  ```jsx
  <td className="col-date">{ep.airDate}</td>
  ```

- [ ] **Step 2: Edit `src/App.css`**

  Delete this rule:
  ```css
  .col-date { width: 160px; white-space: nowrap; }
  ```

- [ ] **Step 3: Verify in browser**

  The episode table must have no "Original Air Date" column and no blank column where it was. All other columns render correctly.

- [ ] **Step 4: Commit and push**

  ```bash
  git add src/App.jsx src/App.css
  git commit -m "remove Original Air Date column from episode table"
  git push
  ```

---

### Task 2: Remove "Source" (link) column

**Files:**
- Modify: `src/App.jsx` — delete `col-source` `<th>` and `<td>`
- Modify: `src/App.css` — delete `.col-source`, `.col-source a`, and `.dark-mode #episode-list td a` rules

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: nothing consumed by other tasks

- [ ] **Step 1: Edit `src/App.jsx`**

  In the `<thead>` block, delete this line:
  ```jsx
  <th className="col-source">Source</th>
  ```

  In the `<tbody>` row, delete this entire block:
  ```jsx
  <td className="col-source">
    {ep.sourceUrl ? (
      <a href={ep.sourceUrl} target="_blank" rel="noreferrer" title="Source">🔗</a>
    ) : null}
  </td>
  ```

- [ ] **Step 2: Edit `src/App.css`**

  Delete these three rules:
  ```css
  .col-source { width: 56px; text-align: center; }

  .col-source a {
    text-decoration: none;
    font-size: 1rem;
  }

  /* Dark mode table links */
  .dark-mode #episode-list td a {
    color: #d3d3d3;
  }
  ```

- [ ] **Step 3: Verify in browser**

  The episode table must have no "Source" column and no blank column where it was. Toggle dark mode and confirm no regressions.

- [ ] **Step 4: Commit and push**

  ```bash
  git add src/App.jsx src/App.css
  git commit -m "remove Source link column from episode table"
  git push
  ```

---

### Task 3: Remove the date filter

**Files:**
- Modify: `src/App.jsx` — remove state, JSX, and filtering logic
- Modify: `src/App.css` — remove date-filter CSS rules

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: nothing consumed by other tasks

- [ ] **Step 1: Edit `src/App.jsx` — remove state**

  Delete these two state declarations:
  ```jsx
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  ```

- [ ] **Step 2: Edit `src/App.jsx` — remove filtering logic**

  In the `filtered` useMemo, delete these two lines:
  ```jsx
  if (fromDate && new Date(ep.airDate) < new Date(fromDate)) return false
  if (toDate && new Date(ep.airDate) > new Date(toDate)) return false
  ```

  Also update the dependency array — remove `fromDate` and `toDate`:
  ```jsx
  // Before:
  }, [excludedSeries, fromDate, toDate, newestFirst, showOnlyUnwatched, watched])
  // After:
  }, [excludedSeries, newestFirst, showOnlyUnwatched, watched])
  ```

- [ ] **Step 3: Edit `src/App.jsx` — remove JSX**

  Delete the entire `date-filter` div:
  ```jsx
  <div className="date-filter">
    <input
      type="date"
      className={`date-input${darkMode ? ' dark-input' : ''}`}
      value={fromDate}
      onChange={e => setFromDate(e.target.value)}
      aria-label="From date"
    />
    <input
      type="date"
      className={`date-input${darkMode ? ' dark-input' : ''}`}
      value={toDate}
      onChange={e => setToDate(e.target.value)}
      aria-label="To date"
    />
    {(fromDate || toDate) && (
      <button className="clear-dates-btn" onClick={() => { setFromDate(''); setToDate('') }}>✕</button>
    )}
  </div>
  ```

- [ ] **Step 4: Edit `src/App.css` — remove date-filter rules**

  Delete these five rules:
  ```css
  .date-filter {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }

  .date-input {
    padding: 4px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.85rem;
    background: #fff;
    color: #212529;
  }

  .date-input.dark-input {
    background: #000;
    color: #d3d3d3;
    border-color: #555;
  }

  .clear-dates-btn {
    background: none;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 3px 7px;
    cursor: pointer;
    font-size: 0.8rem;
    color: #666;
  }

  .clear-dates-btn:hover {
    background: #f0f0f0;
  }
  ```

- [ ] **Step 5: Verify in browser**

  The date inputs must be gone. Series filter buttons still appear and work. The `filtered` list still updates correctly when toggling series or "Hide Watched".

- [ ] **Step 6: Commit and push**

  ```bash
  git add src/App.jsx src/App.css
  git commit -m "remove date filter"
  git push
  ```

---

### Task 4: Add side margins to the episode list

**Files:**
- Modify: `src/App.css` — add horizontal padding to `.table-wrap`

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: nothing consumed by other tasks

- [ ] **Step 1: Edit `src/App.css`**

  Find the existing `.table-wrap` rule:
  ```css
  .table-wrap {
    overflow-x: auto;
  }
  ```

  Change it to:
  ```css
  .table-wrap {
    overflow-x: auto;
    padding: 0 24px;
  }
  ```

- [ ] **Step 2: Verify in browser**

  The episode table must have visible breathing room on both left and right sides. The table must still scroll horizontally on narrow viewports (overflow-x: auto is preserved).

- [ ] **Step 3: Commit and push**

  ```bash
  git add src/App.css
  git commit -m "add side margins to episode list"
  git push
  ```

---

### Task 5: Remove sort toggle and add confirm dialogs to destructive buttons

**Files:**
- Modify: `src/App.jsx` — remove sort state/logic/JSX; add confirm guards

**Interfaces:**
- Consumes: nothing from other tasks
- Produces: nothing consumed by other tasks

- [ ] **Step 1: Edit `src/App.jsx` — remove sort state**

  Delete this line:
  ```jsx
  const [newestFirst, setNewestFirst] = useState(false)
  ```

- [ ] **Step 2: Edit `src/App.jsx` — remove sort logic from filtered**

  Delete this line from inside the `filtered` useMemo:
  ```jsx
  if (newestFirst) list = [...list].reverse()
  ```

  Update the dependency array — remove `newestFirst`:
  ```jsx
  // Before:
  }, [excludedSeries, newestFirst, showOnlyUnwatched, watched])
  // After:
  }, [excludedSeries, showOnlyUnwatched, watched])
  ```

- [ ] **Step 3: Edit `src/App.jsx` — remove sort JSX from toggle row**

  Delete the sort button and its preceding separator from the toggle row:
  ```jsx
  <span className="sep">|</span>
  <button className="toggle-link" onClick={() => setNewestFirst(v => !v)}>
    {newestFirst ? 'OLDEST FIRST' : 'NEWEST FIRST'}
  </button>
  ```

- [ ] **Step 4: Edit `src/App.jsx` — add confirm to markAllWatched**

  Find the `markAllWatched` callback:
  ```jsx
  const markAllWatched = useCallback(() => {
    const allNums = new Set(episodesData.map(e => e.num))
    saveWatched(allNums)
    setWatched(allNums)
  }, [])
  ```

  Add a confirm guard at the top:
  ```jsx
  const markAllWatched = useCallback(() => {
    if (!window.confirm('Mark all episodes as watched?')) return
    const allNums = new Set(episodesData.map(e => e.num))
    saveWatched(allNums)
    setWatched(allNums)
  }, [])
  ```

- [ ] **Step 5: Edit `src/App.jsx` — add confirm to clearWatched**

  Find the `clearWatched` callback:
  ```jsx
  const clearWatched = useCallback(() => {
    saveWatched(new Set())
    setWatched(new Set())
  }, [])
  ```

  Add a confirm guard at the top:
  ```jsx
  const clearWatched = useCallback(() => {
    if (!window.confirm('Clear all watched progress?')) return
    saveWatched(new Set())
    setWatched(new Set())
  }, [])
  ```

- [ ] **Step 6: Verify in browser**

  - The "NEWEST FIRST / OLDEST FIRST" button must be gone from the toggle row.
  - Clicking "Mark all watched" must show a browser confirm dialog before acting.
  - Clicking "Clear all" must show a browser confirm dialog before acting.
  - Cancelling either dialog must leave watched state unchanged.

- [ ] **Step 7: Commit and push**

  ```bash
  git add src/App.jsx
  git commit -m "remove sort toggle; add confirm dialogs to destructive buttons"
  git push
  ```

---

## Done

After all 5 tasks: run `npm run dev` and do a final walkthrough — table shows only #, ✓, Series, Episode, Name columns; no date inputs; 24px side margins; no sort button; both destructive buttons prompt before acting.
