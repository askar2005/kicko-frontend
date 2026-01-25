import {
  LogOut,
  BarChart3,
  CalendarDays,
  IndianRupee,
  Users,
  Download,
} from 'lucide-react';
import { useState } from 'react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [search, setSearch] = useState('');

  const bookings = [
    {
      date: '25 Jan',
      turf: 'Green Field Arena',
      slot: '07:00 - 08:00',
      user: 'Askar',
      amount: 800,
      status: 'Confirmed',
    },
    {
      date: '25 Jan',
      turf: 'Sky Sports Turf',
      slot: '09:00 - 10:00',
      user: 'Rahul',
      amount: 1000,
      status: 'Confirmed',
    },
  ];

  const filteredBookings = bookings.filter(
    (b) =>
      b.turf.toLowerCase().includes(search.toLowerCase()) ||
      b.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-600">
            Kicko Admin Dashboard
          </h1>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Turfs" value="8" icon={<BarChart3 />} />
          <StatCard title="Today Bookings" value="14" icon={<CalendarDays />} />
          <StatCard title="Today Revenue" value="₹12,600" icon={<IndianRupee />} />
          <StatCard title="Total Users" value="312" icon={<Users />} />
        </div>

        {/* BOOKINGS TABLE + FILTER */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Today’s Bookings</h2>

            <input
              placeholder="Search turf / user"
              className="border px-3 py-2 rounded-lg text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Date</th>
                <th>Turf</th>
                <th>Slot</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">{b.date}</td>
                  <td>{b.turf}</td>
                  <td>{b.slot}</td>
                  <td>{b.user}</td>
                  <td>₹{b.amount}</td>
                  <td className="text-green-600 font-medium">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* CSV EXPORT */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const csv =
                  'Date,Turf,Slot,User,Amount\n25 Jan,Green Field Arena,07-08,Askar,800';
                const blob = new Blob([csv]);
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'today-bookings.csv';
                a.click();
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* TURF PERFORMANCE */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Turf Performance (Today)
          </h2>

          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Green Field Arena</span>
              <span>6 slots • ₹4,800</span>
            </li>
            <li className="flex justify-between">
              <span>Sky Sports Turf</span>
              <span>4 slots • ₹4,000</span>
            </li>
            <li className="flex justify-between">
              <span>Champions Ground</span>
              <span>3 slots • ₹2,250</span>
            </li>
          </ul>
        </div>

        {/* AVAILABILITY HEATMAP */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Turf Availability Heatmap
          </h2>

          <div className="grid grid-cols-5 gap-3 text-xs items-center">
            <div></div>
            {['6-7', '7-8', '8-9', '9-10'].map((s) => (
              <div key={s}>{s}</div>
            ))}

            {['Green Field', 'Sky Sports'].map((turf) => (
              <div key={turf} className="contents">
                <div>{turf}</div>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`${turf}-${i}`}
                    className={`h-6 rounded ${
                      i === 0
                        ? 'bg-green-500'
                        : i === 1
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: JSX.Element;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
      <div className="p-3 bg-green-100 text-green-600 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
