import { Route, Routes } from "react-router";
import TravelResultsPage from "../features/travel-results/TravelResultsPage";
import App from "./App";

const AppRouter = () => (
  <Routes>
    <Route path="/travel" element={<TravelResultsPage />} />
    <Route path="/" element={<App />} />
  </Routes>
);

export default AppRouter;
