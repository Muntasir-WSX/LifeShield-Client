import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { Trash2, UserCog, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

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
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#00332c]">Manage All Users</h2>
                <div className="badge badge-lg bg-green-100 text-green-700 border-none px-4 py-4 font-bold">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th>#</th>
                            <th>User Info</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10">
                                                <img src={user.photo || "https://i.ibb.co/mR4pY6F/user.png"} alt="User" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.name}</div>
                                            <div className="text-xs opacity-50">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`capitalize font-bold text-xs px-3 py-1 rounded-full ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                        user.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role || 'customer'}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                 
                                    {user.role !== 'agent' && (
                                        <button onClick={() => handleMakeRole(user, 'agent')} className="btn btn-xs bg-blue-500 text-white border-none hover:bg-blue-600">
                                            Make Agent
                                        </button>
                                    )}
                                   
                                    {user.role !== 'admin' && (
                                        <button onClick={() => handleMakeRole(user, 'admin')} className="btn btn-xs bg-purple-500 text-white border-none hover:bg-purple-600">
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;