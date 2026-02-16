import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import useAxiosPublic from '../../../Hooks/UseAxiosPublic';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import Loading from '../../../SharedComponents/Loading/Loading';

const Testimonials = () => {
    const axiosPublic = useAxiosPublic();

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const res = await axiosPublic.get('/reviews'); 
            return res.data;
        }
    });

    if (isLoading) return <Loading></Loading>

    return (
        <section className="py-24 bg-[#fcfdfd]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-green-600 uppercase tracking-[0.3em] mb-4">Testimonials</h2>
                    <h3 className="text-4xl font-black text-[#00332c]">What Our Clients Say</h3>
                    <div className="h-1 w-16 bg-green-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                  
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 }, 
                    }}
                    className="pb-16"
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                {/* Quote Icon */}
                                <FaQuoteLeft className="text-green-100 text-3xl mb-4" />
                                
                                {/* Message */}
                                <p className="text-gray-600 text-sm italic mb-6 grow leading-relaxed">
                                    "{review.message}"
                                </p>

                                {/* User Info */}
                                <div className="flex items-center gap-3 border-t pt-4 border-gray-50">
                                    <img 
                                        src={review.image} 
                                        alt={review.name} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-green-500 p-0.5"
                                    />
                                    <div>
                                        <h4 className="font-bold text-[#00332c] text-sm">{review.name}</h4>
                                        <div className="flex text-yellow-400 text-xs mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-pagination-bullet-active {
                    background: #16a34a !important;
                }
            `}} />
        </section>
    );
};

export default Testimonials;