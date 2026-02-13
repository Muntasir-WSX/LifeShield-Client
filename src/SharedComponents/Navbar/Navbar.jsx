import React from "react";
import { Link, NavLink } from "react-router-dom";
import LifeShieldLogo from "../LifeShieldLogo/LifeShieldLogo";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Logged Out Successfully");
      })
      .catch((error) => console.error(error));
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}> Home </NavLink>
      </li>
      <li>
        <NavLink to="/policies" className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>All Policies</NavLink>
      </li>
      <li>
        <NavLink to="/blogs" className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>Blogs</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-green-500 font-bold" : "hover:text-green-500 transition-colors"}>Dashboard</NavLink>
      </li>
    </>
  );

  return (
    <nav className="w-full sticky top-0 z-50 bg-white">
      {/* Top Header */}
      <div className="bg-[#00332c] text-white py-2 px-4 hidden md:flex justify-between items-center text-sm">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">📍 2972 Khawaja 96 Road, Chattogram.</span>
          <span className="flex items-center gap-1">🕒 Opening Hours: 10:00am - 07:00pm</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">📧 alimuntasir2001@gmail.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 py-4">
        <div className="navbar-start">
          <div className="drawer lg:hidden w-auto">
            <input id="my-drawer" type="checkbox" className="drawer-toggle peer" />
            <div className="drawer-content flex items-center">
              <label htmlFor="my-drawer" className="relative w-10 h-10 flex items-center justify-center cursor-pointer group">
                <span className="absolute w-6 h-1 bg-[#00332c] rounded-full transition-all duration-500"></span>
                <span className="absolute h-6 w-1 bg-[#00332c] rounded-full transition-all duration-500"></span>
              </label>
            </div>
            <div className="drawer-side z-[100]">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-white pt-6">
                <div className="flex flex-col gap-2">{navLinks}</div>
              </ul>
            </div>
          </div>
          <div className="cursor-pointer hidden lg:block">
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

        <div className="navbar-end gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-10 md:gap-3">
            <div 
                className="avatar online cursor-pointer" 
                title={user?.email}
              >
                <div className="w-10 rounded-full border-2 border-green-500 shadow-sm">
                  <img 
                    src={user?.photoURL || "https://i.ibb.co.com/8mX1C9T/user.png"} 
                    alt="User" 
                  />
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogOut}
                className="btn btn-md md:btn-sm btn-ghost text-red-600 hover:bg-red-50 border border-red-200 font-bold rounded-md px-2 md:px-4 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            /* Guest State */
            <Link
              to="/signIn"
              className="btn btn-sm md:btn-md btn-outline border-[#00332c] text-[#00332c] hover:bg-[#00332c] hover:text-white px-4 md:px-8 rounded-md transition-all text-xs md:text-sm font-semibold uppercase"
            >
              Login
            </Link>
          )}

          {/* Consultant - Hidden on Mobile */}
          <div className="hidden xl:flex items-center gap-3 border-l pl-4 border-gray-300">
            <div className="p-3 bg-gray-100 rounded-full text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase text-gray-500 font-semibold leading-tight">Free Consultant</p>
              <p className="font-bold text-sm text-[#00332c]">+000 196 0551472</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;