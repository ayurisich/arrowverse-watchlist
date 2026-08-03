# Arrowverse Watchlist

A watch-order tracker for the Arrowverse TV universe. Covers all shows in the recommended crossover viewing order so you never miss a multi-show event.

**Live site:** https://ayurisich.github.io/arrowverse-watchlist

## Features

- Full episode list across all Arrowverse series in recommended watch order
- Check off episodes as you watch them — progress is saved in your browser
- Filter out any series you're not following
- Progress bar showing how far through the list you are
- "Hide watched" toggle to focus on what's next
- Color-coded rows by series
- Dark mode

## Shows included

Arrow · The Flash · DC's Legends of Tomorrow · Supergirl · Constantine · Vixen · Freedom Fighters: The Ray · Batwoman · Black Lightning · Stargirl · Superman & Lois

## Running locally

```bash
npm install
npm run dev
```

## Tech

React 19 + Vite. No backend — episode data is a static JSON file and watch progress lives in `localStorage`.
