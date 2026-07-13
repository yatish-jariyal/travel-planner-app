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

- Node.js 18 or newer
- npm
- Amadeus API credentials
- A Gemini API key

### Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/yatish-jariyal/travel-planner-app.git
   cd travel-planner-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local `.env` file with the required credentials. The current application expects these variables:

   ```dotenv
   VITE_TOKEN_URL=https://test.api.amadeus.com/v1/security/oauth2/token
   VITE_CLIENT_ID=your_amadeus_client_id
   VITE_CLIENT_SECRET=your_amadeus_client_secret
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

   Do not commit `.env`. A safer credential architecture and a checked-in `.env.example` are planned in the roadmap.

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

This project is under active development. The codebase review identifies reliability, security, error-state, and test-coverage work that should be completed before production deployment.
