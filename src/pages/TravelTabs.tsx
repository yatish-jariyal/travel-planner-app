import React, { useEffect, useState, JSX } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectHotels, selectAttractions } from "../redux/travelSlice";
import { selectFlights } from "../redux/flightsSlice";
import FlightsList from "../components/FlightsList";
import HotelsList from "../components/HotelsList";
import AttractionsList from "../components/AttractionsList";

const TravelTabsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "flights" | "hotels" | "attractions" | ""
  >("flights");

  const hotels = useSelector(selectHotels);
  const attractions = useSelector(selectAttractions);
  const flightsState = useSelector(selectFlights);
  const flights = flightsState.flights; // Assuming flightsState has a property 'flights' which is an array of Flight

  const navigate = useNavigate();

  useEffect(() => {
    if (
      hotels.length === 0 &&
      attractions.length === 0 &&
      flights.length === 0
    ) {
      navigate("/");
    }
  }, [hotels, attractions, flights, navigate]);

  const tabs: {
    id: "flights" | "hotels" | "attractions";
    label: string;
    color: string;
    activeColor: string;
    indicatorColor: string;
    icon: JSX.Element;
  }[] = [
    {
      id: "flights",
      label: "Flights",
      color: "blue",
      activeColor: "blue-600",
      indicatorColor: "blue-600",
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
      color: "indigo",
      activeColor: "indigo-600",
      indicatorColor: "indigo-600",
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
      color: "amber",
      activeColor: "amber-600",
      indicatorColor: "amber-600",
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

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div></div>
      <nav className="bg-white border-b shadow-sm">
        <div className="w-fit mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-6 font-medium text-lg transition-colors relative ${
                activeTab === tab.id
                  ? `text-${tab.activeColor}`
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
            >
              <div className="flex items-center cursor-pointer">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-${tab.indicatorColor}`}
                ></div>
              )}
            </button>
          ))}
        </div>
      </nav>
      {/* Content Window */}
      <div className="bg-white shadow-sm rounded-lg m-6">
        {activeTab === "hotels" && <HotelsList hotels={hotels} />}
        {activeTab === "flights" && <FlightsList flights={flights} />}
        {activeTab === "attractions" && (
          <AttractionsList attractions={attractions} />
        )}
      </div>
    </div>
  );
};

export default TravelTabsPage;
