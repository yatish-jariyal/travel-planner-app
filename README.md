# Travel Planner App

A React and TypeScript travel-planning application that searches for flights and uses generative AI to suggest hotels and attractions for a selected destination.

## Features

- Search for origin and destination airports through the Amadeus test API.
- Search for flight offers for a selected departure date.
- Generate hotel and attraction suggestions for the trip dates with Gemini.
- Browse flights, hotels, and attractions in a tabbed results view.
- Keep request results and loading state in Redux Toolkit.

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit and React Redux
- React Router
- Axios
- Google Generative AI SDK
- Amadeus test APIs

## Getting started

### Prerequisites

- Node.js 22 (pinned in `.nvmrc`)
- npm
- Amadeus API credentials
- A Gemini API key

### Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/yatish-jariyal/travel-planner-app.git
   cd travel-planner-app
   ```

2. Select the project Node version and install dependencies:

   ```bash
   nvm use
   npm ci
   ```

3. Copy the safe environment template and replace its placeholders:

   ```bash
   cp .env.example .env
   ```

   See the [environment setup guide](docs/ENVIRONMENT_SETUP.md) for required variables, optional image search, and important client-side security limitations. Never commit `.env`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the automated test suite once. |
| `npm run preview` | Preview the production build locally. |

## Project structure

```text
src/
├── components/       # Form, navigation, flight, hotel, and attraction UI
├── redux/            # Store, async thunks, slices, and data interfaces
├── utils/            # Amadeus, Gemini, token, and formatting helpers
├── App.tsx            # Home page composition
├── index.css          # Global styles
└── main.tsx           # App entry point, provider, and routes
```

## Project documentation

- [Development plan](plan.md) — phased roadmap and success criteria.
- [Task tracker](tasks.md) — implementation checklist grouped by pull request.
- [Codebase review](docs/CODEBASE_REVIEW.md) — current architecture, risks, and recommendations.
- [Environment setup](docs/ENVIRONMENT_SETUP.md) — variables, credential safety, and production architecture.
- [Production readiness](docs/PRODUCTION_READINESS.md) — release gates, API usage, hosting constraints, and remaining blockers.

## Contribution workflow

Keep each pull request focused on one concern:

1. Update local `main`: `git checkout main && git pull origin main`.
2. Create a descriptive branch, such as `fix/travel-data-parsing`.
3. Make and verify only the changes needed for that task.
4. Review `git diff`, then commit with a clear message.
5. Push the branch and open a pull request against `main`.
6. Merge only after checks and review are complete, then update local `main` again.

Do not commit API keys, `.env`, build output, or unrelated changes.

## Current status

This project is under active development. Automated checks and dependency auditing are in place, but production deployment remains blocked until private provider requests move behind a project-owned backend and the previously exposed Google credential is confirmed rotated.
