import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion"; 
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import LifeShieldLogo from "../../../SharedComponents/LifeShieldLogo/LifeShieldLogo";

const SignIn = () => {
  const { signIn, googleSignIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(() => {
        Swal.fire({
          title: "Welcome Back!",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        navigate(from, { replace: true });
      })
      .catch(() => {
        Swal.fire({ title: "Error!", text: "Login Failed", icon: "error" });
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        const userInfo = {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        };

        axiosPublic.post("/users", userInfo).then((res) => {
          Swal.fire({
            title: "Success!",
            text: "Google Login Successful",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          navigate(from, { replace: true });
        });
      })
      .catch((error) => {
        Swal.fire({ title: "Error!", text: error.message, icon: "error" });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f3] p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh] border border-gray-100"
      >
        
      {/* Left Side: White background with Logo */}
<div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center text-center">
    <motion.div 
        whileHover={{ scale: 1.05 }}
        className="mb-8 p-6 border-[3px] border-[#00332c] rounded-3xl bg-white shadow-sm flex items-center justify-center"
    >
        <LifeShieldLogo />
    </motion.div>

    <h2 className="text-4xl font-black text-[#00332c] mb-4">
        Welcome Back!
    </h2>
    
    <p className="text-gray-500 max-w-sm">
        Login to access your personalized insurance dashboard and manage your policies securely.
    </p>
</div>

        {/* Right Side: Deep Green background with Form */}
        <div className="md:w-1/2 bg-[#00332c] p-10 md:p-16 flex flex-col justify-center text-white">
          <div className="mb-10">
            <h3 className="text-3xl font-bold mb-2">Sign In</h3>
            <div className="h-1 w-16 bg-green-500 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", { required: true })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all placeholder:text-gray-400 text-white"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all placeholder:text-gray-400 text-white"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all"
            >
              Login
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-10 text-center">
            <hr className="border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00332c] px-4 text-xs font-bold text-gray-400 uppercase">
              OR
            </span>
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-[#00332c] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-md"
          >
            <FcGoogle size={24} /> Continue with Google
          </motion.button>

          <p className="mt-8 text-center text-gray-300">
            Don't have an account? 
            <Link to="/register" className="text-green-400 font-bold ml-2 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;