import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';


const ClaimRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [loading, setLoading] = useState(false);

   
    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/my-approved-policies/${user.email}`)
                .then(res => setPolicies(res.data))
                .catch(err => console.error(err));
        }
    }, [user?.email, axiosSecure]);

 
    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const form = e.target;
        const reason = form.reason.value;
        const document = form.document.value; // ইমেজ হোস্টিং করে লিংক দিলে ভালো, আপাতত ডামি হিসেবে ধরছি

        const claimData = {
            claimStatus: "Pending", // ডিমান্ড অনুযায়ী স্ট্যাটাস Pending হবে
            claimReason: reason,
            claimDocument: document 
        };

        try {
            const res = await axiosSecure.patch(`/applications/claim/${selectedPolicy._id}`, claimData);
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", "Claim request submitted as Pending", "success");
                
                // লোকাল স্টেট আপডেট যাতে রিলোড ছাড়া চেঞ্জ দেখা যায়
                setPolicies(prev => prev.map(p => 
                    p._id === selectedPolicy._id ? { ...p, claimStatus: "Pending" } : p
                ));
                setSelectedPolicy(null);
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    // ৩. ঐচ্ছিক টাস্ক: Approved হলে এলার্ট দেখানো
    const showApprovedAlert = (policy) => {
        Swal.fire({
            title: 'Claim Approved!',
            text: `Your claim for ${policy.policyName} has been settled.`,
            icon: 'success',
            confirmButtonColor: '#00332c'
        });
    }

    return (
        <div className="p-4 space-y-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#00332c]">Claim Requests</h3>
                <p className="text-sm text-gray-500">Submit a claim for your active policies</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-50 text-[#00332c]">
                            <th>Policy Name</th>
                            <th>Claim Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy) => (
                            <tr key={policy._id} className="hover:bg-gray-50">
                                <td className="font-medium">{policy.policyName}</td>
                                <td>
                                    {!policy.claimStatus ? (
                                        <span className="text-gray-400 italic">No Claim Yet</span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            {policy.claimStatus === 'Pending' && 
                                                <span className="badge badge-warning gap-1 py-3"><Clock size={14}/> Pending</span>}
                                            {policy.claimStatus === 'Approved' && 
                                                <button onClick={() => showApprovedAlert(policy)} className="badge badge-success text-white gap-1 py-3 cursor-pointer">
                                                    <CheckCircle size={14}/> Approved
                                                </button>}
                                        </div>
                                    )}
                                </td>
                                <td className="text-center">
                                    {/* কন্ডিশনাল বাটন: যদি ক্লেইম না থাকে তবেই Claim Now দেখাবে */}
                                    {!policy.claimStatus ? (
                                        <button 
                                            onClick={() => setSelectedPolicy(policy)}
                                            className="btn btn-sm bg-[#00332c] text-white hover:bg-black border-none"
                                        >
                                            Claim Now
                                        </button>
                                    ) : (
                                        <button disabled className="btn btn-sm btn-disabled">Already Claimed</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Form logic remains similar to yours but with real dynamic interaction */}
            {selectedPolicy && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-[#00332c]">Submit Claim</h4>
                            <button onClick={() => setSelectedPolicy(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleClaimSubmit} className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold">Policy Name</label>
                                <input type="text" readOnly value={selectedPolicy.policyName} className="input input-bordered w-full bg-gray-100" />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Reason for Claim</label>
                                <textarea name="reason" required className="textarea textarea-bordered w-full h-24 focus:outline-green-500" placeholder="Why are you claiming?"></textarea>
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Supporting Document Link</label>
                                <input type="text" name="document" placeholder="Document URL" required className="input input-bordered w-full" />
                            </div>
                            <button type="submit" disabled={loading} className="btn w-full bg-green-600 hover:bg-green-700 text-white border-none mt-4">
                                {loading ? 'Submitting...' : 'Submit Claim'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClaimRequest;