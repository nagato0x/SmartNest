import { FormEvent, useState, useEffect, useRef } from "react";
import useSearchContext from "../hooks/useSearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [showDropdown, setShowDropdown] = useState(false);
  const [places, setPlaces] = useState<string[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<string[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [studentsCount, setStudentsCount] = useState<number>(search.adultCount);
  const [roommatesCount, setRoommatesCount] = useState<number>(search.childCount);
  const hasFetchedRef = useRef(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Fetch hotel/boarding places on mount
  useEffect(() => {
    if (isLoadingPlaces || hasFetchedRef.current) return;

    const fetchPlaces = async () => {
      try {
        setIsLoadingPlaces(true);
        hasFetchedRef.current = true;

        const cachedPlaces = localStorage.getItem("hotelPlaces");
        if (cachedPlaces) {
          const parsedPlaces = JSON.parse(cachedPlaces);
          const cacheTime = localStorage.getItem("hotelPlacesTime");
          const now = Date.now();

          if (cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000) {
            setPlaces(parsedPlaces);
            setIsLoadingPlaces(false);
            return;
          }
        }

        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:7002";
        const response = await fetch(`${apiBaseUrl}/api/hotels`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data: { city?: string; place?: string; name?: string }[] = await response.json();
        const uniquePlaces: string[] = Array.from(
          new Set(
            data
              .map((hotel) => hotel.city || hotel.place || hotel.name)
              .filter((place): place is string => typeof place === "string" && place.length > 0)
          )
        );

        localStorage.setItem("hotelPlaces", JSON.stringify(uniquePlaces));
        localStorage.setItem("hotelPlacesTime", Date.now().toString());

        setPlaces(uniquePlaces);
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setFilteredPlaces([]);
    setTimeout(() => setIsInitialMount(false), 100);
  }, []);

  useEffect(() => {
    if (destination && places.length > 0) {
      const filtered = places.filter((place) =>
        place.toLowerCase().includes(destination.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setShowDropdown(false);
      setHasUserInteracted(false);
      if (isInitialMount) setShowDropdown(false);
    }
  }, [destination, places, isInitialMount]);

  useEffect(() => {
    if (destination.length > 0) {
      const filtered = places.filter((place) =>
        place.toLowerCase().includes(destination.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [destination, places]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    search.saveSearchValues(
      destination.trim(),
      checkIn,
      checkOut,
      studentsCount,
      roommatesCount
    );

    setShowDropdown(false);
    setFilteredPlaces([]);

    navigate("/search");

    setTimeout(() => {
      setDestination("");
      setCheckIn(minDate);
      setCheckOut(minDate);
      setStudentsCount(1);
      setRoommatesCount(0);
    }, 100);
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn(minDate);
    setCheckOut(minDate);
    setStudentsCount(1);
    setRoommatesCount(0);
    search.clearSearchValues();
    setShowDropdown(false);
    setHasUserInteracted(false);
    setIsInitialMount(false);
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
          autoComplete="off"
        >
          {/* Destination */}
          <div className="flex flex-row items-center flex-1 relative sm:col-span-2 lg:col-span-1">
            <MdTravelExplore size={20} className="mr-2 text-gray-500 absolute left-3 z-10" />
            <Input
              placeholder="Where are you going?"
              className="pl-10"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setHasUserInteracted(true); }}
              onFocus={() => {
                if (filteredPlaces.length > 0 && destination.length > 0 && hasUserInteracted && !isInitialMount) {
                  setShowDropdown(true);
                }
              }}
              onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && !isInitialMount && (
              <ul className="absolute top-full left-0 w-full bg-white p-2 border border-input rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredPlaces.map((place) => (
                  <li
                    key={place}
                    className="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
                    onMouseDown={() => { setDestination(place); setShowDropdown(false); }}
                  >
                    {place}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Check-in Date */}
          <div className="sm:col-span-1">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Check-out Date */}
          <div className="sm:col-span-1">
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Students & Roommates */}
          <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Students:</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value))}
                className="w-16"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">Roommates:</label>
              <Input
                type="number"
                min={0}
                max={10}
                value={roommatesCount}
                onChange={(e) => setRoommatesCount(parseInt(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2 lg:col-span-1">
            <Button type="submit" className="flex-1 text-white bg-primary-600 px-6 py-2 rounded-md font-semibold hover:bg-primary-500 transition-all duration-200">
              Search
            </Button>
            <Button type="button" variant="secondary" className="flex-1 text-white bg-gray-500 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition-all duration-200" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
