
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // 'login' | 'verify'
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`http://localhost:5000/api/login-otp/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "OTP sent to your email.", type: "success" });
        localStorage.setItem("pendingEmail", email);
        localStorage.setItem("pendingPassword", password);
        setStep("verify");
      } else {
        setMessage({ text: data.msg || "Login failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error", type: "error" });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("pendingEmail");
    const password = localStorage.getItem("pendingPassword");

    try {
      const res = await fetch(`http://localhost:5000/api/login-otp/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        const { token, user } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userId", user.id);

        setMessage({ text: "Login successful!", type: "success" });
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingPassword");

        setTimeout(() => {
          navigate(user.role === "admin" ? "/admin/admindash" : "/");
        }, 500);
      } else {
        setMessage({ text: data.msg || "Invalid OTP", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 text-2xl">
      <div className="w-full max-w-sm bg-[#111] rounded-xl p-6 shadow-lg space-y-6 text-white">
        <div>
          <h1 className="text-2xl font-bold text-center">Login to your account</h1>
          <p className="text-sm text-gray-400 text-center mt-1">
            {step === "login" ? "Enter your email and password below." : "Enter the OTP sent to your email."}
          </p>
        </div>

        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-primary-900 border border-gray-700 placeholder-black text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-primary-900 border border-gray-700 placeholder-black text-white"
                placeholder="••••••••"
              />
              <p className="text-right text-sm text-gray-400">
                Forgot password? <Link to="/request-reset" className="text-primary hover:underline">Reset here</Link>
              </p>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-600">Login</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-primary-900 border border-gray-700 placeholder-black text-white"
                placeholder="Enter OTP"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-600">Verify OTP</button>
          </form>
        )}

        {message.text && (
          <p className={`text-sm text-center font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}

        {/* {step === "login" && (
          <p className="text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        )} */}
      </div>
    </div>
  );
};

export default Login;
