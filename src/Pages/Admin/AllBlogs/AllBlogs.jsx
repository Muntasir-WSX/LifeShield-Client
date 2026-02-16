import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Plus, ArrowRight, Loader2, Mail, User } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from '../../../SharedComponents/Loading/Loading';

const MyBlogs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['my-blogs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-blogs/${user?.email}`);
            return res.data;
        }
    });

    const showToast = (message) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 3000
        });
    };

    const blogMutation = useMutation({
        mutationFn: async (blogData) => {
            if (selectedBlog) {
                return await axiosSecure.patch(`/blogs/${selectedBlog._id}`, blogData);
            }
            return await axiosSecure.post('/blogs', blogData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-blogs']);
            showToast(selectedBlog ? "Blog Updated!" : "Blog Published!");
            closeModal();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await axiosSecure.delete(`/blogs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-blogs']);
            showToast("Blog removed");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const content = form.content.value;
        const imageFile = form.image.files[0];

        let imageUrl = selectedBlog?.image;

        setUploading(true);
        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const imgBB_API_KEY = import.meta.env.VITE_Image_Upload_Key;
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const imgData = await res.json();
                imageUrl = imgData.data.display_url;
            }

            const blogData = {
                title,
                content,
                image: imageUrl,
                author: user?.displayName,
                authorEmail: user?.email,
                authorPhoto: user?.photoURL, // ইউজার ফটো যুক্ত করা হলো
                date: selectedBlog ? selectedBlog.date : new Date().toISOString().split('T')[0],
                total_visit: selectedBlog ? selectedBlog.total_visit : 0,
            };

            blogMutation.mutate(blogData);
        } catch (error) {
            Swal.fire('Error', 'Action failed!', 'error');
        } finally {
            setUploading(false);
        }
    };

    const openEditModal = (blog) => {
        setSelectedBlog(blog);
        document.getElementById('blog_modal').showModal();
    };

    const closeModal = () => {
        setSelectedBlog(null);
        document.getElementById('blog_form').reset();
        document.getElementById('blog_modal').close();
    };

    if (isLoading) return <Loading />

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {uploading && (
                <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-[#00332c]" size={50} />
                    <p className="font-black mt-4">PROCESSING...</p>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm mb-8 border border-gray-100">
                <div>
                    <h2 className="text-3xl font-black text-[#00332c]">My Article Studio</h2>
                    <p className="text-gray-400 mt-1">Manage and publish your insurance insights</p>
                </div>
                <button onClick={() => document.getElementById('blog_modal').showModal()} className="btn bg-[#00332c] hover:bg-black text-white px-8 rounded-2xl h-14 mt-4 md:mt-0 shadow-lg shadow-emerald-900/10">
                    <Plus size={20} className="mr-2" /> Write New Post
                </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[#00332c] uppercase text-[11px] font-black tracking-widest">
                                <th className="py-5 pl-8">Article Details</th>
                                <th>Author Info</th>
                                <th>Published Date</th>
                                <th className="text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                                <img src={blog.image} className="h-full w-full object-cover" alt="blog" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-[#00332c] block max-w-xs truncate">{blog.title}</span>
                                                <span className="text-xs text-emerald-600 font-medium">Article ID: {blog._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                <User size={14} className="text-gray-400" /> {blog.author}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Mail size={12} /> {blog.authorEmail}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-sm font-medium text-gray-500">{blog.date}</span>
                                    </td>
                                    <td className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(blog)} className="btn btn-square btn-ghost btn-sm text-blue-500 hover:bg-blue-50">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => {
                                                Swal.fire({
                                                    title: 'Remove Article?',
                                                    text: "This action cannot be undone!",
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#00332c',
                                                    cancelButtonColor: '#ff4d4d',
                                                    confirmButtonText: 'Yes, delete'
                                                }).then(res => res.isConfirmed && deleteMutation.mutate(blog._id))
                                            }} className="btn btn-square btn-ghost btn-sm text-red-500 hover:bg-red-50">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {blogs.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Plus size={40} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-medium">You haven't published any articles yet.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <dialog id="blog_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl rounded-[2.5rem] p-10">
                    <h3 className="font-black text-3xl text-[#00332c] mb-6">{selectedBlog ? 'Refine Your Article' : 'Share Your Insight'}</h3>
                    <form id="blog_form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Cover Image</label>
                            <input name="image" type="file" className="file-input file-input-bordered w-full rounded-xl" required={!selectedBlog} />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Headline</label>
                            <input name="title" defaultValue={selectedBlog?.title} required placeholder="Enter a catchy title..." className="input input-bordered w-full rounded-xl focus:border-[#00332c]" />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Content</label>
                            <textarea name="content" defaultValue={selectedBlog?.content} required placeholder="Write your article content here..." className="textarea textarea-bordered w-full h-44 rounded-xl focus:border-[#00332c]"></textarea>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="btn bg-[#00332c] hover:bg-black text-white w-full rounded-xl h-14 text-lg">
                                {selectedBlog ? 'Save Changes' : 'Publish Article'} <ArrowRight size={20} className="ml-2" />
                            </button>
                        </div>
                    </form>
                    <div className="modal-action">
                        <button onClick={closeModal} className="btn btn-ghost">Discard</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyBlogs;