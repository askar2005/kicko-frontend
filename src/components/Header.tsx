import { useState } from 'react';
import { MapPin, Bell, Settings, LogOut, User } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  onLocationClick: () => void;
  onLogout: () => void;
}

export default function Header({
  selectedCity,
  onLocationClick,
  onLogout,
}: HeaderProps) {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT */}
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-green-600">Kicko</h1>

            <button
              onClick={onLocationClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {selectedCity}
              </span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => setOpenSettings(!openSettings)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-700" />
            </button>

            {openSettings && (
              <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  Profile
                </button>

                <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-sm">
                  My Bookings
                </button>

                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
