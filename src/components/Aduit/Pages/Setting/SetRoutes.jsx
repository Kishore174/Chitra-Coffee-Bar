import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { dropDownRoutes, getRouteById, getRoutesByAuditor } from "../../../../API/createRoute";
import ShopCard from "./ShopCard";
import Loader from "../../../Loader";
import { useAuth } from "../../../../context/AuthProvider";

const SetRoutes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeShops, setRouteShops] = useState([]);
  const [set, setSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()

  // // Options for the dropdown
  // const options = [
  //   { label: 'Route 1', value: 'Route 1' },
  //   { label: 'Route 2', value: 'Route 2' },
  //   { label: 'Route 3', value: 'Route 3' },
  //   { label: 'Route 4', value: 'Route 4' },
  //   { label: 'Route 5', value: 'Route 5' },
  //   { label: 'Route 6', value: 'Route 6' },
  //   { label: 'Route 7', value: 'Route 7' },
  // ];

  // Example routes for modal
  useEffect(() => {
    setLoading(true)
    const fetchRoutes = async () => {
      try {
        // const res= await dropDownRoutes()
        const res = user?.role === "super-admin" ? await dropDownRoutes() : await getRoutesByAuditor(user?._id);
        setRoutes(res.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  const getRouteDeatils = async (routeId) => {
    try {
      setLoading(true)
      const res = await getRouteById(routeId);
      setRouteShops(res.data?.shops);
      setSet(res.data?.sets);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const filteredOptions = routes.filter(
    (route) =>
      route.name && route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option) => {
    // Add selected option to selectedRoutes if not already present
    if (!selectedRoutes.includes(option.name)) {
      setSelectedRoutes([...selectedRoutes, option.name]);
    }
    setSelectedOption(option);
    getRouteDeatils(option._id);
    setDropdownOpen(false);
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter((selected) => selected !== route));
  };

  const refreshRoute = () => {
    if (selectedOption?._id) {
      getRouteDeatils(selectedOption._id);
    }
  };
  // Always ensure 7 sets (days)
  const paddedSet = [...set];
  while (paddedSet.length < 7) {
    paddedSet.push([]);
  }
  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const flattenedShops = paddedSet.flat().map((shop) => shop);
  const filterShops = routeShops.filter((shop) =>
    !flattenedShops.some(flatShop => flatShop._id === shop._id)
  );

  const dayShortLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full min-h-screen text-[24px]">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl poppins-semibold text-gray-800 mb-1">Route Schedule</h2>
        <p className="text-sm text-gray-500 poppins-regular">Assign shops to days of the week for each route</p>
      </div>

      {/* Route Selector */}
      <div className="px-6 pb-4">
        <div className="relative md:w-1/3 w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Route</label>
          <div
            className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 cursor-pointer transition hover:border-red-400 hover:shadow-sm text-[16px]"
            onClick={() => setDropdownOpen((prev) => !prev)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setDropdownOpen((prev) => !prev)}
          >
            <span className={selectedOption ? "text-gray-800 poppins-medium" : "text-gray-400"}>
              {selectedOption ? selectedOption.name : "Choose a route..."}
            </span>
            <span className="text-gray-500">
              {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute z-20 bg-white border border-gray-200 mt-1 rounded-lg w-full max-h-60 overflow-y-auto shadow-xl">
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 w-full border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 text-sm"
              />
              <ul className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option._id}
                      className={`px-4 py-2.5 cursor-pointer text-sm transition ${
                        selectedOption?.name === option.name
                          ? "bg-red-50 text-red-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-400 text-sm text-center">No routes found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Days Grid */}
      {loading ? (
        <Loader />
      ) : (
        selectedRoutes.length > 0 && (
          <div className="px-6 pb-6">
            {/* Day tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {dayLabels.map((_, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    paddedSet[index]?.length > 0
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {dayShortLabels[index]}
                  <span className="ml-1.5 text-xs opacity-80">({paddedSet[index]?.length || 0})</span>
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paddedSet.map((s, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${s?.length > 0 ? "bg-red-500" : "bg-gray-300"}`} />
                    <h3 className="text-sm poppins-semibold text-gray-700">{dayLabels[index]}</h3>
                    <span className="text-xs text-gray-400 poppins-regular">
                      {s?.length || 0} shop{(s?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <ShopCard
                    routeId={selectedOption?._id}
                    shops={filterShops}
                    selSet={s}
                    index={index}
                    onRefresh={refreshRoute}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Empty state */}
      {!loading && selectedRoutes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="poppins-medium text-lg">Select a route to manage schedule</p>
          <p className="text-sm mt-1">Choose a route from the dropdown above</p>
        </div>
      )}
    </div>
  );
};

export default SetRoutes;
