import { MapPin, Star } from 'lucide-react';
import { Turf } from '../lib/supabase';

interface TurfCardProps {
  turf: Turf;
  onBook: (turf: Turf) => void;
}

export default function TurfCard({ turf, onBook }: TurfCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={turf.image_url}
          alt={turf.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{turf.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {turf.name}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{turf.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ₹{turf.price_per_hour}
            </span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>

          <button
            onClick={() => onBook(turf)}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}
