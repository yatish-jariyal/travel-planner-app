import type { JSX, KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  selectFlights,
  selectFlightsError,
  selectFlightsStatus,
} from "../flights/flights.slice";
import {
  selectAttractions,
  selectHotels,
  selectTravelError,
  selectTravelStatus,
} from "../travel-info/travelInfo.slice";
import { useAppSelector } from "../../app/hooks";
import FlightsList from "../flights/components/FlightsList";
import AttractionsList from "../travel-info/components/AttractionsList";
import HotelsList from "../travel-info/components/HotelsList";
import AsyncResult from "../../shared/components/AsyncResult";

type TabId = "flights" | "hotels" | "attractions";

interface TabDefinition {
  id: TabId;
  label: string;
  activeClassName: string;
  indicatorClassName: string;
  icon: JSX.Element;
}

const tabs: TabDefinition[] = [
  {
    id: "flights",
    label: "Flights",
    activeClassName: "text-blue-600",
    indicatorClassName: "bg-blue-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),
  },
  {
    id: "hotels",
    label: "Hotels",
    activeClassName: "text-indigo-600",
    indicatorClassName: "bg-indigo-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
  },
  {
    id: "attractions",
    label: "Attractions",
    activeClassName: "text-amber-600",
    indicatorClassName: "bg-amber-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
      />
    ),
  },
];

const TravelResultsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("flights");
  const hotels = useAppSelector(selectHotels);
  const attractions = useAppSelector(selectAttractions);
  const flights = useAppSelector(selectFlights).flights;
  const flightsStatus = useAppSelector(selectFlightsStatus);
  const flightsError = useAppSelector(selectFlightsError);
  const travelStatus = useAppSelector(selectTravelStatus);
  const travelError = useAppSelector(selectTravelError);
  const navigate = useNavigate();

  useEffect(() => {
    if (flightsStatus === "idle" && travelStatus === "idle") {
      navigate("/", { replace: true });
    }
  }, [flightsStatus, navigate, travelStatus]);

  const focusTab = (tabId: TabId) => {
    setActiveTab(tabId);
    requestAnimationFrame(() => document.getElementById(`tab-${tabId}`)?.focus());
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      focusTab(tabs[nextIndex].id);
    }
  };

  const failures = [
    flightsStatus === "failed" ? `Flights: ${flightsError}` : null,
    travelStatus === "failed"
      ? `Hotels and attractions: ${travelError}`
      : null,
  ].filter((message): message is string => Boolean(message));

  return (
    <main className="max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between gap-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Your travel options</h1>
        <button
          type="button"
          className="rounded-md border border-teal-700 px-4 py-2 text-teal-800 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          onClick={() => navigate("/")}
        >
          Edit search
        </button>
      </div>

      {failures.length > 0 && (
        <div
          className="mx-6 mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Some results could not be loaded.</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {failures.map((failure) => (
              <li key={failure}>{failure}</li>
            ))}
          </ul>
        </div>
      )}

      <nav className="bg-white border-b shadow-sm" aria-label="Travel results">
        <div className="w-fit mx-auto flex" role="tablist">
          {tabs.map((tab, index) => (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              type="button"
              className={`py-4 px-6 font-medium text-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-600 ${
                activeTab === tab.id
                  ? tab.activeClassName
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <span className="flex items-center cursor-pointer">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <span
                  className={`absolute bottom-0 left-0 w-full h-1 ${tab.indicatorClassName}`}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      <section
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        role="tabpanel"
        tabIndex={0}
        className="bg-white shadow-sm rounded-lg m-6"
      >
        {activeTab === "flights" && (
          <AsyncResult
            status={flightsStatus}
            error={flightsError}
            label="Flights"
          >
            <FlightsList flights={flights} />
          </AsyncResult>
        )}
        {activeTab === "hotels" && (
          <AsyncResult status={travelStatus} error={travelError} label="Hotels">
            <HotelsList hotels={hotels} />
          </AsyncResult>
        )}
        {activeTab === "attractions" && (
          <AsyncResult
            status={travelStatus}
            error={travelError}
            label="Attractions"
          >
            <AttractionsList attractions={attractions} />
          </AsyncResult>
        )}
      </section>
    </main>
  );
};

export default TravelResultsPage;
