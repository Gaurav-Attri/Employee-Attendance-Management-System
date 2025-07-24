import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import AttendanceRecords from './pages/admin/AttendanceRecords';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeList from './pages/admin/EmployeeList';
import RegisterEmployee from './pages/admin/RegisterEmployee';
import EmployeeDashboard from "./pages/employee/Dashboard";
import ClockIn from "./pages/employee/ClockIn";
import ClockOut from "./pages/employee/ClockOut";
import AdminLayout from "./layouts/AdminLayout";

function App(){
  return (
    <Router>
      <Routes>
        {/* common Route */}
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="register" element={<RegisterEmployee />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceRecords />} />
        </Route>

        {/* Employee Routes */}
        <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
        <Route path="/employee/clock-in" element={<ClockIn />} />
        <Route path="/employee/clock-out" element={<ClockOut />} />
      </Routes>
    </Router>
  );
}

export default App;