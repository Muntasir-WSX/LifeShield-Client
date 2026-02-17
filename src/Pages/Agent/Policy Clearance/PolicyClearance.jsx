import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Eye, CheckCircle, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import Loading from '../../../SharedComponents/Loading/Loading';

const PolicyClearance = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const { data: claims = [], isLoading } = useQuery({
        queryKey: ['claim-policies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/claim-policies/${user?.email}`);
            return res.data;
        }
    });

    const approveMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosSecure.patch(`/applications/approve-claim/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['claim-policies']);
            Swal.fire("Approved!", "Policy claim has been approved.", "success");
            document.getElementById('details_modal').close();
        }
    });

    const handleApprove = (id) => {
        approveMutation.mutate(id);
    };

    if (isLoading) return <Loading></Loading>

    return (
        <div className="p-6">
            <Helmet>
                                      <title> Your Clearence | Life Shield - Secure Your Tomorrow</title>
                                      <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                              </Helmet>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-[#00332c]">Policy Clearance</h2>
                    <p className="text-gray-400">Review and approve customer policy claims</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-[#00332c] uppercase text-xs">
                        <tr>
                            <th>Policy Name</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                                <td className="font-bold">{claim.policyTitle}</td>
                                <td>{claim.applicantName}</td>
                                <td className="font-semibold">${claim.paidAmount}</td>
                                <td>
                                    <span className="badge badge-warning font-bold">{claim.claimStatus}</span>
                                </td>
                                <td className="text-right">
                                    <button 
                                        onClick={() => {
                                            setSelectedPolicy(claim);
                                            document.getElementById('details_modal').showModal();
                                        }}
                                        className="btn btn-sm bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100"
                                    >
                                        <Eye size={16} /> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {claims.length === 0 && <p className="text-center py-10 text-gray-400">No pending claims found.</p>}
            </div>

            {/* Details Modal */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box rounded-4xl p-10 max-w-lg">
                    <h3 className="font-black text-2xl text-[#00332c] mb-4">Claim Details</h3>
                    {selectedPolicy && (
                        <div className="space-y-3">
                            <p><strong>Customer Email:</strong> {selectedPolicy.applicantEmail}</p>
                            <p><strong>Transaction ID:</strong> {selectedPolicy.transactionId}</p>
                            <p><strong>Payment Date:</strong> {selectedPolicy.paymentDate}</p>
                            <p><strong>Policy ID:</strong> {selectedPolicy.policyId}</p>
                            <hr className="my-4" />
                            <button 
                                onClick={() => handleApprove(selectedPolicy._id)}
                                className="btn bg-[#00332c] hover:bg-black text-white w-full rounded-xl gap-2"
                                disabled={approveMutation.isLoading}
                            >
                                <CheckCircle size={20} /> Approve Claim
                            </button>
                        </div>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default PolicyClearance;