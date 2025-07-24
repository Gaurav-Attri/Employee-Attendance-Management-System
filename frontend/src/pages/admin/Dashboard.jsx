import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    attendanceToday: 0,
    lateToday: 0,
    absentToday: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("attendance_app_token");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        // Get all employees
        const empRes = await axios.get("/api/admin/employees", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const totalEmployees = empRes.data.length;

        // Today’s date (YYYY-MM-DD)
        const todayStr = new Date().toISOString().slice(0, 10);

        // Get all attendance records for today
        const attRes = await axios.get(
          "/api/admin/employees/attendance/records?date=" + todayStr,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const records = attRes.data;

        const attendanceToday = records.length;
        const lateToday = records.filter((r) => r.isLate).length;
        const absentToday = totalEmployees - attendanceToday;

        // Get last 5 records (already sorted in backend)
        const recentRecords = records.slice(0, 5);

        setStats({ totalEmployees, attendanceToday, lateToday, absentToday });
        setRecent(recentRecords);
      } catch (err) {
        setError("Could not load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 text-red-700 text-center p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          label="Total Employees"
          value={stats.totalEmployees}
          color="bg-indigo-100 text-indigo-800"
        />
        <DashboardCard
          label="Attendance Today"
          value={stats.attendanceToday}
          color="bg-green-100 text-green-800"
        />
        <DashboardCard
          label="Late Entries"
          value={stats.lateToday}
          color="bg-yellow-100 text-yellow-800"
        />
        <DashboardCard
          label="Not Clocked In"
          value={stats.absentToday}
          color="bg-red-100 text-red-800"
        />
      </div>

      <div className="bg-white rounded shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Attendance (Today)</h2>
        {loading ? (
          <div className="text-gray-500 py-6 text-center">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="text-gray-500 py-6 text-center">
            No attendance records for today.
          </div>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Time In</th>
                <th className="px-4 py-2 text-left">Time Out</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Late?</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="px-4 py-2">
                    {/* Employee full name and email */}
                    <div className="font-medium">
                      {r.employeeId?.firstName} {r.employeeId?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {r.employeeId?.email}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {r.clockInTime
                      ? new Date(r.clockInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "---"}
                  </td>
                  <td className="px-4 py-2">
                    {r.clockOutTime
                      ? new Date(r.clockOutTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "---"}
                  </td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2 text-center">
                    {r.isLate ? (
                      <span className="bg-red-200 text-red-700 px-2 py-1 rounded text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Optional: Quick links */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <a
          href="/admin/register"
          className="bg-indigo-600 text-white px-5 py-3 rounded shadow hover:bg-indigo-700"
        >
          Register Employee
        </a>
        <a
          href="/admin/employees"
          className="bg-green-600 text-white px-5 py-3 rounded shadow hover:bg-green-700"
        >
          Employee List
        </a>
        <a
          href="/admin/attendance"
          className="bg-yellow-500 text-white px-5 py-3 rounded shadow hover:bg-yellow-600"
        >
          Attendance Records
        </a>
      </div>
    </div>
  );
}

function DashboardCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-6 shadow-md text-center ${color}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}

export default AdminDashboard;
