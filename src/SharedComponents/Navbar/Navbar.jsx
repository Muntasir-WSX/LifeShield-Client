import React from "react";
import { Link, NavLink } from "react-router-dom";
import LifeShieldLogo from "../LifeShieldLogo/LifeShieldLogo";

const Navbar = () => {
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-green-500 font-bold"
              : "hover:text-green-500 transition-colors"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/policies"
          className={({ isActive }) =>
            isActive
              ? "text-green-500 font-bold"
              : "hover:text-green-500 transition-colors"
          }
        >
          All Policies
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            isActive
              ? "text-green-500 font-bold"
              : "hover:text-green-500 transition-colors"
          }
        >
          Blogs
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-green-500 font-bold"
              : "hover:text-green-500 transition-colors"
          }
        >
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="w-full sticky top-0 z-50 bg-white">
      {/* Top Header */}
      <div className="bg-[#00332c] text-white py-2 px-4 hidden md:flex justify-between items-center text-sm">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            📍 2972 Khawaja 96 Road, Chattogram.
          </span>
          <span className="flex items-center gap-1">
            🕒 Opening Hours: 10:00am - 07:00pm
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            📧 alimuntasir2001@gmail.com
          </span>
          <div className="flex gap-3 ml-4">
            <i className="fab fa-facebook cursor-pointer hover:text-green-400 transition-colors"></i>
            <i className="fab fa-twitter cursor-pointer hover:text-green-400 transition-colors"></i>
            <i className="fab fa-instagram cursor-pointer hover:text-green-400 transition-colors"></i>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 py-4">
        <div className="navbar-start">
          {/* Animated Plus Icon Drawer Toggle */}
          <div className="drawer lg:hidden w-auto">
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle peer"
            />
            <div className="drawer-content flex items-center">
              <label
                htmlFor="my-drawer"
                className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
              >
                {/* Plus Icon logic using spans */}
                <span className="absolute w-6 h-1 bg-[#00332c] rounded-full transition-all duration-500 ease-in-out peer-checked:rotate-[225deg]"></span>
                <span className="absolute h-6 w-1 bg-[#00332c] rounded-full transition-all duration-500 ease-in-out peer-checked:rotate-[225deg]"></span>
              </label>
            </div>

            <div className="drawer-side z-[100]">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>

              <ul className="menu p-4 w-80 min-h-full bg-white text-base-content gap-4 pt-6 relative">
                {/* Close Button Inside Drawer */}
                <div className="flex justify-end mb-2">
                  <label
                    htmlFor="my-drawer"
                    className="btn btn-sm btn-circle btn-ghost text-[#00332c] hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    ✕
                  </label>
                </div>

                <div className="mb-8 px-2">
                  <LifeShieldLogo />
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2">{navLinks}</div>

                {/* Drawer Footer (Optional: Mobile Contact) */}
                <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">
                    Need Help?
                  </p>
                  <p className="text-sm font-bold text-[#00332c]">
                    +000 196 0551472
                  </p>
                </div>
              </ul>
            </div>
          </div>
          <div className="cursor-pointer hidden lg:block">
            <LifeShieldLogo />
          </div>
        </div>
        {/* Logo for mobile  */}
        <div className="navbar-center lg:hidden">
          <LifeShieldLogo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 text-[#00332c] font-medium uppercase text-sm">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end gap-4">
          {/* Login Button with Fixed Hover */}
          <Link
            to="/signIn"
            className="btn btn-sm md:btn-md btn-outline border-[#00332c] text-[#00332c] hover:bg-[#00332c] hover:text-white hover:border-[#00332c] px-4 md:px-8 rounded-md transition-all duration-300 text-xs md:text-sm font-semibold"
          >
            Login
          </Link>

          {/* Consultant Section */}
          <div className="hidden xl:flex items-center gap-3 border-l pl-4 border-gray-300">
            <div className="p-3 bg-gray-100 rounded-full text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase text-gray-500 font-semibold leading-tight">
                Free Consultant
              </p>
              <p className="font-bold text-sm text-[#00332c]">
                +000 196 0551472{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
