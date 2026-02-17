import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, PackagePlus } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';

const ManagePolicies = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8; 

    // Fetch Policies with Pagination
    const { data: policiesData = {}, refetch, isLoading } = useQuery({
        queryKey: ['all-policies-admin', currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-policies?page=${currentPage}&size=${itemsPerPage}`);
            return res.data;
        }
    });

    const policies = policiesData.result || [];
    const totalPages = Math.ceil((policiesData.count || 0) / itemsPerPage);
    const pages = [...Array(totalPages).keys()];

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This policy will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonColor: "#00332c",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/policies/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire("Deleted!", "Policy has been removed.", "success");
                }
            }
        });
    };

    // Handle Add/Edit Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const policyData = {
            title: form.title.value,
            category: form.category.value,
            description: form.description.value,
            min_age: parseInt(form.min_age.value),
            max_age: parseInt(form.max_age.value),
            coverage_range: form.coverage_range.value,
            duration_options: form.duration.value.split(',').map(d => d.trim()),
            base_rate: parseFloat(form.base_rate.value),
            image: form.image.value,
            purchased_count: selectedPolicy ? selectedPolicy.purchased_count : 0
        };

        try {
            let res;
            if (selectedPolicy) {
                res = await axiosSecure.patch(`/policies/${selectedPolicy._id}`, policyData);
            } else {
                res = await axiosSecure.post('/policies', policyData);
            }

            if (res.data.insertedId || res.data.modifiedCount > 0) {
                queryClient.invalidateQueries(['all-policies-admin']);
                queryClient.invalidateQueries(['policies']); 
                Swal.fire("Success!", `Policy ${selectedPolicy ? 'updated' : 'added'} successfully`, "success");
                document.getElementById('policy_modal').close();
                form.reset();
                setSelectedPolicy(null);
                refetch();
            }
        } catch (error) {
            Swal.fire("Error!", error.message, "error");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="p-6 space-y-6">
            <Helmet>
                                      <title> Manage Policies | Life Shield - Secure Your Tomorrow</title>
                                      <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                              </Helmet>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#00332c]">Policy Management</h2>
                    <p className="text-sm text-gray-500 font-medium">Create and control insurance packages</p>
                </div>
                <button 
                    onClick={() => { setSelectedPolicy(null); document.getElementById('policy_modal').showModal(); }}
                    className="btn bg-[#00332c] hover:bg-black text-white border-none rounded-xl px-6 flex items-center gap-2"
                >
                    <PackagePlus size={18} /> Add New Policy
                </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                        <tr>
                            <th className="py-4 px-6">Image</th>
                            <th>Policy Info</th>
                            <th>Target Age</th>
                            <th>Base Rate</th>
                            <th className="text-right px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy._id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={policy.image} alt={policy.title} className="object-cover" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-[#00332c]">{policy.title}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{policy.category}</div>
                                </td>
                                <td className="text-sm font-medium text-gray-600">
                                    {policy.min_age} - {policy.max_age} <span className="text-[10px] opacity-50 uppercase">Years</span>
                                </td>
                                <td>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                                        {(policy.base_rate * 100).toFixed(0)}%
                                    </span>
                                </td>
                                <td className="text-right px-6">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => { setSelectedPolicy(policy); document.getElementById('policy_modal').showModal(); }}
                                            className="btn btn-square btn-sm bg-blue-50 text-blue-600 border-none hover:bg-blue-100"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(policy._id)}
                                            className="btn btn-square btn-sm bg-red-50 text-red-500 border-none hover:bg-red-100"
                                        >
                                            <FaTrashAlt size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-lg"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`btn btn-sm border-none transition-all h-10 px-4 rounded-lg ${
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
                        className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-lg"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Modal for Add/Edit */}
            <dialog id="policy_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl bg-white rounded-4xl p-0 overflow-hidden shadow-2xl">
                    <div className="bg-[#00332c] p-6 text-white">
                        <h3 className="font-black text-xl">
                            {selectedPolicy ? 'Edit Policy Details' : 'Publish New Policy'}
                        </h3>
                        <p className="text-xs opacity-70">Fill in the details to update your insurance portfolio</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-gray-400">Policy Title</label>
                                <input name="title" defaultValue={selectedPolicy?.title} required className="input bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500" placeholder="e.g. Life Shield Plus" />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-gray-400">Category</label>
                                <select name="category" defaultValue={selectedPolicy?.category} className="select bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-bold">
                                    <option>Term Life</option>
                                    <option>Whole Life</option>
                                    <option>Senior Plan</option>
                                    <option>Freelancer Special</option>
                                    <option>Health</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-[10px] font-bold uppercase text-gray-400">Description</label>
                            <textarea name="description" defaultValue={selectedPolicy?.description} required className="textarea bg-gray-50 border-none rounded-xl h-24 focus:ring-2 focus:ring-green-500" placeholder="Briefly explain the policy benefits..."></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-gray-400">Min Age</label>
                                <input type="number" name="min_age" defaultValue={selectedPolicy?.min_age} required className="input bg-gray-50 border-none rounded-xl" />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-gray-400">Max Age</label>
                                <input type="number" name="max_age" defaultValue={selectedPolicy?.max_age} required className="input bg-gray-50 border-none rounded-xl" />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-gray-400">Base Rate (0.01 - 1.0)</label>
                                <input type="number" step="0.01" name="base_rate" defaultValue={selectedPolicy?.base_rate} required className="input bg-gray-50 border-none rounded-xl" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-[10px] font-bold uppercase text-gray-400">Coverage Range (e.g. 10L - 1Cr)</label>
                            <input name="coverage_range" defaultValue={selectedPolicy?.coverage_range} required className="input bg-gray-50 border-none rounded-xl" />
                        </div>

                        <div className="form-control">
                            <label className="label text-[10px] font-bold uppercase text-gray-400">Duration Options (Comma separated)</label>
                            <input name="duration" defaultValue={selectedPolicy?.duration_options?.join(', ')} placeholder="5 Years, 10 Years, Lifetime" required className="input bg-gray-50 border-none rounded-xl" />
                        </div>

                        <div className="form-control">
                            <label className="label text-[10px] font-bold uppercase text-gray-400">Image URL</label>
                            <input name="image" defaultValue={selectedPolicy?.image} required className="input bg-gray-50 border-none rounded-xl text-xs" />
                        </div>

                        <div className="modal-action pt-4 border-t gap-3">
                            <button type="button" onClick={() => document.getElementById('policy_modal').close()} className="btn btn-ghost rounded-xl">Discard</button>
                            <button type="submit" className="btn bg-[#00332c] text-white hover:bg-black border-none px-8 rounded-xl flex-1">
                                {selectedPolicy ? 'Update Strategy' : 'Publish Strategy'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManagePolicies;