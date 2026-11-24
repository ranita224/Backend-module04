# Day 57: Campus Events Frontend (Next.js + TypeScript + Fetch)

Step-by-step guide: from a fresh clone to a pushed, working project. All commands are for **Git Bash** on Windows (they also work on macOS/Linux).

## Repository layout

```
campus/                          <- the Git repository
  day-56/                        <- NestJS Campus Events API (JWT auth added)
  day-57/
    STEPS.md                     <- this file
    campus-events-frontend/      <- the Next.js frontend
```

Work for this day is on the branch **`day-57-frontend`**.

---

## PART 1: Install

You need **Node.js 20.9 or newer** (`node -v`).

```bash
# the API
cd campus/day-56
npm install

# the frontend
cd ../day-57/campus-events-frontend
npm install
cp .env.example .env.local
```

On Windows Command Prompt use `copy .env.example .env.local`.

`.env.local` holds the API address. It must include `/api`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_TIMEZONE=Africa/Addis_Ababa
```

`.env.local` is ignored by Git on purpose. Each person creates their own from `.env.example`.

## PART 2: Run the API and the frontend together

You need **two terminals open at the same time**. Never type in the API terminal while it is running.

**Terminal 1: the API**

```bash
cd campus/day-56
npm run start:dev
```

Wait for "Nest application successfully started". Check it: open http://localhost:3000/api/events in the browser. You should see JSON with `items`, `total`, `page`, `limit`, `totalPages`.

The event routes (`GET /api/events...` and `POST /api/events`) work without a login, so the frontend needs no token.

**Terminal 2: the frontend**

```bash
cd campus/day-57/campus-events-frontend
npm run dev
```

Wait for "Ready", then open **http://localhost:3001** in Chrome or Edge.

Why 3001? NestJS and Next.js both default to port 3000. The `dev` script in `package.json` moves the frontend to 3001.

If you change `.env.local`, stop the frontend (Ctrl+C) and run `npm run dev` again.

## PART 3: Test everything (part of your marks)

| #   | Do this                                                    | You should see                                                        |
| --- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Open `/`                                                   | Hero, "Next on campus" card, 3 upcoming events                        |
| 2   | Click **Explore Events**                                   | 5 event cards, pagination at the bottom                               |
| 3   | Category = Technology                                      | Only technology events                                                |
| 4   | Type `main` in Location                                    | Only events whose location contains "main"                            |
| 5   | Type `hack` in the search box                              | Only the Hackathon card; note says "1 of 5 events on this page match" |
| 6   | Sort by Title, Order Descending                            | The order changes                                                     |
| 7   | Click **Next** / page numbers                              | Page 2 appears, the URL has `page=2`                                  |
| 8   | Click **View Details**                                     | The right event opens                                                 |
| 9   | Look at the Sessions list                                  | Only that event's sessions; click one to open the session page        |
| 10  | Go to `http://localhost:3001/events/not-real`              | "Event not found" message                                             |
| 11  | Create an event with every field filled                    | Green success message, then you are taken to the new event            |
| 12  | Click **Create event** with empty fields                   | Red messages under each missing field                                 |
| 13  | **Stop the API** (Ctrl+C in terminal 1), refresh `/events` | A clear error message, no crash. Start the API again afterwards       |

The API keeps events in memory, so events you create disappear when the API restarts. That is normal.

To see a new event in the list, sort by **Event date, Descending**, or go to the last page.

## PART 4: Screenshots (required)

Replace the example images in `day-57/campus-events-frontend/docs/screenshots/` with your own. Keep the same file names:

- `home.png`: home page
- `events.png`: all events with filters
- `detail.png`: event details with sessions
- `session.png`: session page
- `create-errors.png`: form validation errors
- `create-success.png`: success message
- `mobile.png`: home page at phone size (browser F12, then the phone icon)

Evidence of API integration: a screenshot of the browser **Network** tab (F12, Network) showing a request to `/events` while you change a filter.

## PART 5: Understand it before you present

Every team member must explain the code. Learn these six points:

1. **Pages are Server Components.** `src/app/events/page.tsx` runs on the server, calls `getEvents()` and sends finished HTML to the browser.
2. **`"use client"` only where needed.** Filters, search, navbar and the create form need the browser (state, events), so only those files have it.
3. **All fetch calls are in one file:** `src/services/eventService.ts`. It checks `response.ok`, converts JSON with `response.json()`, and for POST sends `JSON.stringify(event)` with `Content-Type: application/json`.
4. **Filters live in the URL.** Changing a dropdown changes `?category=technology`; the server page reads those values and asks the API with the same query parameters.
5. **Search is frontend-only,** as the guide says. `EventsResults.tsx` filters the events already fetched for the current page.
6. **Why `/backend/...`?** The NestJS API does not allow requests from another origin (CORS). `next.config.ts` forwards browser requests to the API, so nothing in the backend had to change. Do not delete `next.config.ts`.

Be ready to answer: _"How does Next.js communicate with the NestJS API using fetch?"_ (points 3 and 6).

## PART 6: Push to GitHub

Press Ctrl+C in both terminals first. Then from the repository root:

```bash
cd campus
git status
```

Check the list:

- You should see `day-56/...` as renamed and `day-57/...` as new.
- You should **not** see `node_modules/`, `.next/`, `dist/` or `.env.local`. If you do, stop and fix `.gitignore` before going on.
- `day-57/campus-events-frontend` must not contain its own `.git` folder.

Then:

```bash
git add -A
git commit -m "Organise repo: API in day-56, Campus Events frontend in day-57"
git push -u origin day-57-frontend
```

If `git push` is rejected, run `git pull --rebase`, then push again.

### After you push

1. Open the repository on GitHub and switch to the `day-57-frontend` branch.
2. Check that `day-56` and `day-57` appear side by side.
3. Open `day-57/campus-events-frontend` and check that `README.md` and `docs/screenshots/` are there.
4. Optional but smart: clone it into another folder, run the install steps from Part 1, and start it. If it works for you, it will work for your teacher.

## PART 7: Submit

The guide asks for five things:

1. GitHub repository link (the `day-57-frontend` branch, or `main` after merging).
2. README: `day-57/campus-events-frontend/README.md`.
3. Screenshots of the main pages: `docs/screenshots/`.
4. Evidence of API integration (Network tab screenshot or a short recording).
5. A working application that communicates with your NestJS backend.

## Final demo order

Open app, home, all events, filter by category, search, change sorting, pagination, open an event, show its sessions, create a new event, then explain Fetch between Next.js and NestJS.

---

## If something goes wrong

| Problem                                                         | Fix                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page shows "Could not reach the Campus Events API"              | The API is not running. Start it in its own terminal (`cd campus/day-56`, `npm run start:dev`), check http://localhost:3000/api/events, then refresh.                                                                                                                                                         |
| API works in the browser but the page still shows the error     | Change `.env.local` to `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000/api`, then restart the frontend.                                                                                                                                                                                                       |
| `curl` says "Could not connect to server"                       | The API is not running, or `day-56/.env` has a different `PORT`.                                                                                                                                                                                                                                              |
| `'next' is not recognized`                                      | The install did not finish. Run `npm install --no-audit --no-fund` in the frontend folder and wait for the prompt to return.                                                                                                                                                                                  |
| `npm install` seems stuck                                       | On a slow connection it can take 10 to 20 minutes. Run it alone in one terminal. A progress spinner means it is still working. Do not start it twice.                                                                                                                                                         |
| `EPERM: operation not permitted` during install                 | Close VS Code and every other terminal, run `taskkill //F //IM node.exe` (Git Bash) or `taskkill /F /IM node.exe` (PowerShell), delete `node_modules` in PowerShell with `Remove-Item -Recurse -Force node_modules`, then install again. Add the project folder to Windows Security exclusions if it repeats. |
| `next-swc.win32-x64-msvc.node is not a valid Win32 application` | The compiler download was cut off. Delete `node_modules\@next\swc-win32-x64-msvc`, run `npm cache clean --force`, then `npm install`. If it comes back, install the Node LTS version (22 or 24).                                                                                                              |
| Dev server prints "Ready" but the page will not load            | Read the terminal for warnings. The compiler error above is the usual cause.                                                                                                                                                                                                                                  |
| `taskkill ... node.exe` stopped my API                          | That command stops all Node programs. Start the API again.                                                                                                                                                                                                                                                    |
| "Port 3001 is already in use"                                   | Another copy is running. Stop it, or change the number in the `dev` script of `package.json`.                                                                                                                                                                                                                 |
| Everything is empty / 400 errors                                | The API rejects unknown query names. Do not add your own query parameters to requests.                                                                                                                                                                                                                        |
| Red squiggles in VS Code before installing                      | The packages are not installed yet. Run `npm install` in the frontend folder, then `Ctrl+Shift+P`, "TypeScript: Restart TS Server".                                                                                                                                                                           |
| `git push` rejected                                             | Run `git pull --rebase`, then `git push` again.                                                                                                                                                                                                                                                               |
