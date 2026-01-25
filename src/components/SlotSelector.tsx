import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Turf } from '../lib/supabase';

interface SlotSelectorProps {
  turf: Turf;
  onBack: () => void;
  onContinue: (selectedDate: string, selectedSlots: string[], amount: number) => void;
}

const timeSlots = [
  '06:00 AM - 07:00 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
  '08:00 PM - 09:00 PM',
  '09:00 PM - 10:00 PM',
];

/* 🔴 BUSY SLOTS (already booked) */
const busySlots = [
  '08:00 AM - 09:00 AM',
  '03:00 PM - 04:00 PM',
  '07:00 PM - 08:00 PM',
];

/* ⚪ DISABLED SLOTS (not bookable) */
const disabledSlots = [
  '06:00 AM - 07:00 AM',
];

export default function SlotSelector({ turf, onBack, onContinue }: SlotSelectorProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [holdTime, setHoldTime] = useState(300);

  useEffect(() => {
    if (selectedSlots.length === 0) return;

    const timer = setInterval(() => {
      setHoldTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelectedSlots([]);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSlots]);

  const formatTimer = () => {
    const m = Math.floor(holdTime / 60);
    const s = holdTime % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getNext7Days = () =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
      if (selectedSlots.length === 0) setHoldTime(300);
    }
  };

  const totalBasePrice = turf.price_per_hour * selectedSlots.length;
  const discount = 0;
  const finalPrice = totalBasePrice - discount;

  const handleContinue = () => {
    if (selectedDate && selectedSlots.length > 0) {
      onContinue(selectedDate, selectedSlots, finalPrice);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Select Date</h2>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {getNext7Days().map((date) => {
              const dateStr = formatDate(date);
              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedSlots([]);
                    setHoldTime(300);
                  }}
                  className={`p-3 rounded-lg ${
                    selectedDate === dateStr
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-xs">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>

            {/* 🟢🔴⚪ LEGEND */}
            <div className="flex items-center space-x-6 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-600"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span>Busy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                <span>Disabled</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isBusy = busySlots.includes(slot);
                const isDisabled = disabledSlots.includes(slot);
                const isSelected = selectedSlots.includes(slot);

                return (
                  <button
                    key={slot}
                    disabled={isBusy || isDisabled}
                    onClick={() => toggleSlot(slot)}
                    className={`p-4 rounded-lg font-medium transition-colors
                      ${
                        isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isBusy
                          ? 'bg-red-50 text-red-500 cursor-not-allowed'
                          : isSelected
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {selectedSlots.length > 0 && (
              <>
                <div className="mt-4 text-sm text-green-700">
                  Slots held for <strong>{formatTimer()}</strong> minutes
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hour Price</span>
                    <span>₹{turf.price_per_hour}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>No. of Slots</span>
                    <span>{selectedSlots.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Final Price</span>
                    <span className="text-green-600">₹{finalPrice}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
