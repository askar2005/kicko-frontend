import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (
    role: 'user' | 'admin',
    user: { name: string; email: string; mobile: string }
  ) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const sendOtp = () => {
    if (!name || !email || !mobile) return;
    setOtpSent(true);
  };

  const verifyOtp = () => {
    if (otp.length < 4) return;

    onLoginSuccess(role, {
      name,
      email,
      mobile,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Kicko Turf Booking
        </h1>

        {/* ROLE */}
        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />
            User
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            Admin
          </label>
        </div>

        {!otpSent ? (
          <>
            <input
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              type="email"
              className="w-full mb-3 px-4 py-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Mobile Number"
              className="w-full mb-4 px-4 py-3 border rounded-lg"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
            >
              Verify & Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
