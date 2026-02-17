import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCheckCircle, FaInfoCircle, FaCalculator, FaShieldAlt } from 'react-icons/fa';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Loading from '../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';


const AllPoliciesDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/policy/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
              <Helmet>
                          <title> All Policies Details | Life Shield - Secure Your Tomorrow</title>
                          <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                  </Helmet>
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Side: Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                            <img 
                                src={policy?.image} 
                                alt={policy?.title} 
                                className="w-full h-80 object-cover rounded-4xl mb-10"
                            />
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                {policy?.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-[#00332c] mt-4 mb-6 leading-tight">
                                {policy?.title}
                            </h1>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                {policy?.description}
                            </p>
                        </div>

                        {/* Benefits Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-[#00332c] mb-8 flex items-center gap-3">
                                <FaShieldAlt className="text-green-500" /> Key Benefits & Eligibility
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex gap-4 p-6 bg-gray-50 rounded-3xl">
                                    <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-[#00332c]">Age Limit</p>
                                        <p className="text-sm text-gray-500">{policy?.min_age} to {policy?.max_age} Years</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-gray-50 rounded-3xl">
                                    <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-[#00332c]">Coverage Range</p>
                                        <p className="text-sm text-gray-500">BDT {policy?.coverage_range}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-gray-50 rounded-3xl">
                                    <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-[#00332c]">Duration Options</p>
                                        <p className="text-sm text-gray-500">{policy?.duration_options?.join(', ')} Years</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 bg-gray-50 rounded-3xl">
                                    <FaInfoCircle className="text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-[#00332c]">Base Rate</p>
                                        <p className="text-sm text-gray-500">{policy?.base_rate}% Premium calculation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: CTA Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 bg-[#00332c] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                            <h4 className="text-2xl font-black mb-4">Estimate Your Premium</h4>
                            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                                Get a quick estimation of how much you need to pay monthly or annually for this policy.
                            </p>
                            
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                                    <span className="text-gray-400">Policy Status</span>
                                    <span className="text-green-400 font-bold">Available</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-white/10 pb-3">
                                    <span className="text-gray-400">Applicants</span>
                                    <span className="font-bold">{policy?.purchased_count}+ Enrolled</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate(`/quote/${policy?._id}`)}
                                className="w-full bg-white hover:bg-green-900 hover:text-white text-green-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300"
                            >
                                <FaCalculator /> Get A Quote Now
                            </button>
                            
                            <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest font-bold">
                                No credit card required to check
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AllPoliciesDetails;