import React from 'react';

import Swal from 'sweetalert2';
import useAxiosPublic from '../../../Hooks/UseAxiosPublic';
import { FaPaperPlane } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const Newsletter = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        try {
            const res = await axiosPublic.post('/newsletter', data);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Subscribed!',
                    text: 'Thank you for subscribing to our newsletter.',
                    showConfirmButton: false,
                    timer: 1500
                });
                reset(); 
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again.',
            });
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-[#00332c] rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Stay Updated with <span className="text-green-500">Life Shield</span>
                        </h2>
                        <p className="text-gray-300 mb-10 text-lg">
                            Subscribe to our newsletter and receive the latest insurance tips, news, and exclusive offers directly in your inbox.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                {...register("name", { required: true })}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all"
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                {...register("email", { required: true })}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                            >
                                Subscribe <FaPaperPlane size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;