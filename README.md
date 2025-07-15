# Travel Planner App

A web-based Travel Planner application that helps users search for airports, create and manage itineraries, and generate travel suggestions using modern web technologies.

## Key Features

- **Airport Search:** Look up airports by code or name using the `@nwpr/airport-codes` database.
- **Itinerary Management:** Add, edit, and remove destinations to build a complete travel plan.
- **Interactive Tabs:** Navigate between different parts of your trip with the `TravelTabs` component.
- **State Management:** Leverage Redux Toolkit (`@reduxjs/toolkit`) for predictable and centralized application state.
- **AI-Powered Suggestions:** Integrate with Google Generative AI (`@google/generative-ai`) to get personalized travel recommendations.
- **Utilities:** Shared helper functions in `src/utils/helper.ts` for common tasks like formatting dates and handling API requests.

## Tech Stack

- **React** + **TypeScript**
- **Vite** for fast development builds and HMR
- **Tailwind CSS** for utility-first styling
- **Redux Toolkit** for state management
- **Axios** for HTTP requests

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yatish-jariyal/travel-planner-app.git
   cd travel-planner-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Available Scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Build for production (output to `dist/`)
- **`npm run preview`**: Preview the production build
- **`npm run lint`**: Run ESLint checks

### Running the App

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## Project Structure

```
travel-planner-app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   └── common/
│   │       └── TravelTabs.tsx  # Tab navigation for itinerary
│   ├── redux/
│   │   └── store.ts    # Redux store configuration
│   ├── utils/
│   │   └── helper.ts   # Shared helper functions
│   └── main.tsx        # Application entry point
├── .eslintrc.js        # Linting rules
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project metadata and scripts
```
