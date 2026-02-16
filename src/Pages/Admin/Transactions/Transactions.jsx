import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Users, Calendar, Filter, Search } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const Transactions = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['admin-transactions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/transactions');
            return res.data.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
        }
    });
    const filteredTransactions = transactions.filter(tx => 
        tx.policyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalIncome = transactions.reduce((sum, item) => sum + (parseFloat(item.paidAmount) || 0), 0);
    const chartData = [...transactions].reverse().map(t => ({
        date: new Date(t.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        amount: parseFloat(t.paidAmount)
    }));

    if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Financial Records...</div>;

    return (
        <div className="space-y-8">
            {/* Header & Search Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#00332c]">Manage Transactions</h2>
                    <p className="text-gray-500 text-sm font-medium">Tracking {transactions.length} total payments</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative grow lg:grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search policy or email..."
                            className="input input-sm pl-10 w-full lg:w-64 bg-white border-gray-200 rounded-xl focus:outline-[#00332c]"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm bg-white border-gray-200 text-gray-600 rounded-xl px-4 hover:bg-gray-50">
                        <Calendar size={16} /> Date
                    </button>
                    <button className="btn btn-sm bg-[#00332c] text-white border-none rounded-xl px-4">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex flex-col justify-center">
                    <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-100">
                        <DollarSign size={20} />
                    </div>
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[2px]">Total Revenue</p>
                    <h3 className="text-4xl font-black text-[#00332c] mt-1 tracking-tight">
                        ${totalIncome.toLocaleString()}
                    </h3>
                </div>
                
                <div className="bg-white border border-gray-100 p-6 rounded-3xl md:col-span-2 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">Revenue Growth</p>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">Real-time Data</span>
                    </div>
                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <XAxis dataKey="date" hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-collapse">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="py-6 px-8">Transaction Details</th>
                                <th>Customer</th>
                                <th>Policy</th>
                                <th>Amount</th>
                                <th className="text-right px-8">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50/80 border-b border-gray-50 last:border-0 transition-all">
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-md w-fit mb-1">
                                                #{tx.transactionId?.slice(-12)}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                                Payment Successful
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-[#00332c]">{tx.applicantName}</div>
                                        <div className="text-[11px] text-gray-400 font-medium">{tx.applicantEmail}</div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-gray-700 text-xs">
                                            {tx.policyTitle}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-black text-[#00332c] text-lg">
                                            ${tx.paidAmount}
                                        </div>
                                    </td>
                                    <td className="text-right px-8">
                                        <div className="text-gray-500 font-bold text-xs">
                                            {new Date(tx.paymentDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-[10px] text-gray-300 font-medium">
                                            {new Date(tx.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTransactions.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-medium">
                        No transactions found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;