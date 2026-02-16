import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaEye, FaClock } from 'react-icons/fa';
import useAxiosPublic from '../../../Hooks/UseAxiosPublic';

const ArticleCard = ({ blog }) => {
    const { _id, title, summary, image, date, total_visit, author } = blog;
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const handleProceedToDetails = async () => {
        try {
            await axiosPublic.patch(`/blog/visit/${_id}`);
            navigate(`/blog-details/${_id}`);
        } catch (err) {
            console.error("Visit count update failed", err);
            navigate(`/blog-details/${_id}`);
        }
    };

    return (
        <div className="bg-white rounded-4xl overflow-hidden group border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#00332c]">
                    {new Date(date).toLocaleDateString()}
                </div>
            </div>

            <div className="p-6 flex flex-col grow">
                <h3 className="text-lg font-bold text-[#00332c] mb-2 line-clamp-2 h-14 group-hover:text-green-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 grow">
                    {summary}
                </p>
                
                {/* Modal Trigger Button */}
                <div className="mt-auto">
                    <button 
                        onClick={() => document.getElementById(`modal_${_id}`).showModal()}
                        className="inline-flex items-center gap-2 font-bold text-sm text-green-600 hover:gap-4 transition-all"
                    >
                        Read More <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* --- DaisyUI Modal --- */}
            <dialog id={`modal_${_id}`} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white rounded-4xl p-0 overflow-hidden max-w-2xl">
                    <img src={image} className="w-full h-56 object-cover" alt="" />
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-4 text-xs font-bold text-green-600 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><FaEye /> {total_visit || 0} Visits</span>
                            <span className="flex items-center gap-1"><FaClock /> 5 min read</span>
                        </div>
                        <h3 className="font-black text-2xl text-[#00332c] mb-4">{title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-8">{summary}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleProceedToDetails}
                                className="btn bg-[#00332c] hover:bg-green-600 text-white border-none rounded-xl flex-1 font-bold"
                            >
                                Continue to Full Article
                            </button>
                            <form method="dialog" className="flex-1">
                                <button className="btn btn-outline border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl w-full font-bold">
                                    Close
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ArticleCard;