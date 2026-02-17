import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';
import Loading from '../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';

const QuotePage = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState('male');
    const [isSmoker, setIsSmoker] = useState(false);
    const [coverage, setCoverage] = useState(1000000); 
    const [premium, setPremium] = useState(0);
const { data: allPolicies = [], isLoading } = useQuery({
    queryKey: ['all-policies-list'],
    queryFn: async () => {
        const res = await axiosPublic.get('/policies-list');
        console.log("Fetched Policies:", res.data); 
        return res.data; 
    },
    staleTime: 0,
});

    useEffect(() => {
        if (id && allPolicies.length > 0) {
            const found = allPolicies.find(p => p._id === id);
            if (found) setSelectedPolicy(found);
        }
    }, [id, allPolicies]);

    useEffect(() => {
        if (!selectedPolicy) return;

        // --- Professional Calculation Logic ---
        let baseRate = selectedPolicy.base_rate || 0.5; 
        let basePrice = (coverage * baseRate) / 100;
        const ageFactor = 1 + (Math.max(0, age - 18) * 0.025); 
        const genderFactor = gender === 'female' ? 0.90 : 1.0; 
        const smokerFactor = isSmoker ? 1.35 : 1.0; 

        const yearlyPremium = basePrice * ageFactor * genderFactor * smokerFactor;
        const monthlyPremium = yearlyPremium / 12;
        
        setPremium(Math.round(monthlyPremium));
    }, [age, gender, isSmoker, coverage, selectedPolicy]);

    if (isLoading) return <Loading></Loading>;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
                  <Helmet>
                              <title> Quote | Life Shield - Secure Your Tomorrow</title>
                              <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                      </Helmet>
                {/* --- Left Side: Form --- */}
                <div className="p-8 lg:p-12 lg:w-3/5 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 text-green-700 rounded-2xl"><FaCalculator size={24}/></div>
                        <div>
                            <h2 className="text-3xl font-black text-[#00332c]">Premium Calculator</h2>
                            <p className="text-gray-500 text-sm">Adjust parameters to see real-time pricing</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Policy Selection */}
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Select Life Insurance Plan</label>
                            <select 
                                className="select select-bordered w-full bg-gray-50 focus:outline-green-500 border-gray-200"
                                value={selectedPolicy?._id || ""}
                                onChange={(e) => setSelectedPolicy(allPolicies.find(p => p._id === e.target.value))}
                            >
                                <option value="" disabled>Choose a plan...</option>
                                {allPolicies.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                            </select>
                        </div>

                        {/* Age & Gender Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="font-bold text-gray-700">Age: <span className="text-green-600">{age} yrs</span></label>
                                    <input 
                                        type="number" 
                                        min="18" max="70" 
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-16 border rounded text-center text-sm p-1 focus:ring-1 ring-green-500"
                                    />
                                </div>
                                <input type="range" min="18" max="70" value={age} onChange={(e)=>setAge(e.target.value)} className="range range-success range-sm" />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold text-gray-700">Gender</label>
                                <div className="join w-full">
                                    <button onClick={() => setGender('male')} className={`join-item btn btn-sm flex-1 ${gender === 'male' ? 'btn-success text-white' : 'btn-ghost border-gray-200'}`}>Male</button>
                                    <button onClick={() => setGender('female')} className={`join-item btn btn-sm flex-1 ${gender === 'female' ? 'btn-success text-white' : 'btn-ghost border-gray-200'}`}>Female</button>
                                </div>
                            </div>
                        </div>

                        {/* Coverage Section */}
                        <div className="form-control">
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-bold text-gray-700 text-lg">Coverage: <span className="text-blue-600">৳{coverage.toLocaleString('en-BD')}</span></label>
                                <span className="text-xs badge badge-ghost font-mono uppercase tracking-tighter">Max: 50L</span>
                            </div>
                            <input 
                                type="range" 
                                min="100000" 
                                max="5000000" 
                                step="50000" 
                                value={coverage} 
                                onChange={(e)=>setCoverage(Number(e.target.value))} 
                                className="range range-info range-sm" 
                            />
                            <div className="w-full flex justify-between text-xs px-2 mt-2 font-medium text-gray-400">
                                <span>1 Lakh</span>
                                <span>25 Lakh</span>
                                <span>50 Lakh</span>
                            </div>
                        </div>

                        {/* Risk Factor */}
                        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isSmoker ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={isSmoker}
                                    className="checkbox checkbox-error" 
                                    onChange={(e)=>setIsSmoker(e.target.checked)} 
                                />
                                <div>
                                    <p className={`font-bold ${isSmoker ? 'text-red-700' : 'text-green-700'}`}>Smoker / Tobacco User</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Increased health risk impact premium</p>
                                </div>
                            </div>
                            {isSmoker && <span className="badge badge-error text-white font-bold">+35% Risk</span>}
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Result Summary --- */}
                <div className="lg:w-2/5 bg-[#00332c] p-10 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 text-center">
                        <p className="uppercase tracking-[0.2em] text-xs mb-4 text-green-400 font-bold">Estimated Monthly Investment</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-light text-green-500">৳</span>
                            <h3 className="text-7xl font-black">{premium.toLocaleString('en-BD')}</h3>
                        </div>
                        <p className="text-gray-400 mt-2">inclusive of all taxes</p>

                        <div className="mt-12 space-y-6">
                            <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-white/10 text-left space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Policy Name:</span>
                                    <span className="font-bold text-green-400 truncate ml-4">{selectedPolicy?.title || "Not Selected"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Total Coverage:</span>
                                    <span className="font-bold underline decoration-green-500">৳{coverage.toLocaleString('en-BD')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Insured Person:</span>
                                    <span className="font-bold capitalize">{gender}, {age} Years</span>
                                </div>
                            </div>

                            <Link 
                                to="/apply" 
                                state={{ premium, coverage, policyTitle: selectedPolicy?.title, policyId: selectedPolicy?._id }}
                                className={`w-full bg-white hover:bg-green-900 hover:text-white text-green-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${!selectedPolicy && 'btn-disabled'}`}
                            >
                                Apply for Policy
                            </Link>

                            <div className="flex items-center gap-2 justify-center text-[10px] text-gray-500">
                                <FaInfoCircle />
                                <span>Subject to medical reports & underwriters approval.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;