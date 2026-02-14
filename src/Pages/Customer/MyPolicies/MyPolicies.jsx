import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Eye, Star, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/UseAxiosPublic';

const MyPolicies = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const { data: myAppliedPolicies = [], refetch } = useQuery({
        queryKey: ['my-policies', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/applied-policies/${user?.email}`);
            return res.data;
        }
    });


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const feedback = form.feedback.value;

        const reviewData = {
            userName: user?.displayName,
            userPhoto: user?.photoURL,
            policyTitle: selectedPolicy?.policyTitle,
            rating: parseInt(rating),
            feedback,
            date: new Date().toLocaleDateString()
        };

        const res = await axiosPublic.post('/reviews', reviewData);
        if (res.data.insertedId) {
            Swal.fire("Success!", "Thank you for your feedback!", "success");
            document.getElementById('review-modal').close();
            form.reset();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#00332c]">My Applied Policies</h3>
                <span className="badge badge-ghost border-green-200 text-green-700 p-4">Total: {myAppliedPolicies.length}</span>
            </div>

            {/* --- Table Section --- */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-gray-50 text-[#00332c] uppercase text-[11px] tracking-wider">
                        <tr>
                            <th>Policy Name</th>
                            <th>Coverage</th>
                            <th>Premium</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {myAppliedPolicies.map((policy) => (
                            <tr key={policy._id} className="hover:bg-gray-50 transition-colors">
                                <td className="font-bold">{policy.policyTitle}</td>
                                <td>৳{policy.coverage?.toLocaleString()}</td>
                                <td>৳{policy.premium}/mo</td>
                                <td>
                                    <span className={`badge badge-sm font-bold p-3 ${
                                        policy.status === 'Approved' ? 'badge-success text-white' : 
                                        policy.status === 'Rejected' ? 'badge-error text-white' : 'badge-warning'
                                    }`}>
                                        {policy.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button className="btn btn-square btn-ghost btn-sm text-blue-600 border border-blue-100">
                                        <Eye size={16} />
                                    </button>
                                    {/* Review Button: শুধু Approved হলে রিভিউ দেওয়া যাবে */}
                                    {policy.status === 'Approved' && (
                                        <button 
                                            onClick={() => {
                                                setSelectedPolicy(policy);
                                                document.getElementById('review-modal').showModal();
                                            }}
                                            className="btn btn-sm btn-success text-white rounded-lg flex items-center gap-1"
                                        >
                                            <Star size={14} /> Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- DaisyUI Modal for Review --- */}
            <dialog id="review-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl"><MessageSquare size={24}/></div>
                        <h3 className="font-black text-2xl text-[#00332c]">Give Feedback</h3>
                    </div>
                    
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <p className="text-sm text-gray-500 italic">Policy: {selectedPolicy?.policyTitle}</p>
                        
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Star Rating</label>
                            <div className="rating rating-lg gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <input key={num} type="radio" name="rating" value={num} className="mask mask-star-2 bg-yellow-400" required />
                                ))}
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Your Experience</label>
                            <textarea 
                                name="feedback" 
                                className="textarea textarea-bordered h-24 bg-gray-50 focus:outline-green-500" 
                                placeholder="Tell us how you feel about this policy..."
                                required
                            ></textarea>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={() => document.getElementById('review-modal').close()} className="btn btn-ghost">Close</button>
                            <button type="submit" className="btn btn-success text-white px-8">Submit Review</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyPolicies;