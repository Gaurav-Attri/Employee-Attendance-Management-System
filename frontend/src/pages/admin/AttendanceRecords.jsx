import { useState, useEffect } from "react";
import axios from "axios";

function formatTime(dateString) {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateString) {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("attendance_app_token");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/admin/employees/attendance/records", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setRecords(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch attendance records."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Minimal filter for employee name/email/ID/date
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setFiltered(records);
    } else {
      setFiltered(
        records.filter((rec) => {
          const emp = rec.employeeId || {};
          return (
            emp.firstName?.toLowerCase().includes(value.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(value.toLowerCase()) ||
            emp.email?.toLowerCase().includes(value.toLowerCase()) ||
            String(emp.employeeId)?.toLowerCase().includes(value.toLowerCase()) ||
            formatDate(rec.date).includes(value)
          );
        })
      );
    }
  };

  return (
    <div className="bg-white rounded shadow max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Attendance Records</h2>

      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2 justify-between">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-indigo-400"
          placeholder="Search by name, email, ID, or date"
          value={search}
          onChange={handleSearch}
        />
        <span className="text-gray-500 text-sm mt-1 sm:mt-0">
          Total: {filtered.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 text-center p-3 rounded">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No attendance records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Clock In</th>
                <th className="py-2 px-4 border-b">Clock Out</th>
                <th className="py-2 px-4 border-b">Total Hours</th>
                <th className="py-2 px-4 border-b">Late?</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => {
                const emp = rec.employeeId || {};
                return (
                  <tr key={rec._id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="py-2 px-4 border-b">{idx + 1}</td>
                    <td className="py-2 px-4 border-b font-mono">
                      {emp.employeeId || "---"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {emp.firstName || ""} {emp.lastName || ""}
                    </td>
                    <td className="py-2 px-4 border-b">{emp.email || "---"}</td>
                    <td className="py-2 px-4 border-b">{formatDate(rec.date)}</td>
                    <td className="py-2 px-4 border-b">{formatTime(rec.clockInTime)}</td>
                    <td className="py-2 px-4 border-b">{formatTime(rec.clockOutTime)}</td>
                    <td className="py-2 px-4 border-b">
                      {rec.totalHoursWorked !== undefined && rec.totalHoursWorked !== null
                        ? rec.totalHoursWorked.toFixed(2)
                        : "---"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {rec.isLate ? (
                        <span className="text-red-600 font-semibold">Yes</span>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{rec.status}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className="underline cursor-help"
                        title={`In: (${rec.location?.clockIn?.latitude}, ${rec.location?.clockIn?.longitude})\nOut: (${rec.location?.clockOut?.latitude || "---"}, ${rec.location?.clockOut?.longitude || "---"})`}
                      >
                        View
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceRecords;
