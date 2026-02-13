import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaUserEdit, FaChevronLeft, FaEye, FaAward } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import Loading from "../../../SharedComponents/Loading/Loading";

const ArticleDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/blog/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (!blog) return <div className="text-center py-20">Blog not found!</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 font-bold transition-all hover:-translate-x-2"
        >
          <FaChevronLeft /> Back to Articles
        </Link>

        <article className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Main Image Section */}
          <div className="relative h-[300px] md:h-[500px]">
            <img
              src={blog?.image}
              className="w-full h-full object-cover"
              alt={blog?.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 md:left-16 right-8">
               <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500 text-[#00332c] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <FaAward /> Featured Insight
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                    <FaEye /> {blog?.total_visit || 0} Visits
                  </span>
               </div>
            </div>
          </div>

          <div className="p-8 md:p-16">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                  {blog?.author?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-black tracking-tighter">Written by</p>
                  <p className="text-[#00332c] font-bold text-lg flex items-center gap-2">
                    {blog?.author} <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">Verified Expert</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-black tracking-tighter">Published on</p>
                <p className="text-gray-600 font-bold flex items-center justify-end gap-2">
                  <FaCalendarAlt className="text-green-500" /> 
                  {new Date(blog?.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black text-[#00332c] leading-[1.1] mb-8">
                {blog?.title}
              </h1>

              <div className="prose prose-lg max-w-none">
                {/* Summary Box */}
                <div className="bg-green-50/50 rounded-3xl p-8 mb-10 border-l-8 border-green-500">
                  <p className="text-xl text-[#00332c]/80 leading-relaxed font-semibold italic">
                    "{blog?.summary}"
                  </p>
                </div>

                {/* Main Content */}
                <div className="text-gray-700 leading-[1.8] text-lg whitespace-pre-line space-y-6">
                  {blog?.content}
                </div>
              </div>

              {/* Tags Section (If exists in your JSON) */}
              {blog?.tags && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-3">
                   {blog.tags.map((tag, idx) => (
                     <span key={idx} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer">
                       #{tag}
                     </span>
                   ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetails;