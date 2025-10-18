import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
// import AdvancedSearch from "../components/AdvancedSearch";
import Hero from "../components/Hero";

const Home = () => {
  // Fetch boarding listings instead of hotels
  const { data: boardings } = useQuery("fetchBoardings", () =>
    apiClient.fetchHotels() // Keep API function name for now
  );

  const handleSearch = (searchData: any) => {
    console.log("Search initiated with:", searchData);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <div className="space-y-8">
        {/* Latest Boardings Section */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Boardings
            </h2>
            <p className="text-gray-600">
              Most recent boarding spaces added by our hosts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardings?.map((boarding) => (
              <LatestDestinationCard key={boarding._id} hotel={boarding} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
