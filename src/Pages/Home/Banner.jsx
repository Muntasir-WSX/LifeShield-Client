import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const slides = [
    {
        id: 1,
        title: "Secure Your Tomorrow Today",
        tagline: "Life Shield offers flexible insurance plans that grow with you and your family's dreams.",
        image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828305/family3_jcxcz2.jpg",
    },
    {
        id: 2,
        title: "Protect What Matters Most",
        tagline: "Experience peace of mind with 24/7 support and the fastest claim processing in the industry.",
        image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828867/family4_rofzlz.jpg",
    },
    {
        id: 3,
        title: "Investment for Your Lifetime",
        tagline: "Smart savings coupled with comprehensive protection. Join thousands of happy families.",
        image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828308/family2_bku5yt.jpg",
    },

    {
    id: 4,
    title: "Health is Your Greatest Wealth",
    tagline: "Ensure world-class medical protection for you and your loved ones with our premium health covers.",
    image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1770828305/Family1_axitsd.jpg",
}
];

const Banner = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000); 
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#00332c]">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    {/* Background with Zoom-in Animation */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    >
                        {/* Gradient Overlay for better readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="relative h-full flex items-center px-6 md:px-20 lg:px-32 max-w-7xl mx-auto">
                        <div className="max-w-3xl text-white">
                            <motion.h1 
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]"
                            >
                                {slides[current].title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-lg md:text-2xl mb-10 text-gray-300 font-light max-w-xl"
                            >
                                {slides[current].tagline}
                            </motion.p>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                {/* Main Redirect Button */}
                                <Link to="/quote">
                                    <button className="group relative bg-[#00332C] hover:bg-green-600 text-white px-8 md:px-10 py-4 rounded-full text-lg font-black uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3">
                                        Get a Free Quote
                                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default Banner;