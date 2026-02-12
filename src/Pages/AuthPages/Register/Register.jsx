import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import LifeShieldLogo from "../../../SharedComponents/LifeShieldLogo/LifeShieldLogo";

const Register = () => {
  const { createUser, updateUserProfile, googleSignIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const onSubmit = (data) => {
    const { name, email, password } = data;
    const imageFile = data.photo[0];

    if (!/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must have at least 6 characters, one uppercase, and one lowercase letter.",
        confirmButtonColor: "#00332c",
      });
    }

    createUser(email, password)
      .then((result) => {
        updateUserProfile(name, photo).then(() => {
          const userInfo = {
            name,
            email,
            image: photo,
            role: "customer",
          };

          axiosPublic.post("/users", userInfo).then((res) => {
            if (res.data.insertedId) {
              reset();
              Swal.fire({
                title: "Account Created!",
                text: "Welcome to Life Shield",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              navigate("/");
            }
          });
        });
      })
      .catch((error) => Swal.fire("Error", error.message, "error"));
  };

  const handleGoogleSignUp = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        const userInfo = {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
          role: "customer",
        };

        axiosPublic.post("/users", userInfo).then(() => {
          Swal.fire({
            title: "Success!",
            text: "Signed up successfully with Google",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/");
        });
      })
      .catch((error) => Swal.fire("Error", error.message, "error"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f3] p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh] border border-gray-100"
      >
        {/* Left Side: White background with Logo (Same as SignIn) */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-8 p-6 border-[3px] border-[#00332c] rounded-3xl bg-white shadow-sm flex items-center justify-center"
          >
            <LifeShieldLogo />
          </motion.div>
          <h2 className="text-4xl font-black text-[#00332c] mb-4">Join Us!</h2>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            Create an account today to secure your future and manage your life
            insurance policies with ease.
          </p>
        </div>

        {/* Right Side: Deep Green background with Form */}
        <div className="md:w-1/2 bg-[#00332c] p-10 md:p-12 flex flex-col justify-center text-white">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Register</h3>
            <div className="h-1 w-16 bg-green-500 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Photo Upload Field */}
            <div className="relative">
              <label className="block text-xs text-green-400 mb-1 ml-2 uppercase font-bold tracking-widest">
                Upload Profile Photo
              </label>
              <div className="relative">
                <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 z-10" />
                <input
                  {...register("photo", { required: true })}
                  type="file"
                  accept="image/*"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-[#00332c] hover:file:bg-green-400 cursor-pointer"
                />
              </div>
              {errors.photo && (
                <span className="text-red-400 text-xs mt-1 ml-2">
                  Photo is required
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 focus:border-green-400 focus:bg-white/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-[#00332c] font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-wider"
            >
              Register Now
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <hr className="border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00332c] px-4 text-xs font-bold text-gray-400 uppercase">
              OR
            </span>
          </div>

          {/* Google SignUp */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignUp}
            className="w-full bg-white text-[#00332c] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-md"
          >
            <FcGoogle size={24} /> Sign up with Google
          </motion.button>

          <p className="mt-6 text-center text-gray-300">
            Already have an account?
            <Link
              to="/signIn"
              className="text-green-400 font-bold ml-2 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
