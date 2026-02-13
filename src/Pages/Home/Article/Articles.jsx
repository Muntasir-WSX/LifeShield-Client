import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ArticleCard from "./ArticleCard";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import Loading from "../../../SharedComponents/Loading/Loading";

const Articles = () => {
  const axiosPublic = useAxiosPublic();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/all-blogs");
      return res.data;
    },
  });

  if (isLoading)
    return <Loading></Loading>

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#00332c]">
              Health & Life Insights
            </h2>
            <p className="text-gray-500 mt-2">
              Expert advice and latest news for your security
            </p>
          </div>
          <Link
            to="/blogs"
            className="hidden md:flex items-center gap-2 text-green-600 font-bold hover:gap-4 transition-all"
          >
            Explore All Blogs <FaArrowRight />
          </Link>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          
          autoplay={{ delay: 3000, disableOnInteraction: false }} 
          className="pb-20 article-swiper"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <div className="h-full py-2">
                <ArticleCard blog={blog} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Articles;