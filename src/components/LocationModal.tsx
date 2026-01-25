import { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
  currentCity: string;
}

const popularCities = [
   'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tirunelveli',
  'Erode',
  'Vellore',
  'Thoothukudi',
  'Dindigul',
  'Thanjavur',
  'Ranipet',
  'Sivakasi',
  'Karur',
  'Udhagamandalam',
  'Hosur',
  'Nagercoil',
  'Kanchipuram',
  'Kumarapalayam',
  'Karaikkudi',
  'Neyveli',
  'Cuddalore',
  'Kumbakonam',
  'Tiruppur',
  'Pollachi',
  'Rajapalayam',
  'Gudiyatham',
  'Pudukkottai',
  'Vaniyambadi',
  'Ambur',
  'Nagapattinam',
  'Viluppuram',
  'Tindivanam',
  'Virudhunagar',
  'Aruppukkottai',
  'Paramakudi',
  'Ramanathapuram',
  'Sirkali',
  'Mayiladuthurai',
  'Chidambaram',
  'Kallakurichi',
  'Perambalur',
  'Ariyalur',
  'Krishnagiri',
  'Dharmapuri',
  'Namakkal',
  'Theni',
  'Tenkasi',
  'Chengalpattu',
  'Tiruvallur',
  'Tiruvannamalai',
  'Kovilpatti',
  'Srivilliputhur',
  'Bengaluru',
];

export default function LocationModal({
  isOpen,
  onClose,
  onSelectCity,
  currentCity,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCities = popularCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Select City</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search for your city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <button className="flex items-center space-x-3 w-full mt-4 p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Navigation className="w-5 h-5" />
            <span className="font-medium">Use Current Location</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Popular Cities
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  city === currentCity
                    ? 'bg-green-50 text-green-600'
                    : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
