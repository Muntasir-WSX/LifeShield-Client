import React, { useState, useEffect } from 'react';
import { FileText, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2'; // মেসেজ দেখানোর জন্য

const ClaimRequest = () => {
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [loading, setLoading] = useState(false);

    // ১. ডাটা ফেচিং (ব্যাকএন্ড থেকে শুধু Approved পলিসিগুলো আনবেন)
    useEffect(() => {
        // fetch('/api/my-approved-policies')
        // .then(res => res.json())
        // .then(data => setPolicies(data))
        
        // ডামি ডাটা (টেস্ট করার জন্য)
        setPolicies([
            { _id: '1', policyName: 'Life Security Gold', status: 'approved', isClaimed: false },
            { _id: '2', policyName: 'Health Shield Plus', status: 'approved', isClaimed: true, claimStatus: 'pending' },
            { _id: '3', policyName: 'Term Plan 2026', status: 'approved', isClaimed: true, claimStatus: 'approved' }
        ]);
    }, []);

    // ২. ক্লেইম সাবমিট হ্যান্ডলার
    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const form = e.target;
        const reason = form.reason.value;
        const document = form.document.files[0];

        // এখানে আপনার FormData তৈরি করে API কল করবেন
        console.log({ policyId: selectedPolicy._id, reason, document });

        // সফল হলে মেসেজ
        setTimeout(() => {
            Swal.fire("Success", "Claim request submitted as Pending", "success");
            setSelectedPolicy(null); // ফর্ম বন্ধ করার জন্য
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#00332c]">Claim Requests</h3>
                <p className="text-sm text-gray-500">Submit a claim for your active policies</p>
            </div>

            {/* পলিসি টেবিল */}
            <div className="overflow-x-auto">
                <table className="table w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="text-[#00332c] border-b">
                            <th className="p-4 text-left">Policy Name</th>
                            <th className="p-4 text-left">Claim Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy) => (
                            <tr key={policy._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{policy.policyName}</td>
                                <td className="p-4">
                                    {!policy.isClaimed ? (
                                        <span className="text-gray-400 italic">No Claim Yet</span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            {policy.claimStatus === 'pending' && <span className="badge badge-warning gap-1 p-3"><Clock size={14}/> Pending</span>}
                                            {policy.claimStatus === 'approved' && <span className="badge badge-success text-white gap-1 p-3"><CheckCircle size={14}/> Approved</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    {!policy.isClaimed ? (
                                        <button 
                                            onClick={() => setSelectedPolicy(policy)}
                                            className="btn btn-sm bg-[#00332c] text-white hover:bg-black border-none"
                                        >
                                            Claim Now
                                        </button>
                                    ) : (
                                        <button disabled className="btn btn-sm btn-ghost text-gray-400">Claimed</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ক্লেইম ফর্ম মোডাল (যদি পলিসি সিলেক্ট করা থাকে) */}
            {selectedPolicy && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-[#00332c]">Submit Claim</h4>
                            <button onClick={() => setSelectedPolicy(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleClaimSubmit} className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold">Policy Name</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={selectedPolicy.policyName} 
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="label text-sm font-semibold">Reason for Claim</label>
                                <textarea 
                                    name="reason" 
                                    required
                                    placeholder="Briefly describe the reason..." 
                                    className="textarea textarea-bordered w-full h-24 focus:outline-green-500"
                                ></textarea>
                            </div>

                            <div>
                                <label className="label text-sm font-semibold">Upload Supporting Document (PDF/Image)</label>
                                <input 
                                    type="file" 
                                    name="document"
                                    required
                                    className="file-input file-input-bordered file-input-success w-full" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn w-full bg-green-500 hover:bg-green-600 text-white border-none mt-4"
                            >
                                {loading ? 'Submitting...' : <><Send size={18} /> Submit Claim</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClaimRequest;