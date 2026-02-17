import React from "react";
import { Link } from "react-router-dom";
import LifeShieldLogo from "../LifeShieldLogo/LifeShieldLogo";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#00332c] text-white pt-16 pb-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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
        <div className="text-white"> 
            <h3 className="text-xl font-bold mb-6 border-l-4 border-green-500 pl-3 uppercase tracking-wider text-white">
                Get In Touch
            </h3>
            
            <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4 group">
                    <div className="p-2.5 bg-[#0a4d44] rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                        <FaMapMarkerAlt size={16} />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        374 Khawaja K Road, <br /> B Hat 1371, Chattogram
                    </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 group">
                    <div className="p-2.5 bg-[#0a4d44] rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                        <FaPhoneAlt size={16} />
                    </div>
                    <p className="text-gray-300 text-sm font-medium">(+880) 1960-551472</p>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 group">
                    <div className="p-2.5 bg-[#0a4d44] rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                        <FaEnvelope size={16} />
                    </div>
                    <p className="text-gray-300 text-sm break-all">lifeshield@gmail.com</p>
                </div>
            </div>
        </div>
      </div>
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
