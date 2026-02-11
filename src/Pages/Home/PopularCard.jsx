import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const PolicyCard = ({ policy }) => {
    const { _id, title, coverage_amount, term_duration, purchased_count, image, category } = policy;

    return (
        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
            
            {/* Image Section with Overlay */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00332c]/90 via-[#00332c]/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {category}
                    </span>
                </div>

                {/* Popularity Badge (Floating) */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs border border-white/30">
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                        {purchased_count} People Secured
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow bg-white">
                <h3 className="text-xl font-bold text-[#00332c] mb-3 group-hover:text-green-600 transition-colors line-clamp-1">
                    {title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase mb-1">
                            <FaShieldAlt className="text-green-600" /> Coverage
                        </div>
                        <span className="text-[#00332c] font-extrabold text-base">${coverage_amount.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-2xl flex flex-col">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase mb-1">
                            <FaCalendarAlt className="text-green-600" /> Duration
                        </div>
                        <span className="text-[#00332c] font-extrabold text-base">{term_duration} Yrs</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    <Link 
                        to={`/policy/${_id}`} 
                        className="group/btn w-full bg-[#00332c] hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-green-900/10"
                    >
                        View Details
                        <FaChevronRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Subtle bottom border on hover */}
            <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>
        </div>
    );
};

export default PolicyCard;