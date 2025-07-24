import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin/dashboard" className="block hover:text-gray-300">Home</Link>
        <Link to="/admin/register" className="block hover:text-gray-300">Register Employee</Link>
        <Link to="/admin/employees" className="block hover:text-gray-300">Employee List</Link>
        <Link to="/admin/attendance" className="block hover:text-gray-300">Attendance Records</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
