import { CheckCircle, MapPin, Calendar, Clock, Download, Home } from 'lucide-react';
import { Turf, Booking } from '../lib/supabase';

interface BookingSuccessProps {
  booking: Booking;
  turf: Turf;
  onBackHome: () => void;
}

export default function BookingSuccess({
  booking,
  turf,
  onBackHome,
}: BookingSuccessProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const generateQRDataURL = (data: string) => {
    const canvas = document.createElement('canvas');
    const size = 200;
    const qrSize = 25;
    const pixelSize = size / qrSize;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#000000';

    const hash = data.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

    for (let y = 0; y < qrSize; y++) {
      for (let x = 0; x < qrSize; x++) {
        const seed = (hash + x * 127 + y * 257) % 100;
        if (seed > 40) {
          ctx.fillRect(
            x * pixelSize,
            y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }

    return canvas.toDataURL();
  };

  const qrData = `KICKO-${booking.id}`;
  const qrCodeUrl = generateQRDataURL(qrData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your turf has been successfully booked
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">{turf.name}</h2>
            <p className="opacity-90">{turf.location}</p>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl border-4 border-green-600">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="Booking QR Code"
                    className="w-48 h-48"
                  />
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="text-lg font-mono font-semibold text-gray-800">
                {booking.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(booking.booking_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-semibold text-gray-800">
                    {booking.time_slot}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800">{turf.location}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{booking.total_amount}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Paid via {booking.payment_method}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button
                onClick={onBackHome}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Show this QR code at the venue for entry
          </p>
        </div>
      </div>
    </div>
  );
}
