// import axios from "axios";
// import { Moon, Sun } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // 📦 Modal Component for Profile Form
// const EditProfileModal = ({ isOpen, onClose, formData, setFormData, onFileChange, onSave }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//             <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black dark:hover:text-white"
//                 >
//                     ×
//                 </button>
//                 <h2 className="text-2xl font-semibold text-primary mb-4">Edit Profile</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <input
//                         name="username"
//                         value={formData.username || ""}
//                         onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
//                         placeholder="Username"
//                         className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700"
//                     />
//                     <input
//                         name="email"
//                         value={formData.email || ""}
//                         onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                         placeholder="Email"
//                         className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700"
//                     />
//                     <input
//                         name="phone"
//                         value={formData.phone || ""}
//                         onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                         placeholder="Phone"
//                         className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700"
//                     />
//                     <input
//                         name="role"
//                         value={formData.role || "admin"}
//                         disabled
//                         className="p-2 border rounded bg-gray-200 dark:bg-neutral-700 text-gray-500"
//                     />
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={onFileChange}
//                         className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700"
//                     />
//                 </div>

//                 <div className="mt-6 flex justify-end gap-3">
//                     <button
//                         onClick={onSave}
//                         className="bg-primary text-white px-4 py-2 rounded hover:bg-primary"
//                     >
//                         Update Profile
//                     </button>
//                     <button
//                         onClick={onClose}
//                         className="border border-gray-400 px-4 py-2 rounded"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const AdminProfile = () => {
//     const navigate = useNavigate();
//     const [admin, setAdmin] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [darkMode, setDarkMode] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         axios.get("http://localhost:5000/api/profile", {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((res) => {
//                 setAdmin(res.data);
//                 setFormData(res.data);
//             })
//             .catch((err) => console.error("Error loading profile", err));
//     }, []);

//     const toggleDarkMode = () => {
//         setDarkMode(!darkMode);
//         document.documentElement.classList.toggle("dark");
//     };

//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     };

//     const handleSave = () => {
//         const token = localStorage.getItem("token");
//         const data = new FormData();
//         data.append("username", formData.username || "");
//         data.append("email", formData.email || "");
//         data.append("phone", formData.phone || "");
//         if (selectedFile) {
//             data.append("profilePicture", selectedFile);
//         }

//         axios.put("http://localhost:5000/api/update", data, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//             },
//         })
//             .then((res) => {
//                 setAdmin(res.data);
//                 setFormData(res.data);
//                 setSelectedFile(null);
//                 setShowEditModal(false);
//             })
//             .catch((err) => {
//                 console.error("Update failed", err);
//                 alert("Profile update failed");
//             });
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         navigate("/login");
//     };

//     const handleReset = () => navigate("/request-reset");
//     const handleHome = () => navigate("/");

//     if (!admin) {
//         return <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 text-black dark:text-white md:ml-64">
//             {/* Header */}
//             <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-900 shadow-md">
//                 <h1 className="text-2xl font-bold text-primary">Admin Profile</h1>
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={toggleDarkMode}
//                         className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600 transition"
//                         title="Toggle Theme"
//                     >
//                         {darkMode ? (
//                             <Sun className="text-yellow-400 w-6 h-6" />
//                         ) : (
//                             <Moon className="text-gray-800 dark:text-white w-6 h-6" />
//                         )}
//                     </button>
//                     <div className="flex items-center border border-primary rounded-full px-2 py-1">
//                         <div className="mr-4 text-sm">
//                             <div className="font-bold">{admin.fullName || admin.username?.split(" ")[0]}</div>
//                             <div className="text-xs text-gray-500 dark:text-gray-300">Admin</div>
//                         </div>
//                         <img
//                             src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`}
//                             alt="Admin"
//                             className="w-10 h-10 rounded-full object-cover border"
//                         />
//                     </div>
//                 </div>
//             </header>

//             {/* Main */}
//             <main className="p-6">

//                 <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 text-center flex flex-col md:flex-row items-center md:items-start gap-8">
//                     <div className="">
//                         <img
//                             src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`}
//                             alt="Admin"
//                             className="w-58 h-58 rounded-full mx-auto mb-4 border"
//                         />
//                     </div>
//                     <div className="text-left">
//                         <h2 className="text-3xl font-bold text-primary">{admin.fullName || admin.username}</h2>
//                         <p className="text-gray-500 dark:text-gray-400">Email: {admin.email}</p>
//                         <p>Tel: +{admin.phone}</p>
//                         <p>Role: <span className="text-blue-500 font-semibold">Admin</span></p>
//                         <p>Date: {new Date(admin.createdAt).toLocaleDateString()}</p>

//                         <button
//                             onClick={() => setShowEditModal(true)}
//                             className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary"
//                         >
//                             Edit Profile
//                         </button>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 {/* Action Buttons - Responsive and Beautiful Grid */}
//                 <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <button
//                         onClick={handleReset}
//                         className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-xl shadow hover:scale-105 hover:shadow-md transition"
//                     >
//                         Change Password
//                     </button>

//                     <button
//                         onClick={handleHome}
//                         className="w-full bg-gradient-to-r from-gray-300 to-gray-500 text-black py-2 rounded-xl shadow hover:scale-105 hover:shadow-md transition"
//                     >
//                         Go Home
//                     </button>

//                     <button
//                         onClick={handleLogout}
//                         className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-xl shadow hover:scale-105 hover:shadow-md transition"
//                     >
//                         Logout
//                     </button>
//                 </div>

//             </main>

//             {/* 📦 Edit Modal */}
//             <EditProfileModal
//                 isOpen={showEditModal}
//                 onClose={() => setShowEditModal(false)}
//                 formData={formData}
//                 setFormData={setFormData}
//                 onFileChange={handleFileChange}
//                 onSave={handleSave}
//             />
//         </div>
//     );
// };

// export default AdminProfile;



import axios from "axios";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpModal, setOtpModal] = useState(false);
    const [tempUpdateData, setTempUpdateData] = useState({});
    const [otpMessage, setOtpMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setAdmin(res.data);
                setFormData(res.data);
            })
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        if (formData.email !== admin.email) {
            axios.post("http://localhost:5000/api/profileUpdate/request-update-otp", {
                email: formData.email,
                updates: {
                    username: formData.username,
                    phone: formData.phone,
                    profilePicture: selectedFile?.name || "",
                },
            }).then(() => {
                setTempUpdateData({ ...formData, profilePicture: selectedFile });
                setOtpModal(true);
                setShowEditModal(false);
            }).catch(() => alert("Failed to send OTP to the new email."));
        } else {
            updateProfile(formData);
        }
    };

    const updateProfile = (data) => {
        const token = localStorage.getItem("token");
        const payload = new FormData();
        payload.append("username", data.username);
        payload.append("email", data.email);
        payload.append("phone", data.phone);
        if (data.profilePicture instanceof File) {
            payload.append("profilePicture", data.profilePicture);
        }

        axios.put("http://localhost:5000/api/update", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                setAdmin(res.data);
                setFormData(res.data);
                setSelectedFile(null);
                setOtpModal(false);
                alert("✅ Profile updated!");
            })
            .catch(() => alert("❌ Update failed"));
    };

    const handleVerifyOTP = () => {
        const token = localStorage.getItem("token");
        axios.post("http://localhost:5000/api/profileUpdate/verify-update-otp", { otp }, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => updateProfile(tempUpdateData))
            .catch(err => {
                const msg = err.response?.data?.message || "OTP is incorrect or expired";
                setOtpMessage(`❌ ${msg}`);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleReset = () => navigate("/request-reset");
    const handleHome = () => navigate("/");

    if (!admin) return <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 text-black dark:text-white md:ml-64">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-900 shadow-md">
                <h1 className="text-2xl font-bold text-primary">Admin Profile</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600"
                        title="Toggle Theme"
                    >{darkMode ? <Sun className="text-yellow-400 w-6 h-6" /> : <Moon className="text-gray-800 dark:text-white w-6 h-6" />}</button>
                    <div className="flex items-center border border-primary rounded-full px-2 py-1">
                        <div className="mr-4 text-sm">
                            <div className="text-sm font-bold">{admin.username?.split(" ")[0]}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">Admin</div>
                        </div>
                        <img
                            src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border"
                        />
                    </div>
                </div>
            </header>

            <main className="p-6">
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 text-center">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <img src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`} alt="Admin" className="w-58 h-58 rounded-full border" />
                        <div className="text-left">
                            <h2 className="text-3xl font-bold text-primary">{admin.fullName || admin.username}</h2>
                            <p className="text-gray-500 dark:text-gray-400">Email: {admin.email}</p>
                            <p>Tel: +{admin.phone}</p>
                            <p>Role: <span className="text-blue-500 font-semibold">Admin</span></p>
                            <p>Date: {new Date(admin.createdAt).toLocaleDateString()}</p>
                            <button onClick={() => setShowEditModal(true)} className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary">Edit Profile</button>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button onClick={handleReset} className="bg-primary hover:bg-primary text-white py-2 rounded-xl shadow hover:scale-105">Change Password</button>
                        <button onClick={handleHome} className="bg-gray-500 hover:bg-gray text-black py-2 rounded-xl shadow hover:scale-105">Go Home</button>
                        <button onClick={handleLogout} className="bg-red-700 text-white py-2 rounded-xl shadow hover:scale-105">Logout</button>
                    </div>
                </div>

            </main>

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black dark:hover:text-white">×</button>
                        <h2 className="text-2xl font-semibold text-primary mb-4">Edit Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="username" value={formData.username || ""} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Username" className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700" />
                            <input name="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700" />
                            <input name="phone" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700" />
                            <input name="role" value={formData.role || "admin"} disabled className="p-2 border rounded bg-gray-200 dark:bg-neutral-700 text-gray-500" />
                            <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border rounded bg-white dark:bg-neutral-800 dark:border-gray-700" />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary">Update Profile</button>
                            <button onClick={() => setShowEditModal(false)} className="border border-gray-400 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {otpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl w-full max-w-md shadow-xl relative">
                        <button onClick={() => setOtpModal(false)} className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-red-600">×</button>
                        <h3 className="text-xl font-semibold text-blue-600 mb-4">Enter OTP to Confirm</h3>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-3 mb-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white"
                            placeholder="Enter 6-digit OTP"
                        />
                        {otpMessage && <p className="text-red-500 text-sm mb-2">{otpMessage}</p>}
                        <button onClick={handleVerifyOTP} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">Verify & Update</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
