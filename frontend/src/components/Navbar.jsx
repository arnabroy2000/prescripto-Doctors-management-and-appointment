import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  const handleEmergency = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const seconds = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
        const mins = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const timeText = mins > 0 ? `${mins} min ${sec} sec` : `${sec} sec`;

        setEmergencyMessage(`🚑 Help will reach you in ${timeText}`);

        setTimeout(() => {
          setEmergencyMessage("");
        }, 10000);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Location permission denied. Please allow location access."
          );
        } else {
          toast.error("Failed to fetch location. Try again.");
        }
        console.error(error);
      },
      { timeout: 10000 }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
        <img
          onClick={() => navigate("/")}
          className="w-44 cursor-pointer"
          src={assets.logo}
          alt=""
        />
        <ul className="md:flex items-start gap-5 font-medium hidden">
          <NavLink to="/">
            <li className="py-1">HOME</li>
          </NavLink>
          <NavLink to="/doctors">
            <li className="py-1">ALL DOCTORS</li>
          </NavLink>
          <NavLink to="/booktest">
            <li className="py-1">BOOK TEST</li>
          </NavLink>
          <NavLink to="/about">
            <li className="py-1">ABOUT</li>
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1">CONTACT</li>
          </NavLink>
        </ul>

        <div className="flex items-center gap-4">
          {/* Emergency Button */}
          <button
            onClick={handleEmergency}
            disabled={isLocating}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-xs"
          >
            {isLocating ? "Locating..." : "Emergency"}
          </button>

          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userData.image || assets.profile_icon}
                alt=""
              />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={() => navigate("/my-tests")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Tests
                  </p>
                  <p
                    onClick={logout}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create account
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden"
            src={assets.menu_icon}
            alt=""
          />

          {/* Mobile Menu */}
          <div
            className={`md:hidden ${
              showMenu ? "fixed w-full" : "h-0 w-0"
            } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <img src={assets.logo} className="w-36" alt="" />
              <img
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                className="w-7"
                alt=""
              />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
              <NavLink onClick={() => setShowMenu(false)} to="/">
                <p className="px-4 py-2 rounded full inline-block">HOME</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors">
                <p className="px-4 py-2 rounded full inline-block">
                  ALL DOCTORS
                </p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">
                <p className="px-4 py-2 rounded full inline-block">ABOUT</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">
                <p className="px-4 py-2 rounded full inline-block">CONTACT</p>
              </NavLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Popup Message */}
      {emergencyMessage && (
        <div className="fixed top-20 right-5 bg-white shadow-md border border-red-500 text-red-600 px-4 py-2 rounded z-50 animate-pulse">
          {emergencyMessage}
        </div>
      )}
    </>
  );
};

export default Navbar;
