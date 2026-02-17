import React, { useEffect, useState } from 'react'; 
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import { FaUserEdit, FaEnvelope, FaClock, FaIdBadge } from 'react-icons/fa';
import Loading from '../../SharedComponents/Loading/Loading';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [isEditing, setIsEditing] = useState(false);
    const [userRole, setUserRole] = useState("Loading..."); 

    useEffect(() => {
        if (user?.email) {
            axiosPublic.get(`/users/role/${user.email}`)
                .then(res => {
                    setUserRole(res.data?.role || "Customer");
                })
                .catch(() => {
                    setUserRole("Customer");
                });
        }
    }, [user?.email, axiosPublic]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photo = form.photo.value;

        try {
            await updateProfile(user, {
                displayName: name,
                photoURL: photo
            });
            const updatedData = { name, photo };
            const res = await axiosPublic.patch(`/users/${user.email}`, updatedData);

            if (res.data.modifiedCount > 0 || res.data.upsertedId) {
                Swal.fire("Success!", "Profile updated successfully", "success");
                setIsEditing(false);
            }
        } catch (error) {
            Swal.fire("Error!", error.message, "error");
        }
    };

    if (loading) return <Loading></Loading>

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
              <Helmet>
                          <title> Manage Your Profile | Life Shield - Secure Your Tomorrow</title>
                          <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
                  </Helmet>
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-[#00332c] h-32 relative">
                    <div className="absolute -bottom-12 left-10">
                        <div className="avatar">
                            <div className="w-24 rounded-2xl ring ring-white ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co.com/8mX1C9T/user.png"} alt="User" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-10">
                        {/* ডায়নামিক রোল ব্যাজ */}
                        <div className={`badge badge-lg gap-2 font-bold p-4 shadow-lg ${
                            userRole === 'Admin' ? 'bg-red-500 border-none' : 
                            userRole === 'Agent' ? 'bg-orange-500 border-none' : 'bg-emerald-500 border-none'
                        } text-white uppercase text-[10px]`}>
                            <FaIdBadge /> {userRole}
                        </div>
                    </div>
                </div>

                {/* Profile Details Section */}
                <div className="pt-16 pb-10 px-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-[#00332c]">{user?.displayName}</h2>
                            <p className="flex items-center gap-2 text-gray-500 mt-1 lowercase italic">
                                <FaEnvelope className="text-sm text-emerald-600"/> {user?.email}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="btn btn-sm bg-[#00332c] text-white hover:bg-black rounded-lg border-none"
                        >
                            <FaUserEdit /> {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-2 tracking-widest">
                                <FaClock className="text-emerald-600" /> Firebase Access
                            </p>
                            <p className="text-sm font-medium text-gray-700">{user?.metadata?.lastSignInTime ? new Date(user?.metadata?.lastSignInTime).toLocaleString() : "Not available"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Account Type</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-sm font-bold text-green-600 uppercase tracking-tighter">Verified {userRole} Account</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                        <form onSubmit={handleUpdate} className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold uppercase text-gray-500">Full Name</label>
                                    <input type="text" name="name" defaultValue={user?.displayName} className="input input-bordered focus:border-[#00332c] focus:outline-none" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold uppercase text-gray-500">Photo URL</label>
                                    <input type="text" name="photo" defaultValue={user?.photoURL} className="input input-bordered focus:border-[#00332c] focus:outline-none" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold uppercase text-gray-500">Email Address</label>
                                    <input type="text" value={user?.email} disabled className="input input-bordered bg-gray-100 cursor-not-allowed opacity-60 text-sm" />
                                </div>
                                <button type="submit" className="btn bg-[#00332c] hover:bg-black text-white w-full mt-4 border-none uppercase tracking-widest">Update Profile</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;