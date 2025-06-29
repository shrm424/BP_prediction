import axios from "axios";
import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-xl relative shadow-2xl border border-gray-300 dark:border-neutral-700 transition-all">
                <button onClick={onClose} className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-red-500">×</button>
                {children}
            </div>
        </div>
    );
};

const profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState("");
    const [tempUpdateData, setTempUpdateData] = useState({});
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios
            .get("https://bp-prediction-backend.onrender.com/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data);
                setFormData(res.data);
            })
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
    };

    const handleSave = () => {
        if (formData.email !== user.email) {
            axios
                .post("https://bp-prediction-backend.onrender.com/api/profileUpdate/request-update-otp", {
                    email: formData.email,
                    updates: {
                        username: formData.username,
                        phone: formData.phone,
                        profilePicture: formData.profilePicture?.name || "",
                    },
                })
                .then(() => {
                    setTempUpdateData(formData);
                    setIsEditing(false);
                    setIsVerifying(true);
                })
                .catch(() => alert("Failed to send OTP"));
        } else {
            updateProfile(formData);
        }
    };

    const handleOTPVerify = () => {
        axios
            .post("https://bp-prediction-backend.onrender.com/api/profileUpdate/verify-update-otp", { otp }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                updateProfile(tempUpdateData);
                setIsVerifying(false);
            })
            .catch(() => setMessage("❌ OTP is incorrect or expired."));
    };

    const updateProfile = (data) => {
        const payload = new FormData();
        payload.append("username", data.username);
        payload.append("email", data.email);
        payload.append("phone", data.phone);
        if (data.profilePicture instanceof File) {
            payload.append("profilePicture", data.profilePicture);
        }

        axios
            .put("https://bp-prediction-backend.onrender.com/api/profileUpdate/update", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                setIsEditing(false);      
                setIsVerifying(false);    
            })
            .catch((err) => console.error("Update failed", err));
    };

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     window.location.href = "/login";
    // };

    // const handleReset = () => { window.location.href = "/request-reset"; }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleReset = () => navigate("/request-reset");
    const handleAdmin = () => navigate("/admin");

    if (!user) return <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading...</div>;

    return (
        <div className="min-h-screen dark:bg-neutral-900 to-slate-900 py-10 px-4 text-gray-900 dark:text-white text-3xl">
            <div className="w-full max-w-5xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0 w-68 h-68  overflow-hidden border-4 border-primary">
                    <img
                        src={
                            formData.profilePicture instanceof File
                                ? URL.createObjectURL(formData.profilePicture)
                                : `https://bp-prediction-backend.onrender.com/uploads/${user.profilePicture}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-4xl font-extrabold text-primary uppercase mb-2">{user.username}</h2>
                    <p className="text-gray-300 mb-1">{user.email}</p>
                    <p className="text-gray-300 mb-4">+{user.phone}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary text-white rounded-full shadow-lg transition"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Logout */}
            <div className="mt-10 max-w-5xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.role === "admin" && (
            <button
                onClick={handleAdmin}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow transition"
            >
                Admin Panel
            </button>
        )}

        <button
            onClick={handleReset}
            className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl font-semibold shadow transition"
        >
            Change Password
        </button>

        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold shadow transition"
        >
            Logout
        </button>
    </div>
</div>



            {/* Edit Modal */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <h3 className=" font-bold mb-4 text-primary">Edit Your Profile</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white"
                    />
                    <button
                        onClick={handleSave}
                        className="w-full mt-2 bg-primary-600 hover:bg-primary text-white px-4 py-2 rounded-xl transition"
                    >
                        Save Changes
                    </button>
                </div>
            </Modal>

            {/* OTP Modal */}
            <Modal isOpen={isVerifying} onClose={() => setIsVerifying(false)}>
                <h3 className="text-xl font-bold mb-4 text-primary">Enter OTP to Confirm</h3>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white mb-3"
                    placeholder="Enter 6-digit OTP"
                />
                {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
                <button
                    onClick={handleOTPVerify}
                    className="w-full bg-primary-600 hover:bg-primary text-white px-4 py-2 rounded-xl transition"
                >
                    Verify & Update
                </button>
            </Modal>
        </div>
    );
};

export default profile;
