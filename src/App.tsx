import { useState, useEffect } from 'react';
import Header from './components/Header';
import LocationModal from './components/LocationModal';
import TurfCard from './components/TurfCard';
import SlotSelector from './components/SlotSelector';
import PaymentOptions from './components/PaymentOptions';
import BookingSuccess from './components/BookingSuccess';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { supabase, Turf, Booking } from './lib/supabase';

type Screen = 'login' | 'home' | 'slots' | 'payment' | 'success' | 'admin';

interface BookingData {
  selectedDate: string;
  selectedSlots: string[];
  amount: number;
}

interface User {
  name: string;
  email: string;
  mobile: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  /* ✅ CITY + LOCATION MODAL */
  const [city, setCity] = useState('Bengaluru');
  const [locationOpen, setLocationOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [success, setSuccess] = useState<Booking | null>(null);

  /* 🔁 AUTO LOGIN */
  useEffect(() => {
    const saved = localStorage.getItem('kickoUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setRole(parsed.role);
      setScreen(parsed.role === 'admin' ? 'admin' : 'home');
    }
  }, []);

  /* 🌆 FETCH TURFS */
  useEffect(() => {
    if (screen === 'home' && role === 'user') {
      fetchTurfs();
    }
  }, [screen, role, city]); // ✅ city dependency

  const fetchTurfs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('turfs')
      .select('*')
      .eq('city', city);

    setTurfs(data || []);
    setLoading(false);
  };

  /* 🔐 LOGIN */
  const onLoginSuccess = (r: 'user' | 'admin', u: User) => {
    localStorage.setItem('kickoUser', JSON.stringify({ role: r, user: u }));
    setUser(u);
    setRole(r);
    setScreen(r === 'admin' ? 'admin' : 'home');
  };

  /* 🚪 LOGOUT */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole('user');
    setSelectedTurf(null);
    setBooking(null);
    setSuccess(null);
    setScreen('login');
  };

  /* 💳 PAYMENT COMPLETE */
  const completePayment = async (method: string) => {
    if (!selectedTurf || !booking || !user) return;

    const { data } = await supabase
      .from('bookings')
      .insert([
        {
          turf_id: selectedTurf.id,
          booking_date: booking.selectedDate,
          time_slot: booking.selectedSlots.join(', '),
          user_name: user.name,
          user_email: user.email,
          payment_method: method,
          total_amount: booking.amount,
          status: 'confirmed',
        },
      ])
      .select()
      .maybeSingle();

    if (data) {
      setSuccess(data);
      setScreen('success');
    }
  };

  /* 🧭 SCREEN ROUTER */
  switch (screen) {
    case 'login':
      return <Login onLoginSuccess={onLoginSuccess} />;

    case 'admin':
      return <AdminDashboard onLogout={logout} />;

    case 'home':
      return (
        <>
          <Header
            selectedCity={city}
            onLocationClick={() => setLocationOpen(true)} // ✅ FIX
            onLogout={logout}
          />

          {/* ✅ LOCATION MODAL */}
          <LocationModal
            isOpen={locationOpen}
            onClose={() => setLocationOpen(false)}
            onSelectCity={(selectedCity) => {
              setCity(selectedCity);
              setLocationOpen(false);
            }}
          />

          <main className="max-w-7xl mx-auto px-4 py-8">
            {loading ? (
              <div className="text-center">Loading turfs...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {turfs.map((turf) => (
                  <TurfCard
                    key={turf.id}
                    turf={turf}
                    onBook={() => {
                      setSelectedTurf(turf);
                      setScreen('slots');
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      );

    case 'slots':
      if (!selectedTurf) return null;
      return (
        <SlotSelector
          turf={selectedTurf}
          onBack={() => setScreen('home')}
          onContinue={(date, slots, amount) => {
            setBooking({ selectedDate: date, selectedSlots: slots, amount });
            setScreen('payment');
          }}
        />
      );

    case 'payment':
      if (!selectedTurf || !booking || !user) return null;
      return (
        <PaymentOptions
          turf={selectedTurf}
          selectedDate={booking.selectedDate}
          selectedSlot={booking.selectedSlots.join(', ')}
          amount={booking.amount}
          user={user}
          onBack={() => setScreen('slots')}
          onPaymentComplete={completePayment}
        />
      );

    case 'success':
      if (!success || !selectedTurf) return null;
      return (
        <BookingSuccess
          booking={success}
          turf={selectedTurf}
          onBackHome={() => setScreen('home')}
        />
      );

    default:
      return null;
  }
}
