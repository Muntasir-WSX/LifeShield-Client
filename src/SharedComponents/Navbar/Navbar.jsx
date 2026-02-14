import React from "react";
import { Link, NavLink } from "react-router-dom";
import LifeShieldLogo from "../LifeShieldLogo/LifeShieldLogo";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import { FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // নতুন আইকন যোগ করা হয়েছে

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Logged Out Successfully");
      })
      .catch((error) => console.error(error));
  };

  const closeDrawer = () => {
    document.getElementById("my-drawer").checked = false;
  };

  const navLinks = (
    <>
        
      <li>
        <NavLink to="/" onClick={closeDrawer} className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}> Home </NavLink>
      </li>
      <li>
        <NavLink to="/policies" onClick={closeDrawer} className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>All Policies</NavLink>
      </li>
      <li>
        <NavLink to="/blogs" onClick={closeDrawer} className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>Blogs</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" onClick={closeDrawer} className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>Dashboard</NavLink>
      </li>
      <li>
        <NavLink to="/us" onClick={closeDrawer} className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>About Us</NavLink>
      </li>

    </>
  );

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Header */}
      <div className="bg-[#00332c] text-white py-2 px-4 hidden md:flex justify-between items-center text-sm">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">📍 2972 Khawaja 96 Road, Chattogram.</span>
          <span className="flex items-center gap-1">🕒 10:00am - 07:00pm</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">📧 alimuntasir2001@gmail.com</span>
        </div>
      </div>

      <div className="navbar bg-base-100 px-4 md:px-8 py-3">
        <div className="navbar-start">
          <div className="drawer lg:hidden w-auto">
            <input id="my-drawer" type="checkbox" className="drawer-toggle peer" />
            <div className="drawer-content flex items-center">
              <label htmlFor="my-drawer" className="relative w-10 h-10 flex items-center justify-center cursor-pointer group z-[110]">
                <span className="absolute w-6 h-1 bg-[#00332c] rounded-full transition-all duration-500"></span>
                <span className="absolute h-6 w-1 bg-[#00332c] rounded-full transition-all duration-500"></span>
              </label>
            </div>
            
            <div className="drawer-side z-[100]">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <div className="menu p-6 w-80 min-h-full bg-white text-base-content flex flex-col justify-between">
                <div>
                    <div className="mb-10 mt-12 border-b pb-4">
                        <LifeShieldLogo />
                    </div>
                    
                    <ul className="flex flex-col gap-4 text-[#00332c] font-bold uppercase text-sm">
                    {navLinks}
                    </ul>
                </div>

                <div className="mt-auto border-t pt-4">
                    <Link 
                        to="/" 
                        onClick={closeDrawer} 
                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-[#00332c] font-bold hover:bg-green-50 transition-all"
                    >
                        <FaHome className="text-xl text-green-600" />
                        <span>Back to Home</span>
                    </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <LifeShieldLogo />
          </div>
        </div>

        <div className="navbar-center lg:hidden">
          <LifeShieldLogo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 text-[#00332c] font-medium uppercase text-sm">
            {navLinks}
          </ul>
        </div>

        {/* --- Navbar End: Profile Dropdown added --- */}
        <div className="navbar-end gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar online cursor-pointer" title={user?.displayName || "Profile"}>
                <div className="w-10 rounded-full border-2 border-green-500">
                  <img src={user?.photoURL || "https://i.ibb.co.com/8mX1C9T/user.png"} alt="User" />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-box w-56 mt-4 border border-gray-100 font-bold text-[#00332c]">
                <li className="px-4 py-2 text-xs text-gray-400 uppercase border-b mb-2">My Account</li>
                <li>
                    <Link to="/profile" className="flex items-center gap-2 hover:text-green-600">
                        <FaUserCircle className="text-lg" /> View Profile
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogOut} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
                        <FaSignOutAlt className="text-lg" /> Logout
                    </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/signIn" className="btn btn-sm md:btn-md btn-outline border-[#00332c] text-[#00332c] px-6 rounded-md font-bold uppercase">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;