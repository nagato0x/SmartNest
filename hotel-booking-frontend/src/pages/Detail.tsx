import { useParams } from "react-router-dom";
import { useQueryWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { MapPin, Phone, Globe } from "lucide-react";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQueryWithLoading(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      loadingMessage: "Loading hotel details...",
    }
  );

  if (!hotel) {
    return (
      <div className="text-center text-lg text-gray-500 py-10">
        No hotel found.
      </div>
    );
  }

  const getFacilityIcon = (facility: string) => {
    const icons: { [key: string]: string } = {
      "Clean and Safe Environment": "🧼",
      "Furnished Room": "🛏️",
      "Wi-Fi / Internet": "📶",
      "Study Area": "📚",
      "Attached Bathroom": "🛁",
      "Common Kitchen": "🍽️",
      "Laundry Facilities": "🧺",
      "Parking Space": "🚗",
      "Separate Kitchen Area": "🍳",
      "Security (CCTV cameras)": "📹",
    };
    return icons[facility] || "🏨";
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, i) => (
            <AiFillStar key={i} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>

        {/* Location and Contact Info */}
        <div className="flex items-center gap-4 mt-2 text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>
              {hotel.city}, {hotel.country}
            </span>
          </div>
          {hotel.contact?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{hotel.contact.phone}</span>
            </div>
          )}
          {hotel.contact?.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <a
                href={hotel.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>

        {/* Facilities Section */}
        <div className="border border-slate-300 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold mb-3">Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hotel.facilities.map((facility: string) => (
              <div key={facility} className="flex items-center gap-2">
                <span className="text-lg">{getFacilityIcon(facility)}</span>
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Guest Info */}
        <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                £{hotel.pricePerNight}
              </p>
              <p className="text-sm text-gray-600">per night</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {hotel.adultCount}
                </p>
                <p className="text-sm text-gray-600">Adults</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {hotel.childCount}
                </p>
                <p className="text-sm text-gray-600">Children</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              {hotel.starRating}
            </p>
            <p className="text-sm text-gray-600">Star Rating</p>
          </div>
        </div>

        {/* Hotel Description */}
        {hotel.description && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">About This Hotel</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>
        )}

        {/* Guest Info Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr] mt-6">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
