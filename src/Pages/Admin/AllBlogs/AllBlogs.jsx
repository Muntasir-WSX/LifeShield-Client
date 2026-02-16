import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, BookOpen, User, Calendar, ShieldCheck, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const AllBlogs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // ১. সব ব্লগ ফেচ করা (অ্যাডমিন যেহেতু, তাই ব্যাকএন্ডে আমরা অলরেডি লজিক রেখেছি সব দেখানোর)
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['admin-all-blogs'],
        queryFn: async () => {
            // আপনার ব্যাকএন্ডে app.get("/my-blogs/:email") রুটটিই ব্যবহার করা যাবে 
            // কারণ সেখানে অ্যাডমিন হলে query = {} সেট করা আছে
            const res = await axiosSecure.get(`/my-blogs/${user?.email}`);
            return res.data;
        }
    });

    // ২. ব্লগ ডিলিট করার মিউটেশন
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosSecure.delete(`/blogs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-all-blogs']);
            Swal.fire('Deleted!', 'The blog has been removed by Admin.', 'success');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Admin Action: Delete Blog?',
            text: "This will permanently remove the agent's blog post!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#00332c',
            confirmButtonText: 'Yes, Delete as Admin'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg text-[#00332c]"></span>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-red-50 rounded-2xl text-red-600">
                        <ShieldCheck size={36} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#00332c]">All Blogs Management</h2>
                        <p className="text-gray-400 text-sm font-medium italic">Admin control panel for all published insurance tips</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Blogs</p>
                    <p className="text-2xl font-black text-[#00332c]">{blogs.length}</p>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-0">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest">
                            <tr>
                                <th className="py-6 px-10">Blog Title & Content</th>
                                <th>Author Details</th>
                                <th>Stats</th>
                                <th>Date</th>
                                <th className="text-right px-10">Administrative Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-red-50/30 transition-all border-b border-gray-50 last:border-0">
                                    <td className="py-6 px-10">
                                        <div className="flex flex-col gap-1 max-w-md">
                                            <span className="font-bold text-[#00332c] text-base leading-tight">
                                                {blog.title}
                                            </span>
                                            <span className="text-gray-400 text-xs line-clamp-1 italic">
                                                {blog.content}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 text-[#00332c] font-bold">
                                                <User size={14} className="text-emerald-500" />
                                                {blog.authorName}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-1">
                                                <Mail size={12} />
                                                {blog.authorEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="badge badge-outline border-blue-200 text-blue-600 font-bold px-4 py-3">
                                            {blog.total_visit || 0} Views
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                                            <Calendar size={14} />
                                            {new Date(blog.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="text-right px-10">
                                        <button 
                                            onClick={() => handleDelete(blog._id)}
                                            className="btn btn-circle btn-sm bg-red-50 text-red-500 border-none hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            title="Delete Blog"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {blogs.length === 0 && (
                    <div className="py-20 text-center">
                        <BookOpen size={60} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-gray-400 font-bold">No blogs found in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;