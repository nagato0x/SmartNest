import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import { AiFillStar } from "react-icons/ai";
import { MapPin, Users, Utensils, Wifi } from "lucide-react";

type Props = {
  hotel: HotelType;
};

// Helper function to format currency (assuming GBP/£ based on original code)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SearchResultsCard = ({ hotel }: Props) => {
  // Select up to 4 key amenities to display
  const keyAmenities = hotel.facilities.slice(0, 4);

  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100 overflow-hidden h-auto xl:h-[500px] flex">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-0 w-full h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden h-64 xl:h-[500px]">
          <img
            src={hotel.imageUrls[0]}
            alt={`Image of ${hotel.name}`}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {/* Currency Formatter Change Applied Here */}
            <div className="bg-primary-600 text-white rounded-full px-4 py-1.5">
              <span className="text-base font-bold">
                {formatCurrency(hotel.pricePerNight)}
              </span>
              <span className="text-xs font-medium opacity-80"> / night</span>
            </div>
            {hotel.isFeatured && (
              <div className="bg-yellow-500 text-white rounded-full px-3 py-1">
                <span className="text-xs font-bold">Featured</span>
              </div>
            )}
          </div>

          {/* NOTE: Star Rating Badge (from top-right) removed to be placed in Content Section */}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between h-auto xl:h-full overflow-hidden">
          <div className="space-y-4 overflow-y-auto xl:flex-1">
            {/* Header */}
            <div className="space-y-2">
              <Link
                to={`/detail/${hotel._id}`}
                className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer block"
              >
                {hotel.name}
              </Link>
              
              {/* Star Rating Moved Here for Logical Grouping */}
              <div className="flex items-center space-x-2 text-gray-800">
                <div className="flex items-center">
                    {Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar key={index} className="w-5 h-5 text-yellow-500" />
                    ))}
                </div>
                <span className="text-sm font-semibold">
                    {hotel.starRating} Star Hotel
                </span>
              </div>

              <div className="flex items-center text-gray-600 pt-1">
                <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                <span className="text-sm font-medium">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed line-clamp-3">
              {hotel.description}
            </div>

            {/* Amenities Section: NEW ADDITION */}
            <div className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold text-gray-700">Key Amenities:</h4>
                <div className="flex flex-wrap gap-2 text-xs text-gray-800">
                    {keyAmenities.map((facility, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            {/* Simple icon mapping for better UX */}
                            {facility.toLowerCase().includes("wifi") ? (
                                <Wifi className="w-3 h-3 mr-1" />
                            ) : facility.toLowerCase().includes("breakfast") || facility.toLowerCase().includes("restaurant") ? (
                                <Utensils className="w-3 h-3 mr-1" />
                            ) : (
                                <MapPin className="w-3 h-3 mr-1 opacity-0" /> // Placeholder to align
                            )}
                            <span className="font-medium">{facility}</span>
                        </div>
                    ))}
                    {/* Add a counter if there are more amenities */}
                    {hotel.facilities.length > keyAmenities.length && (
                         <div className="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs font-medium">
                            +{hotel.facilities.length - keyAmenities.length} more
                         </div>
                    )}
                </div>
            </div>

            {/* Hotel Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-50">
              {hotel.totalBookings && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">{hotel.totalBookings} bookings</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <AiFillStar className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
                  {hotel.averageRating && hotel.averageRating > 0
                    ? `${hotel.averageRating.toFixed(1)} avg rating`
                    : "No ratings yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to={`/detail/${hotel._id}`}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 text-center block shadow-md hover:shadow-lg"
            >
              View Details & Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;