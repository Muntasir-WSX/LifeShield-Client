import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaUser } from 'react-icons/fa';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Loading from '../../SharedComponents/Loading/Loading';

const Blogs = () => {
    const axiosPublic = useAxiosPublic();

    const { data: allBlogs = [], isLoading } = useQuery({
        queryKey: ["allBlogs"],
        queryFn: async () => {
            const res = await axiosPublic.get("/all-blogs"); 
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <Loading></Loading>
        );
    }

    return (
        <section className="py-20 bg-[#f8fafc] min-h-screen">
            <div className="container mx-auto px-4">
                {/* Title */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-[#00332c] mb-4">
                        Journal & <span className="text-green-600">Articles</span>
                    </h2>
                    <p className="text-gray-500 text-lg">Total {allBlogs.length} insights found for your protection.</p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {allBlogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col group">
                            {/* Image Section */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#00332c] flex items-center gap-2">
                                    <FaCalendarAlt className="text-green-600" />
                                    {new Date(blog.date).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest mb-3">
                                    <FaUser size={10} /> {blog.author || "Expert Agent"}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-[#00332c] mb-4 leading-tight group-hover:text-green-600 transition-colors">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-gray-500 line-clamp-3 mb-6 flex-grow">
                                    {blog.summary}
                                </p>

                                <div className="pt-6 border-t border-gray-50">
                                    <Link 
                                        to={`/blog-details/${blog._id}`}
                                        className="flex items-center justify-between font-bold text-[#00332c] group/btn"
                                    >
                                        <span className="group-hover/btn:mr-2 transition-all">Read Full Story</span>
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover/btn:bg-green-600 group-hover/btn:text-white transition-all">
                                            <FaArrowRight />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;