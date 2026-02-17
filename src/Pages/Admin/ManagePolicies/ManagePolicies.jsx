import React, { useState } from 'react';
import { QueryClient, QueryClientContext, useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';


const ManagePolicies = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedPolicy, setSelectedPolicy] = useState(null); // For Edit mode

    // Fetch All Policies
    const { data: policiesData = {}, refetch, isLoading } = useQuery({
        queryKey: ['all-policies-admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-policies?size=100'); // Admin sees all
            return res.data;
        }
    });

    const policies = policiesData.result || [];

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This policy will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
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
            duration_options: form.duration.value.split(',').map(d => d.trim()), // "5 Years, 10 Years" -> ["5 Years", "10 Years"]
            base_rate: parseFloat(form.base_rate.value),
            image: form.image.value,
            purchased_count: selectedPolicy ? selectedPolicy.purchased_count : 0
        };

        try {
            let res;
            if (selectedPolicy) {
                // Update
                res = await axiosSecure.patch(`/policies/${selectedPolicy._id}`, policyData);
            } else {
                // Add New
                res = await axiosSecure.post('/policies', policyData);
            }

            if (res.data.insertedId || res.data.modifiedCount > 0) {
                QueryClient.invalidateQueries({ queryKey: ['all-policies-admin'] });
                QueryClient.invalidateQueries({ queryKey: ['all-policies-list'] });
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

    if (isLoading) return <Loading></Loading>

    return (
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#00332c]">Manage Insurance Policies</h2>
                    <p className="text-gray-500 text-sm">Create and modify life shield packages</p>
                </div>
                <button 
                    onClick={() => { setSelectedPolicy(null); document.getElementById('policy_modal').showModal(); }}
                    className="btn bg-[#00332c] hover:bg-black text-white border-none rounded-xl"
                >
                    <FaPlus /> Add New Policy
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th>Image</th>
                            <th>Title & Category</th>
                            <th>Age Limit</th>
                            <th>Base Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy._id} className="hover:bg-gray-50/50">
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={policy.image} alt={policy.title} />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-[#00332c]">{policy.title}</div>
                                    <div className="text-xs badge badge-ghost">{policy.category}</div>
                                </td>
                                <td className="text-sm font-medium">{policy.min_age} - {policy.max_age} Years</td>
                                <td className="text-sm font-bold text-green-600">{(policy.base_rate * 100).toFixed(0)}%</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { setSelectedPolicy(policy); document.getElementById('policy_modal').showModal(); }}
                                            className="btn btn-square btn-sm btn-ghost text-blue-500 hover:bg-blue-50"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(policy._id)}
                                            className="btn btn-square btn-sm btn-ghost text-red-500 hover:bg-red-50"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit */}
            <dialog id="policy_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl bg-white">
                    <h3 className="font-bold text-lg mb-4 text-[#00332c]">
                        {selectedPolicy ? 'Edit Policy' : 'Add New Insurance Policy'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Policy Title</label>
                                <input name="title" defaultValue={selectedPolicy?.title} required className="input input-bordered focus:outline-[#00332c]" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Category</label>
                                <select name="category" defaultValue={selectedPolicy?.category} className="select select-bordered focus:outline-[#00332c]">
                                    <option>Term Life</option>
                                    <option>Whole Life</option>
                                    <option>Senior Citizen</option>
                                    <option>Freelancer Special</option>
                                    <option>Health</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase">Description</label>
                            <textarea name="description" defaultValue={selectedPolicy?.description} required className="textarea textarea-bordered h-20 focus:outline-[#00332c]"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Min Age</label>
                                <input type="number" name="min_age" defaultValue={selectedPolicy?.min_age} required className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Max Age</label>
                                <input type="number" name="max_age" defaultValue={selectedPolicy?.max_age} required className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Base Rate (0.01 - 1.0)</label>
                                <input type="number" step="0.01" name="base_rate" defaultValue={selectedPolicy?.base_rate} required className="input input-bordered" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase">Coverage Range (e.g. 10L - 1Cr)</label>
                            <input name="coverage_range" defaultValue={selectedPolicy?.coverage_range} required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase">Duration Options (Comma separated)</label>
                            <input name="duration" defaultValue={selectedPolicy?.duration_options?.join(', ')} placeholder="5 Years, 10 Years, Lifetime" required className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase">Image URL (Cloudinary/ImgBB)</label>
                            <input name="image" defaultValue={selectedPolicy?.image} required className="input input-bordered" />
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={() => document.getElementById('policy_modal').close()} className="btn btn-ghost">Cancel</button>
                            <button type="submit" className="btn bg-[#00332c] text-white hover:bg-black border-none px-8">
                                {selectedPolicy ? 'Save Changes' : 'Publish Policy'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManagePolicies;