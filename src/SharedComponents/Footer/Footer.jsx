import React from "react";
import { Link } from "react-router-dom";
import LifeShieldLogo from "../LifeShieldLogo/LifeShieldLogo";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#00332c] text-white pt-16 pb-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Logo & About */}
        <div className="space-y-6">
          <div className="bg-white p-2 inline-block rounded-md">
            <LifeShieldLogo />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Life Shield provides modern, transparent life insurance solutions
            tailored to your needs. We are committed to securing your family's
            tomorrow, today.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0a4d44] hover:bg-green-600 rounded-full transition-all duration-300 text-white text-xl"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0a4d44] hover:bg-green-600 rounded-full transition-all duration-300 text-white text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0a4d44] hover:bg-green-600 rounded-full transition-all duration-300 text-white text-xl"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0a4d44] hover:bg-green-600 rounded-full transition-all duration-300 text-white text-xl"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links (Doc Routes) */}
        <div>
          <h3 className="text-xl font-bold mb-6 border-l-4 border-green-500 pl-3">
            Quick Links
          </h3>
          <ul className="space-y-4 text-gray-300">
            <li>
              <Link to="/" className="hover:text-green-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/policies"
                className="hover:text-green-400 transition-colors"
              >
                All Policies
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="hover:text-green-400 transition-colors"
              >
                Blog/Articles
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-green-400 transition-colors"
              >
                Login / Register
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-green-400 transition-colors"
              >
                My Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Our Services (Professional Touch) */}
        <div>
          <h3 className="text-xl font-bold mb-6 border-l-4 border-green-500 pl-3">
            Our Services
          </h3>
          <ul className="space-y-4 text-gray-300">
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              Term Life Insurance
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              Whole Life Insurance
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              Senior Citizen Plans
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              Family Security Plans
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              Savings & Protection
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-6 border-l-4 border-green-500 pl-3">
            Get In Touch
          </h3>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#0a4d44] rounded-md text-green-400">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <p className="text-gray-300 text-sm">
                374 Khawaja K Road, B Hat 1371, CTG
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0a4d44] rounded-md text-green-400">
                <i className="fas fa-phone-alt"></i>
              </div>
              <p className="text-gray-300 text-sm">(+880) 1960-551472</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0a4d44] rounded-md text-green-400">
                <i className="fas fa-envelope"></i>
              </div>
              <p className="text-gray-300 text-sm">alimuntasir2001@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16 pt-8 border-t border-gray-700 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <p>© 2026 Life Shield. Designed By Muntasir-WSX.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">
            Sitemap
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Terms of Use
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
