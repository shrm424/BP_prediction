import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { isUserLoggedIn } from "./authUtils";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ useEffect always runs
  useEffect(() => {
    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Prediction", path: "/prediction" },
    { name: "History", path: "/history" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50 text-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className=" font-bold tracking-wide">
            BPP System
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {/* Always show pages */}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-yellow-300 transition duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {/* Right corner */}
            <div>
              {isLoggedIn ? (
                <ThemeToggle />
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-primary px-4 py-1 rounded font-semibold hover:bg-yellow-200 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm hover:text-yellow-300"
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-2 text-center">
            {isLoggedIn ? (
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-block py-2 px-4 bg-white text-blue-700 font-semibold rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
