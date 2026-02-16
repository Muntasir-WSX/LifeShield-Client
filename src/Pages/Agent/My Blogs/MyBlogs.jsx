import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Plus, BookOpen, Calendar, Loader2, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from '../../../SharedComponents/Loading/Loading';

const MyBlogs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null); // এডিটের জন্য স্টেট

    // ১. ডাটা ফেচিং
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

    // ২. অ্যাড/আপডেট মিউটেশন
    const blogMutation = useMutation({
        mutationFn: async (blogData) => {
            if (selectedBlog) {
                // আপডেট করার জন্য
                return await axiosSecure.patch(`/blogs/${selectedBlog._id}`, blogData);
            }
            // নতুন অ্যাড করার জন্য
            return await axiosSecure.post('/blogs', blogData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-blogs']);
            showToast(selectedBlog ? "Blog Updated!" : "Blog Published!");
            closeModal();
        }
    });

    // ৩. ডিলিট মিউটেশন
    const deleteMutation = useMutation({
        mutationFn: async (id) => await axiosSecure.delete(`/blogs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-blogs']);
            showToast("Blog removed");
        }
    });

    // ফর্ম হ্যান্ডেলার (Add & Edit দুইটাই কাজ করবে)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const content = form.content.value;
        const imageFile = form.image.files[0];

        let imageUrl = selectedBlog?.image; // আগে থেকে ইমেজ থাকলে সেটা থাকবে

        setUploading(true);
        try {
            // যদি নতুন ইমেজ সিলেক্ট করা হয় তবেই আপলোড হবে
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
                date: selectedBlog ? selectedBlog.date : new Date().toISOString().split('T')[0],
                authorEmail: user?.email,
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

    if (isLoading) return <Loading></Loading>

    return (
        <div className="p-6">
            {uploading && (
                <div className="fixed inset-0 z-9999 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-[#00332c]" size={50} />
                    <p className="font-black">PROCESSING...</p>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm mb-6">
                <h2 className="text-3xl font-black text-[#00332c]">My Blogs</h2>
                <button onClick={() => document.getElementById('blog_modal').showModal()} className="btn bg-[#00332c] text-white rounded-2xl">
                    <Plus /> Write New Post
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <img src={blog.image} className="w-12 h-12 rounded-lg object-cover" />
                                        <span className="font-bold">{blog.title}</span>
                                    </div>
                                </td>
                                <td>{blog.date}</td>
                                <td className="text-right">
                                    <button onClick={() => openEditModal(blog)} className="btn btn-ghost text-blue-500"><Edit size={18}/></button>
                                    <button onClick={() => {
                                        Swal.fire({
                                            title: 'Delete?',
                                            showCancelButton: true,
                                            confirmButtonText: 'Yes'
                                        }).then(res => res.isConfirmed && deleteMutation.mutate(blog._id))
                                    }} className="btn btn-ghost text-red-500"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit */}
            <dialog id="blog_modal" className="modal">
                <div className="modal-box max-w-2xl rounded-4xl">
                    <h3 className="font-black text-2xl mb-4">{selectedBlog ? 'Edit Blog' : 'New Blog'}</h3>
                    <form id="blog_form" onSubmit={handleSubmit} className="space-y-4">
                        <input name="image" type="file" className="file-input w-full" required={!selectedBlog} />
                        <input name="title" defaultValue={selectedBlog?.title} required placeholder="Title" className="input input-bordered w-full" />
                        <textarea name="content" defaultValue={selectedBlog?.content} required placeholder="Content" className="textarea textarea-bordered w-full h-32"></textarea>
                        <button type="submit" className="btn bg-[#00332c] text-white w-full">
                            {selectedBlog ? 'Update' : 'Publish'} <ArrowRight size={18} />
                        </button>
                    </form>
                    <div className="modal-action">
                        <button onClick={closeModal} className="btn">Close</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyBlogs;