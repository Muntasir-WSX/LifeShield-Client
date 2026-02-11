import React from 'react';
import { FaLinkedinIn, FaEnvelope, FaBriefcase } from 'react-icons/fa';

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
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Expert Team</span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#00332c] mt-3">Meet Our Expert Agents</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto italic">
                        "Dedicated professionals working around the clock to ensure your family's future stays protected."
                    </p>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {agents.map((agent, index) => (
                        <div 
                            key={index} 
                            className={`group relative rounded-[40px] p-8 transition-all duration-500 hover:-translate-y-4 ${
                                index === 1 ? 'bg-[#00332c] text-white shadow-2xl' : 'bg-gray-50 text-gray-800'
                            }`}
                        >
                            {/* Profile Image with Border effect */}
                            <div className="relative w-48 h-48 mx-auto mb-8">
                                <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-spin-slow ${
                                    index === 1 ? 'border-green-400' : 'border-green-600'
                                }`}></div>
                                <img 
                                    src={agent.image} 
                                    alt={agent.name} 
                                    className="w-full h-full object-cover rounded-full p-2"
                                />
                            </div>

                            {/* Agent Info */}
                            <div className="text-center space-y-3">
                                <h3 className={`text-2xl font-extrabold ${index === 1 ? 'text-white' : 'text-[#00332c]'}`}>
                                    {agent.name}
                                </h3>
                                <p className={`font-medium ${index === 1 ? 'text-green-400' : 'text-green-600'}`}>
                                    {agent.role}
                                </p>
                                
                                <hr className={`w-12 mx-auto ${index === 1 ? 'border-white/20' : 'border-gray-200'}`} />

                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <FaBriefcase className={index === 1 ? 'text-green-400' : 'text-gray-400'} />
                                        <span>Exp: {agent.experience}</span>
                                    </div>
                                    <p className={`text-sm px-4 ${index === 1 ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Specialist in <span className="font-bold">{agent.speciality}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex justify-center gap-4 mt-8">
                                <a href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/" className={`p-3 rounded-full transition-colors ${
                                    index === 1 ? 'bg-white/10 hover:bg-white text-white hover:text-[#00332c]' : 'bg-white shadow-md hover:bg-[#00332c] hover:text-white'
                                }`}>
                                    <FaLinkedinIn />
                                </a>
                                <a href="https://www.linkedin.com/in/muntasir-mahmud-aa4291278/" className={`p-3 rounded-full transition-colors ${
                                    index === 1 ? 'bg-white/10 hover:bg-white text-white hover:text-[#00332c]' : 'bg-white shadow-md hover:bg-[#00332c] hover:text-white'
                                }`}>
                                    <FaEnvelope />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}} />
        </section>
    );
};

export default Agents;