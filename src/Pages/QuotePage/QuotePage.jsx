import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';

const QuotePage = () => {
    const { id } = useParams(); // যদি পলিসি ডিটেইলস থেকে আসে
    const axiosPublic = useAxiosPublic();
    
    // Form States
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState('male');
    const [isSmoker, setIsSmoker] = useState(false);
    const [coverage, setCoverage] = useState(500000);
    const [premium, setPremium] = useState(0);
    const { data: allPolicies = [] } = useQuery({
        queryKey: ['all-policies-list'],
        queryFn: async () => {
            const res = await axiosPublic.get('/all-policies');
            return res.data.result;
        }
    });
    useEffect(() => {
        if (id) {
            const found = allPolicies.find(p => p._id === id);
            if (found) setSelectedPolicy(found);
        }
    }, [id, allPolicies]);
    useEffect(() => {
        if (!selectedPolicy) return;

        let basePrice = coverage * (selectedPolicy.base_rate / 100);
      
        const ageFactor = 1 + (age - 18) * 0.02; 
      
        const genderFactor = gender === 'female' ? 0.95 : 1.0;
        
        const smokerFactor = isSmoker ? 1.20 : 1.0;

        const totalPremium = (basePrice * ageFactor * genderFactor * smokerFactor) / 12;
        setPremium(Math.round(totalPremium));

    }, [age, gender, isSmoker, coverage, selectedPolicy]);

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Form Section */}
                <div className="p-10 md:w-3/5 space-y-6">
                    <h2 className="text-3xl font-black text-[#00332c]">Get Your Free Quote</h2>
                    
                    <div>
                        <label className="label font-bold">Select Policy</label>
                        <select 
                            className="select select-bordered w-full"
                            value={selectedPolicy?._id || ""}
                            onChange={(e) => setSelectedPolicy(allPolicies.find(p => p._id === e.target.value))}
                        >
                            <option disabled value="">Pick a policy</option>
                            {allPolicies.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label font-bold">Your Age: {age}</label>
                            <input type="range" min="18" max="70" value={age} onChange={(e)=>setAge(e.target.value)} className="range range-success" />
                        </div>
                        <div>
                            <label className="label font-bold">Gender</label>
                            <select className="select select-bordered w-full" onChange={(e)=>setGender(e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label font-bold">Coverage Amount (BDT): {coverage.toLocaleString()}</label>
                        <input type="range" min="100000" max="5000000" step="50000" value={coverage} onChange={(e)=>setCoverage(e.target.value)} className="range range-info" />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <input type="checkbox" className="checkbox checkbox-warning" onChange={(e)=>setIsSmoker(e.target.checked)} />
                        <span className="text-sm font-bold text-orange-800">I am a smoker (Higher Risk)</span>
                    </div>
                </div>

                {/* Result Section */}
                <div className="md:w-2/5 bg-[#00332c] p-10 text-white flex flex-col justify-center items-center text-center">
                    <p className="uppercase tracking-widest text-sm mb-4 text-green-400 font-bold">Estimated Premium</p>
                    <h3 className="text-6xl font-black mb-2">৳{premium}</h3>
                    <p className="text-gray-400">Per Month</p>
                    
                    <div className="mt-10 w-full space-y-4">
                        <button className="btn btn-success w-full rounded-xl">Apply for Policy</button>
                        <p className="text-[10px] text-gray-500 italic">*Calculated based on standard health conditions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;