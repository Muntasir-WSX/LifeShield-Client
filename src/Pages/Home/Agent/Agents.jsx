import React from 'react';
import { FaLinkedinIn, FaEnvelope, FaBriefcase, FaAward } from 'react-icons/fa';

const Agents = () => {
    const agents = [
        {
            name: "Sumon Tareq Jami",
            role: "Financial Risk Analyst",
            experience: "4+ Years",
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974341/Screenshot_2026-02-02_012423_angnqd.png",
            speciality: "Health & Life Insurance"
        },
        {
            name: "Muntasir Mahmud",
            role: "Senior Consultant",
            experience: "6+ Years",
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974393/IMG_20240202_014303_140_bi3kwg.jpg",
            speciality: "Term & Strategic Planning"
        },
        {
            name: "Sayeed Ahmed Bappy",
            role: "Claims Specialist",
            experience: "5+ Years",
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974463/Screenshot_2025-11-26_012321_cfcidy.png",
            speciality: "Asset Protection"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3">Expert Team</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#00332c]">Meet Our Agents</h3>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">Our professionals are dedicated to finding the best insurance solutions tailored to your needs.</p>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {agents.map((agent, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            
                            {/* Round Image Container */}
                            <div className="relative w-64 h-64 mb-8">
                                {/* Border Ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-green-100 group-hover:border-green-500 transition-colors duration-500"></div>
                                
                                {/* The Image */}
                                <div className="absolute inset-2 rounded-full overflow-hidden">
                                    <img 
                                        src={agent.image} 
                                        alt={agent.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Agent+Image' }} // ইমেজ লোড না হলে এটা দেখাবে
                                    />
                                    
                                    {/* Minimal Overlay on Hover */}
                                    <div className="absolute inset-0 bg-[#00332c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <a href="#" className="w-10 h-10 bg-white text-[#00332c] rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                                            <FaLinkedinIn size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white text-[#00332c] rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                                            <FaEnvelope size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h4 className="text-2xl font-bold text-[#00332c] mb-1">{agent.name}</h4>
                                <p className="text-green-600 font-semibold text-sm mb-4 uppercase tracking-wider">{agent.role}</p>
                                
                                <div className="flex flex-col items-center gap-2 pt-4 border-t border-gray-100">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <FaBriefcase className="text-green-600" /> Exp: {agent.experience}
                                    </p>
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <FaAward className="text-green-600" /> {agent.speciality}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Agents;