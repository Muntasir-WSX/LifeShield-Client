import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f3]">
            <div className="relative flex items-center justify-center">
               
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-dashed border-green-500 rounded-full"
                ></motion.div>
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute text-[#00332c] text-4xl"
                >
                    <FaShieldAlt />
                </motion.div>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, yoyo: Infinity }}
                className="mt-6 flex flex-col items-center"
            >
                <h2 className="text-[#00332c] font-black text-xl tracking-widest uppercase">
                    Life Shield
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">
                    Securing your data...
                </p>
            </motion.div>
        </div>
    );
};

export default Loading;