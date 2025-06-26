import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const email = localStorage.getItem("verifiedEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation rule
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage({
        text:
          "Password must be 6–10 characters, include a letter, a number, and a symbol.",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          newPassword,
        }
      );

      setMessage({
        text: "✅ Password updated successfully. Redirecting to login...",
        type: "success",
      });

      localStorage.removeItem("verifiedEmail");

      navigate("/login")
    } catch (err) {
      setMessage({
        text: err.response?.data?.msg || "❌ Reset failed",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 px-4">
      <div className="w-full max-w-sm bg-[#111] rounded-xl p-6 shadow-lg space-y-6 text-white">
        <div>
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-sm text-gray-400 text-center mt-1">
            Enter a new password for your account.
          </p>
        </div>

        {message.text && (
          <p
            className={`text-sm text-center font-medium ${message.type === "success"
              ? "text-green-400"
              : "text-red-400"
              }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary  text-black hover:text-white font-semibold py-2 rounded-md transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
