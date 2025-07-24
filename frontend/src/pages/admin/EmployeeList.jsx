import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("attendance_app_token");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/admin/employees", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setEmployees(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch employee list."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setFiltered(employees);
    } else {
      setFiltered(
        employees.filter(
          (emp) =>
            emp.firstName?.toLowerCase().includes(value.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(value.toLowerCase()) ||
            emp.email?.toLowerCase().includes(value.toLowerCase()) ||
            String(emp.employeeId)?.toLowerCase().includes(value.toLowerCase()) 
        )
      );
    }
  };

  return (
    <div className="bg-white rounded shadow max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Employee List</h2>

      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2 justify-between">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-indigo-400"
          placeholder="Search by name, email, or ID"
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
          No employees found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">Employee ID</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                {/* Add more columns if needed */}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, idx) => (
                <tr
                  key={emp._id}
                  className={idx % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="py-2 px-4 border-b">{idx + 1}</td>
                  <td className="py-2 px-4 border-b font-mono">{emp.employeeId}</td>
                  <td className="py-2 px-4 border-b">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
