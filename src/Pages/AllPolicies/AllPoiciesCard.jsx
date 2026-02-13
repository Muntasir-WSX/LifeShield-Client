import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUsers, FaClock } from 'react-icons/fa';

const AllPoliciesCard = ({ policy }) => {
    const { _id, title, image, category, description, min_age, max_age, duration_options } = policy;

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group">
            {/* Image Section */}
            <div className="relative h-60 overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-[#00332c] uppercase tracking-widest shadow-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-[#00332c] mb-3 leading-tight group-hover:text-green-600 transition-colors">
                    {title}
                </h3>
                
                {/* Short Details (20-30 words logic) */}
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                    {description}
                </p>

                {/* Policy Specs */}
                <div className="grid grid-cols-2 gap-4 mb-8 py-4 border-y border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                        <FaUsers className="text-green-500" />
                        <span className="text-xs font-bold uppercase">{min_age}-{max_age} Years</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <FaClock className="text-green-500" />
                        <span className="text-xs font-bold uppercase">{duration_options?.[0]}+ Years</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Link 
                        to={`/policy/${_id}`}
                        className="w-full bg-[#f8fafc] group-hover:bg-green-600 group-hover:text-white text-[#00332c] font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                    >
                        View Details <FaArrowRight className="text-sm" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AllPoliciesCard;