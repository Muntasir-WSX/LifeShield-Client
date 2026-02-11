import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Banner = () => {
    const slides = [
        {
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828305/family3_jcxcz2.jpg",
            title: "Secure Your Tomorrow Today",
            sub: "Award Winning Insurance Company",
            description: "Only our company help individuals and businesses manage risks and protect their financial well-being without any extra cost."
        },
        
        {
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828867/family4_rofzlz.jpg",
            title: "Protect Your Family's Happiness",
            sub: "Trusted Life Insurance Provider",
             description: "We provide comprehensive coverage that ensures your loved ones stay financially secure, no matter what the future holds."
        }
        ,
        {
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828308/family2_bku5yt.jpg",
            title: "Protect Your Family's Future",
            sub: "Trusted By Millions",
            description: "We provide modern, transparent life insurance solutions tailored to your unique needs and lifestyle."
        },
        {
            image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828305/Family1_axitsd.jpg", 
            title: "A Legacy of Trust & Safety",
            sub: "Leading Insurance Provider",
            description: "Simple, fast, and reliable insurance management for everyone. Explore our policies and get a quote now."
        }
    ];

    return (
        <div className="w-full h-[500px] md:h-[650px] bg-[#00332c]"> {/* Background color for consistent look with opacity */}
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 4000, 
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={false} 
                modules={[Autoplay, Pagination]}
                className="mySwiper h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full flex items-center overflow-hidden">
                            {/* Background Image with 50% Opacity */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center opacity-50 transition-transform duration-700 hover:scale-105"
                                style={{ 
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>

                            {/* Gradient Overlay for better readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

                            <div className="container mx-auto px-6 md:px-12 relative z-10 text-white">
                                <div className="max-w-2xl space-y-4 md:space-y-6">
                                    {/* Sub title badge */}
                                    <div className="inline-block">
                                        <span className="bg-green-600/20 backdrop-blur-sm px-4 py-2 rounded-full text-xs md:text-sm font-medium border border-green-500/30 text-green-400">
                                            🛡️ {slide.sub}
                                        </span>
                                    </div>
                                    
                                    {/* Main Heading */}
                                    <h1 className="text-4xl md:text-7xl font-bold leading-tight animate-fade-in">
                                        {slide.title}
                                    </h1>
                                    
                                    {/* Description */}
                                    <p className="text-sm md:text-lg text-gray-200 max-w-lg leading-relaxed">
                                        {slide.description}
                                    </p>
                                    
                                    {/* CTA Button */}
                                    <div className="pt-4">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-md font-bold text-sm md:text-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-900/20">
                                            Get a Free Quote
                                            <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Pagination Style */}
            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-pagination-bullet { background: white !important; opacity: 0.5; }
                .swiper-pagination-bullet-active { background: #16a34a !important; opacity: 1; width: 25px; border-radius: 5px; transition: all 0.3s; }
            `}} />
        </div>
    );
};

export default Banner;