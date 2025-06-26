import React, { useState } from "react";
import { API_BASE } from "../config/config";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "user", // hidden default
        profilePicture: null,
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Only allow letters and spaces in username
        if (name === "username") {
            const onlyLetters = /^[A-Za-z\s]*$/;
            if (!onlyLetters.test(value)) return;
        }

        setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        const { username, email, phone, password, confirmPassword, role } = form;

        if (!username || !email || !phone || !password || !confirmPassword) {
            setMsg("Please fill in all required fields.");
            return;
        }

        if (!/^[A-Za-z\s]+$/.test(username)) {
            setMsg("Username must contain letters and spaces only.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMsg("Please enter a valid email address.");
            return;
        }

        if (!/^\d{7,15}$/.test(phone)) {
            setMsg("Phone number must be 7–15 digits only.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]{6,10}$/;
        if (!passwordRegex.test(password)) {
            setMsg("Password must be 6–10 characters and include a letter, a number, and a symbol.");
            return;
        }

        if (password !== confirmPassword) {
            setMsg("Passwords do not match.");
            return;
        }

        if (!["user", "admin"].includes(role)) {
            setMsg("Invalid role selected.");
            return;
        }

        setLoading(true);
        const data = new FormData();
        Object.keys(form).forEach((key) => form[key] && data.append(key, form[key]));

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                body: data,
            });
            const result = await res.json();
            setMsg(result.msg || "Registration successful!");
            if (res.ok) {
                localStorage.setItem("userEmail", form.email);
                navigate("/OTPVerify");
            }
        } catch {
            setMsg("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-900 black px-4 text-2xl">
            <div className="w-full max-w-2xl bg-[#111] rounded-xl p-6 shadow-lg space-y-4 text-white">
                <h2 className="text-2xl font-bold text-center">Create Account</h2>

                {msg && (
                    <p className="text-center text-sm text-red-400 font-medium">{msg}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="username"
                        type="text"
                        placeholder="Full Name"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-primary-900 black border border-gray-700 text-white rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-primary-900 black border border-gray-700 text-white rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                        name="phone"
                        type="text"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-primary-900 black border border-gray-700 text-white rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-primary-900 black border border-gray-700 text-white rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-primary-900 black border border-gray-700 text-white rounded-md placeholder-black focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    {/* Hidden role input */}
                    <input type="hidden" name="role" value={form.role} />

                    <input
                        name="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border p-1 bg-primary-900 black text-white rounded-md"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-2 rounded-md transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
