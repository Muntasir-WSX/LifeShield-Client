import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import { FaUserEdit, FaEnvelope, FaClock, FaIdBadge } from 'react-icons/fa';

const Profile = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [isEditing, setIsEditing] = useState(false);

    const userRole = "Customer"; // it will be dynamic

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

    if (loading) return <div className="text-center py-20">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section with Badge */}
                <div className="bg-[#00332c] h-32 relative">
                    <div className="absolute -bottom-12 left-10">
                        <div className="avatar">
                            <div className="w-24 rounded-2xl ring ring-white ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co.com/8mX1C9T/user.png"} alt="User" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-10">
                        {/* Dynamic Role Badge */}
                        <div className={`badge badge-lg gap-2 font-bold p-4 ${
                            userRole === 'Admin' ? 'badge-error' : 
                            userRole === 'Agent' ? 'badge-warning' : 'badge-success'
                        } text-white`}>
                            <FaIdBadge /> {userRole}
                        </div>
                    </div>
                </div>

                {/* Profile Details Section */}
                <div className="pt-16 pb-10 px-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-[#00332c]">{user?.displayName}</h2>
                            <p className="flex items-center gap-2 text-gray-500 mt-1"><FaEnvelope className="text-sm"/> {user?.email}</p>
                        </div>
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="btn btn-sm btn-outline btn-success rounded-lg"
                        >
                            <FaUserEdit /> {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
                                <FaClock /> Last Login (Firebase)
                            </p>
                            <p className="text-sm font-medium text-gray-700">{user?.metadata?.lastSignInTime || "Not available"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Account Status</p>
                            <span className="badge badge-success badge-xs"></span> <span className="text-sm font-bold text-green-600">Verified User</span>
                        </div>
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                        <form onSubmit={handleUpdate} className="bg-green-50/50 p-6 rounded-2xl border border-green-100 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label text-sm font-bold">Full Name</label>
                                    <input type="text" name="name" defaultValue={user?.displayName} className="input input-bordered focus:outline-green-500" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-sm font-bold">Photo URL</label>
                                    <input type="text" name="photo" defaultValue={user?.photoURL} className="input input-bordered focus:outline-green-500" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-sm font-bold">Email (Non-editable)</label>
                                    <input type="text" value={user?.email} disabled className="input input-bordered bg-gray-200 cursor-not-allowed" />
                                </div>
                                <button type="submit" className="btn btn-success text-white w-full mt-4">Save Changes</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;