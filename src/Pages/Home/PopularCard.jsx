import React from 'react';
import { Link } from 'react-router-dom';

const PolicyCard = ({ policy }) => {
    const { _id, title, coverage_amount, term_duration, purchased_count } = policy;

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="p-6">
                {/* Popularity Badge */}
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                         Popular ({purchased_count} Sales)
                    </span>
                </div>

                <h3 className="text-xl font-bold text-[#00332c] mb-2 group-hover:text-green-600 transition-colors">
                    {title}
                </h3>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coverage Amount:</span>
                        <span className="font-semibold text-gray-800">${coverage_amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-semibold text-gray-800">{term_duration} Years</span>
                    </div>
                </div>

                {/* Navigation Link to Details Page */}
                <Link 
                    to={`/policy/${_id}`} 
                    className="block text-center bg-[#00332c] hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default PolicyCard;