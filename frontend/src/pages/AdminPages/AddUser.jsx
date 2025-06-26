import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/config";
import axios from "axios";

const AddUserByAdmin = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "user",
        profilePicture: null,
    });

    const [msg, setMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin] = useState({});
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("https://bp-prediction-backend.onrender.com/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAdmin(res.data))
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "username") {
            const onlyLetters = /^[A-Za-z\s]*$/;
            if (!onlyLetters.test(value)) return;
        }

        setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setSuccess(false);

        const { username, email, phone, password, confirmPassword } = form;

        if (!username || !email || !phone || !password || !confirmPassword) {
            setMsg("Please fill in all required fields.");
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

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
        if (!passwordRegex.test(password)) {
            setMsg("Password must be 6–10 characters, include a letter, a number, and a symbol.");
            return;
        }

        if (password !== confirmPassword) {
            setMsg("Passwords do not match.");
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

            if (res.ok) {
                setSuccess(true);
                setMsg(result.msg || "User added successfully!");
                setForm({
                    username: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    role: "user",
                    profilePicture: null,
                });
            } else {
                setMsg(result.msg || "Failed to add user.");
            }
        } catch (err) {
            console.error(err);
            setMsg("Failed to add user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 text-black dark:text-white md:ml-64 text-2xl">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-900 shadow-md">
                <h1 className="text-2xl font-bold text-primary">Add New User</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600 transition"
                        title="Toggle Theme"
                    >
                        {darkMode ? <Sun className="text-yellow-400 w-6 h-6" /> : <Moon className="text-gray-800 dark:text-white w-6 h-6" />}
                    </button>
                    <div className="flex items-center border border-primary rounded-full px-1 py-1">
                        <div className=" text-left mr-4 ml-2">
                            <div className="text-sm font-bold">{admin.username?.split(" ")[0]}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">Admin</div>
                        </div>
                        <img
                            src={`http://localhost:5000/uploads/${admin.profilePicture || 'default.png'}`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border"
                        />
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="p-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 max-w-4xl mx-auto bg-white dark:bg-neutral-900 p-6 rounded-lg shadow"
                >
                    <h2 className="text-2xl font-bold text-center text-primary mb-2">Create User</h2>
                    {msg && (
                        <p className={`text-center text-sm font-medium ${success ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {msg}
                        </p>
                    )}

                    <input name="username" type="text" placeholder="Full Name" value={form.username} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none" />

                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none" />

                    <input name="phone" type="text" placeholder="Phone Number" value={form.phone} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none" />

                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none" />

                    <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none" />

                    <select name="role" value={form.role} onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg focus:outline-none">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <input name="profilePicture" type="file" accept="image/*" onChange={handleChange}
                        className="w-full p-2 bg-primary-900 dark:bg-neutral-700 text-white border border-primary rounded-lg" />

                    <button type="submit" disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition">
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddUserByAdmin;
