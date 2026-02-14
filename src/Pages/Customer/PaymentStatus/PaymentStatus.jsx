import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const PaymentStatus = () => {
    const [policies, setPolicies] = useState([]);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    
    useEffect(() => {
        axiosSecure.get('/my-approved-policies')
            .then(res => setPolicies(res.data))
    }, []);

    return (
        <div className="overflow-x-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#00332c]">Payment Management</h3>
                <p className="text-sm text-gray-500">Track and pay your policy premiums</p>
            </div>

            <table className="table w-full border-collapse">
                <thead className="bg-gray-50">
                    <tr className="text-[#00332c] border-b">
                        <th className="p-4 text-left">Policy Name</th>
                        <th className="p-4 text-left">Premium Amount</th>
                        <th className="p-4 text-left">Frequency</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy) => (
                        <tr key={policy._id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium">{policy.policyName}</td>
                            <td className="p-4">${policy.premiumAmount}</td>
                            <td className="p-4 capitalize">{policy.frequency}</td>
                            <td className="p-4">
                                {policy.paymentStatus === 'paid' ? (
                                    <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                        <CheckCircle size={16} /> Paid
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm">
                                        <Clock size={16} /> Due
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-center">
                                {policy.paymentStatus === 'due' ? (
                                    <button 
                                        onClick={() => navigate(`/dashboard/payment/${policy._id}`)}
                                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none rounded-lg flex items-center gap-2 mx-auto"
                                    >
                                        <CreditCard size={14} /> Pay Now
                                    </button>
                                ) : (
                                    <button className="btn btn-sm btn-disabled rounded-lg mx-auto">Complete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {policies.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No approved policies found for payment.
                </div>
            )}
        </div>
    );
};

export default PaymentStatus;