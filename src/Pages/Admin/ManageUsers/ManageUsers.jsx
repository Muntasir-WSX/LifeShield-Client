import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, UserPlus, ShieldCheck } from 'lucide-react'; 
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Helmet } from 'react-helmet-async';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const handleMakeRole = (user, newRole) => {
        axiosSecure.patch(`/users/role/${user._id}`, { role: newRole })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.name} is now an ${newRole}!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
              <Helmet>
                          <title> Manage Users | Life Shield - Secure Your Tomorrow</title>
                          <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                  </Helmet>
            {/* Header Section - Responsive Flex */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#00332c]">Manage All Users</h2>
                    <p className="text-xs text-gray-500">Update user roles and permissions</p>
                </div>
                <div className="badge badge-lg bg-green-100 text-green-700 border-none px-4 py-5 font-bold whitespace-nowrap">
                    Total Users: {users.length}
                </div>
            </div>

            {/* Table Container - Essential for responsiveness */}
            <div className="overflow-x-auto w-full rounded-xl border border-gray-50">
                <table className="table w-full border-collapse">
                    {/* Head */}
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="bg-gray-50 py-4">#</th>
                            <th className="bg-gray-50">User Info</th>
                            <th className="bg-gray-50">Current Role</th>
                            <th className="bg-gray-50 text-center">Change Role</th>
                            <th className="bg-gray-50">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50">
                                <td className="font-medium text-gray-400">{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3 min-w-50">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10 shadow-sm">
                                                <img src={user.photo || "https://i.ibb.co/mR4pY6F/user.png"} alt="User" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#00332c] text-sm md:text-base">{user.name}</div>
                                            <div className="text-[11px] opacity-60 font-mono">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`capitalize font-bold text-[10px] px-3 py-1 rounded-full inline-block shadow-sm ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                        user.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role || 'customer'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center gap-2 min-w-45">
                                        {user.role !== 'agent' && (
                                            <button 
                                                onClick={() => handleMakeRole(user, 'agent')} 
                                                className="btn btn-xs normal-case bg-blue-500 text-white border-none hover:bg-blue-600 px-3"
                                                title="Promote to Agent"
                                            >
                                                <UserPlus size={12} className="mr-1" /> Agent
                                            </button>
                                        )}
                                        
                                        {user.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleMakeRole(user, 'admin')} 
                                                className="btn btn-xs normal-case bg-purple-500 text-white border-none hover:bg-purple-600 px-3"
                                                title="Promote to Admin"
                                            >
                                                <ShieldCheck size={12} className="mr-1" /> Admin
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No users found in the database.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;