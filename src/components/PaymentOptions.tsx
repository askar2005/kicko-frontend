import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { Turf } from '../lib/supabase';

interface User {
  name: string;
  email: string;
  mobile: string;
}

interface PaymentOptionsProps {
  turf: Turf;
  selectedDate: string;
  selectedSlot: string;
  amount: number;
  user: User;
  onBack: () => void;
  onPaymentComplete: (paymentMethod: string) => void;
}

type Method = 'upi' | 'card' | 'netbanking';

export default function PaymentOptions({
  turf,
  selectedDate,
  selectedSlot,
  amount,
  user,
  onBack,
  onPaymentComplete,
}: PaymentOptionsProps) {
  const [method, setMethod] = useState<Method>('upi');
  const [upiId, setUpiId] = useState('');

  const slotsCount = selectedSlot.split(',').length;
  const pricePerSlot = Math.round(amount / slotsCount);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-xl font-semibold">Payment</h1>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        {/* LEFT – SUMMARY */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Turf</p>
              <p className="font-medium">{turf.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{selectedDate}</p>
            </div>

            <div>
              <p className="text-gray-500">Selected Slots</p>
              <p className="font-medium">{selectedSlot}</p>
            </div>

            <div>
              <p className="text-gray-500">Player</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-3">Price Breakdown</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>
                ₹{pricePerSlot} × {slotsCount} slot(s)
              </span>
              <span>₹{amount}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Platform fee</span>
              <span>₹0</span>
            </div>

            <div className="flex justify-between text-lg font-semibold mt-3">
              <span>Total</span>
              <span className="text-green-600">₹{amount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT – PAYMENT METHODS */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Choose Payment Method
          </h2>

          {/* METHOD TABS */}
          <div className="space-y-2 mb-4">
            <PaymentTab
              active={method === 'upi'}
              icon={<Smartphone />}
              label="UPI"
              onClick={() => setMethod('upi')}
            />

            <PaymentTab
              active={method === 'card'}
              icon={<CreditCard />}
              label="Debit / Credit Card"
              onClick={() => setMethod('card')}
            />

            <PaymentTab
              active={method === 'netbanking'}
              icon={<Building2 />}
              label="Net Banking"
              onClick={() => setMethod('netbanking')}
            />
          </div>

          {/* UPI – INPUT APPEARS LIKE CARD */}
          {method === 'upi' && (
            <div className="space-y-3">
              <input
                placeholder="Enter UPI ID (eg: name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <button
                disabled={!upiId}
                onClick={() => onPaymentComplete('UPI')}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg font-medium"
              >
                Pay ₹{amount} with UPI
              </button>
            </div>
          )}

          {/* CARD */}
          {method === 'card' && (
            <div className="space-y-3">
              <input
                placeholder="Card Number"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-3">
                <input
                  placeholder="MM / YY"
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  placeholder="CVV"
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => onPaymentComplete('CARD')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Pay ₹{amount} with Card
              </button>
            </div>
          )}

          {/* NET BANKING */}
          {method === 'netbanking' && (
            <div className="space-y-3">
              <select className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>Select Bank</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>SBI</option>
                <option>Axis Bank</option>
              </select>

              <button
                onClick={() => onPaymentComplete('NETBANKING')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Pay ₹{amount} via Net Banking
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
            <ShieldCheck className="w-4 h-4" />
            100% secure payment
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            By continuing, you agree to Kicko’s terms & cancellation policy
          </p>
        </div>
      </div>
    </div>
  );
}

/* PAYMENT TAB */
function PaymentTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm
        ${
          active
            ? 'border-green-600 bg-green-50 text-green-700'
            : 'hover:bg-gray-50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
