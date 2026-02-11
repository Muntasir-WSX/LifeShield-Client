import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCalendarAlt, FaUserEdit, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../../Hooks/UseAxiosPublic';

const ArticleDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();

    const { data: blog = {}, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/blog/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Article...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 font-semibold transition-colors">
                    <FaChevronLeft /> Back to Home
                </Link>

                <article className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100">
                    <img src={blog.image} className="w-full h-[450px] object-cover" alt="" />
                    
                    <div className="p-8 md:p-16">
                        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FaUserEdit className="text-green-600" /> By {blog.author}</span>
                            <span className="flex items-center gap-2"><FaCalendarAlt className="text-green-600" /> {new Date(blog.date).toLocaleDateString()}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-[#00332c] leading-tight mb-8">
                            {blog.title}
                        </h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-xl text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-green-500 pl-6 italic">
                                {blog.summary}
                            </p>
                            <div className="text-gray-700 leading-loose text-lg whitespace-pre-line">
                                {blog.content}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ArticleDetails;