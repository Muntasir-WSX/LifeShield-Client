import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const ArticleCard = ({ blog }) => {
    if (!blog) return null;
    const { _id, title, summary, image, date } = blog;

    return (
        <div className="bg-white rounded-[32px] overflow-hidden group border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#00332c]">
                    {new Date(date).toLocaleDateString()}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[#00332c] mb-2 line-clamp-2 h-14 group-hover:text-green-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                    {summary}
                </p>
                <div className="mt-auto">
                    <Link 
                        to={`/blog-details/${_id}`} 
                        className="inline-flex items-center gap-2 font-bold text-sm text-green-600 hover:gap-4 transition-all"
                    >
                        Read More <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;