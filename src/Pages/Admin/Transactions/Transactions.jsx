import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Calendar, Filter, Search, ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';

const Transactions = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 7;

    const { data: { result: transactions = [], count = 0 } = {}, isLoading } = useQuery({
        queryKey: ['admin-transactions', currentPage, searchTerm],
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/transactions?page=${currentPage}&size=${itemsPerPage}&search=${searchTerm}`);
            return res.data;
        }
    });
    const totalIncome = transactions.reduce((sum, item) => sum + (parseFloat(item.paidAmount) || 0), 0);
    
    const chartData = [...transactions].reverse().map(t => ({
        date: new Date(t.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        amount: parseFloat(t.paidAmount)
    }));

    const totalPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(totalPages).keys()];

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-8 p-2">
            <Helmet>
                                      <title> Manage Transactions | Life Shield - Secure Your Tomorrow</title>
                                      <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                              </Helmet>
            {/* Header & Search Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#00332c]">Financial Records</h2>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <ReceiptText size={16} /> Tracking {count} total payments
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="relative grow lg:grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search email or policy..."
                            className="input input-sm pl-10 w-full lg:w-64 bg-white border-gray-200 rounded-xl focus:outline-[#00332c] h-10"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(0); 
                            }}
                        />
                    </div>
                    <button className="btn btn-sm bg-[#00332c] text-white border-none rounded-xl px-4 h-10">
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
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[2px]">Revenue Overview</p>
                    <h3 className="text-4xl font-black text-[#00332c] mt-1 tracking-tight">
                        ${totalIncome.toLocaleString()}
                    </h3>
                </div>
                
                <div className="bg-white border border-gray-100 p-6 rounded-3xl md:col-span-2 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">Growth Analytics</p>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold uppercase">Recent Trend</span>
                    </div>
                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-collapse">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="py-6 px-8">TX ID</th>
                                <th>Customer Info</th>
                                <th>Policy Title</th>
                                <th>Amount</th>
                                <th className="text-right px-8">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400 font-medium">
                                        No financial records found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/80 border-b border-gray-50 last:border-0 transition-all">
                                        <td className="py-5 px-8">
                                            <span className="font-mono text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                                #{tx.transactionId?.slice(-10).toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="font-bold text-[#00332c]">{tx.applicantName}</div>
                                            <div className="text-[11px] text-gray-400 font-medium">{tx.applicantEmail}</div>
                                        </td>
                                        <td>
                                            <div className="font-bold text-gray-600 text-xs truncate max-w-37.5">
                                                {tx.policyTitle}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-black text-[#00332c]">
                                                ${tx.paidAmount}
                                            </div>
                                        </td>
                                        <td className="text-right px-8">
                                            <div className="text-gray-500 font-bold text-xs">
                                                {new Date(tx.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] text-gray-300 font-medium uppercase">
                                                {new Date(tx.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pb-10">
                    <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="btn btn-sm bg-white border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-xl"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`btn btn-sm border-none transition-all h-10 px-4 rounded-xl ${
                                currentPage === page
                                    ? "bg-[#00332c] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="btn btn-sm bg-white border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-xl"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Transactions;