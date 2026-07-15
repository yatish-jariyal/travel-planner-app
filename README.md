# Travel Planner App

A full-stack React and Node travel-planning application that searches Google Flights data through SerpApi and uses Gemini to suggest hotels and attractions. Provider credentials stay in the project-owned API and are never compiled into the browser bundle.

## Features

- Search a local public-domain index of scheduled-service airports, including
  all-airports metro suggestions for cities with multiple airports.
- Search for round-trip flight options for selected travel dates.
- Cache identical flight searches to conserve the personal-project quota.
- Generate hotel and attraction suggestions with Gemini Flash and automatically
  fall back to Flash Lite when the primary model's free quota is exhausted.
- Enrich attractions with optional Google image search or free-license
  Wikipedia page thumbnails.
- Optionally enrich attraction images through Google Custom Search.
- Preserve partial results when one provider fails.
- Validate browser requests at a rate-limited backend boundary.

## Architecture

```text
React browser -> /api -> Node/Express API -> SerpApi Google Flights
                         ├──> local OurAirports index
                         ├──> Gemini
                         └──> Google Custom Search (optional)
```

The browser receives only `VITE_API_BASE_URL`, which is a public address. SerpApi and Google keys are read only by the backend.

## Tech stack

- React 19, TypeScript, Vite, Tailwind CSS
- Redux Toolkit, React Redux, React Router
- Node 22, Express 5, Zod
- Google Gen AI SDK and Axios
- Vitest and Supertest

## Getting started

### Prerequisites

- Node.js 22 (pinned in `.nvmrc`)
- npm
- A SerpApi key
- A restricted Gemini API key

### Installation

```bash
git clone https://github.com/yatish-jariyal/travel-planner-app.git
cd travel-planner-app
nvm use
npm ci
cp .env.example .env
```

Replace the backend placeholders in `.env`. Never commit that file. See the [environment setup guide](docs/ENVIRONMENT_SETUP.md) for the migration from the old `VITE_*` names.

Start the API and Vite development server together:

```bash
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to `http://localhost:3000` during development.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the backend and frontend development servers. |
| `npm run dev:server` | Start only the backend with file watching. |
| `npm run dev:web` | Start only Vite. |
| `npm run build` | Type-check and build the backend and frontend. |
| `npm run start` | Start the compiled backend. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run frontend and backend tests once. |
| `npm run preview` | Preview the frontend production build. |

## Project structure

```text
server/                # Express API, validation, provider adapters, tests
src/
├── components/        # Form, navigation, and result UI
├── redux/             # Store, async thunks, slices, and interfaces
├── utils/             # Project API client, payloads, and formatting
├── App.tsx
└── main.tsx
```

## Documentation

- [Environment setup](docs/ENVIRONMENT_SETUP.md)
- [Backend deployment](docs/BACKEND_DEPLOYMENT.md)
- [Credential rotation record](docs/CREDENTIAL_ROTATION.md)
- [Production readiness](docs/PRODUCTION_READINESS.md)
- [Development plan](plan.md)
- [Task tracker](tasks.md)
- [Codebase review](docs/CODEBASE_REVIEW.md)

## Contribution workflow

Keep each pull request focused, review the diff, and run:

```bash
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

Do not commit credentials, `.env`, generated builds, or unrelated changes.

## Current status

Secret-bearing provider operations have moved out of the browser, and the
historically exposed Google API key plus the unidentified user-managed
service-account key have been deleted. Production deployment now depends on
configuring the chosen hosting environment with a secret manager, HTTPS,
monitoring, and an approved frontend origin.
