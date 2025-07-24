import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Simple Modal component
function Modal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <div className="text-green-700 text-lg font-semibold mb-2">{message}</div>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded mt-2"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function RegisterEmployee() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("attendance_app_token");

  // Handle input changes
  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1: Initiate (Send OTP)
  const handleInitiate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await axios.post(
        "/api/auth/register/initiate",
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStep(2);
      setInfo(res.data.message || "OTP sent. Check employee's email.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error sending OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await axios.post(
        "/api/auth/register/verify",
        { email: form.email, otp },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInfo(res.data.message || "Employee registered successfully.");
      // Open success modal
      setModalOpen(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // On modal close, redirect to admin dashboard
  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/admin/dashboard");
  };

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setOtp("");
    setError("");
    setInfo("");
    setStep(1);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Register Employee</h2>

      {info && step === 2 && (
        <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{info}</div>
      )}
      {error && (
        <div className="p-2 mb-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {step === 1 && (
        <form onSubmit={handleInitiate} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Enter OTP sent to <span className="font-mono">{form.email}</span>
            </label>
            <input
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP & Register"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full mt-2 bg-gray-200 text-gray-900 py-2 rounded text-sm"
          >
            Start again
          </button>
        </form>
      )}

      {/* Modal on registration success */}
      {modalOpen && (
        <Modal
          message="Employee registered successfully!"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default RegisterEmployee;
