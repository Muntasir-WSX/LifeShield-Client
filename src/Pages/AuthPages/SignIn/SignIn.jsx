import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import LifeShieldLogo from "../../../SharedComponents/LifeShieldLogo/LifeShieldLogo";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const { signIn, googleSignIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";
  const handleAuthLogic = async (email) => {
    try {
      const res = await axiosPublic.post("/jwt", { email });
      if (res.data.token) {
        localStorage.setItem("access-token", res.data.token);
        
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("JWT Error:", err);
      toast.error("Session failed!");
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    signIn(data.email.trim(), data.password)
      .then((result) => {
        toast.success("Welcome Back!");
        handleAuthLogic(result.user.email);
      })
      .catch((error) => {
        setLoading(false);
        
        if (error.code === 'auth/invalid-credential') {
          toast.error("Invalid email or password.");
        } else {
          toast.error("Login failed. Check credentials.");
        }
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        const userInfo = {
          name: result.user?.displayName,
          email: result.user?.email,
          image: result.user?.photoURL,
          role: "customer",
          createdAt: new Date().toISOString(),
        };

        axiosPublic.post("/users", userInfo).then(() => {
          toast.success("Google Login Successful");
          handleAuthLogic(result.user.email);
        });
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f3] p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh] border border-gray-100"
      >
        {/* Left Side: Logo & Message */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="mb-8 p-6 border-[3px] border-[#00332c] rounded-3xl bg-white shadow-sm flex items-center justify-center">
            <LifeShieldLogo />
          </motion.div>
          <h2 className="text-4xl font-black text-[#00332c] mb-4">Welcome Back!</h2>
          <p className="text-gray-500 max-w-sm">Login to access your personalized insurance dashboard and manage your policies securely.</p>
        </div>

        {/* Right Side: Form */}
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
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-500 text-[#00332c] font-black py-4 rounded-2xl hover:bg-green-400 transition-all uppercase tracking-wider disabled:bg-gray-600"
            >
              {loading ? "Signing In..." : "Login"}
            </motion.button>
          </form>

          <div className="relative my-10 text-center">
            <hr className="border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00332c] px-4 text-xs font-bold text-gray-400 uppercase">OR</span>
          </div>

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
            <Link to="/register" className="text-green-400 font-bold ml-2 hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;