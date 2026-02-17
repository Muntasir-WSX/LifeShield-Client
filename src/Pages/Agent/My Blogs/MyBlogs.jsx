import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Loader2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from '../../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';

const MyBlogs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const { data: blogsData, isLoading } = useQuery({
        queryKey: ['my-blogs', user?.email, currentPage],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-blogs/${user?.email}?page=${currentPage}&size=${itemsPerPage}`);
            return res.data;
        }
    });

    const blogs = blogsData?.result || [];
    const totalCount = blogsData?.count || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const pages = [...Array(totalPages).keys()];

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

    if (isLoading) return <Loading />

    return (
        <div className="p-6">
            <Helmet>
                                      <title> Your Blogs | Life Shield - Secure Your Tomorrow</title>
                                      <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                              </Helmet>
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
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-5 px-8">Article</th>
                            <th>Date</th>
                            <th className="text-right px-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8">
                                    <div className="flex items-center gap-4">
                                        <img src={blog.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                                        <span className="font-bold text-[#00332c]">{blog.title}</span>
                                    </div>
                                </td>
                                <td className="font-medium text-gray-500">{blog.date}</td>
                                <td className="text-right px-8 space-x-2">
                                    <button onClick={() => openEditModal(blog)} className="btn btn-square btn-ghost text-blue-500 hover:bg-blue-50 transition-all"><Edit size={18}/></button>
                                    <button onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure?',
                                            text: "You won't be able to revert this!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#EF4444',
                                            confirmButtonText: 'Yes, delete it!'
                                        }).then(res => res.isConfirmed && deleteMutation.mutate(blog._id))
                                    }} className="btn btn-square btn-ghost text-red-500 hover:bg-red-50 transition-all"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Empty State */}
                {blogs.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-medium text-lg">
                        No blogs found. Start writing today!
                    </div>
                )}
            </div>

            {/* --- PAGINATION CONTROLS (All Policies Style) --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-lg shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Page Numbers */}
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`btn btn-sm border-none transition-all h-10 px-4 rounded-lg shadow-sm ${
                                currentPage === page
                                    ? "bg-[#00332c] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {page + 1}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="btn btn-sm bg-white border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 h-10 w-10 p-0 rounded-lg shadow-sm"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Modal for Add/Edit */}
            <dialog id="blog_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl rounded-4xl p-8 shadow-2xl">
                    <h3 className="font-black text-2xl mb-6 text-[#00332c]">{selectedBlog ? 'Edit Blog' : 'New Blog'}</h3>
                    <form id="blog_form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase ml-1">Cover Image</p>
                            <input name="image" type="file" className="file-input file-input-bordered w-full rounded-xl" required={!selectedBlog} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase ml-1">Blog Title</p>
                            <input name="title" defaultValue={selectedBlog?.title} required placeholder="Enter an engaging title" className="input input-bordered w-full rounded-xl" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase ml-1">Content</p>
                            <textarea name="content" defaultValue={selectedBlog?.content} required placeholder="Write your thoughts here..." className="textarea textarea-bordered w-full h-48 rounded-xl"></textarea>
                        </div>
                        <button type="submit" className="btn bg-[#00332c] hover:bg-black text-white w-full rounded-xl border-none h-12">
                            {selectedBlog ? 'Update Blog' : 'Publish Post'} <ArrowRight size={18} className="ml-2" />
                        </button>
                    </form>
                    <div className="modal-action">
                        <button onClick={closeModal} className="btn btn-ghost rounded-xl">Cancel</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyBlogs;