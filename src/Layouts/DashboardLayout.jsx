import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CreditCard, FileText, Home, ShieldCheck, UserCircle, Menu, X, LayoutDashboard } from 'lucide-react';
import LifeShieldLogo from '../SharedComponents/LifeShieldLogo/LifeShieldLogo';

const DashboardLayout = () => {

    const closeDrawer = () => {
        const drawerCheckbox = document.getElementById('dashboard-drawer');
        if (drawerCheckbox) drawerCheckbox.checked = false;
    };

    const sideLinks = (
        <ul className="space-y-2 mt-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 ml-2">Main Menu</p>
            <li>
                <NavLink 
                    to="/dashboard/my-policies" 
                    onClick={closeDrawer}
                    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <ShieldCheck size={18} />
                    <span className="font-medium">My Policies</span>
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/dashboard/payment-status" 
                    onClick={closeDrawer}
                    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <CreditCard size={18} />
                    <span className="font-medium">Payment Status</span>
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/dashboard/claim-request" 
                    onClick={closeDrawer}
                    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <FileText size={18} />
                    <span className="font-medium">Claim Request</span>
                </NavLink>
            </li>
            
            <div className="pt-8 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-2">Settings</p>
            </div>
            
            <li>
                <NavLink to="/profile" onClick={closeDrawer} className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <UserCircle size={18} />
                    <span className="font-medium">Profile Setting</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/" onClick={closeDrawer} className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                    <Home size={18} />
                    <span className="font-medium">Back to Home</span>
                </NavLink>
            </li>
        </ul>
    );

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-[#f3f4f6]">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                {/* --- Mobile Header --- */}
                <div className="w-full flex items-center justify-between lg:hidden bg-white p-4 sticky top-0 z-40 border-b shadow-sm">
                    <div className="scale-75 origin-left">
                         <LifeShieldLogo />
                    </div>
                    <label htmlFor="dashboard-drawer" className="p-2 text-[#00332c] hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border">
                        <Menu size={24} />
                    </label>
                </div>

                {/* --- Main Dashboard Content --- */}
                <main className="flex-1 p-4 md:p-8 lg:p-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header Area */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-[#00332c] flex items-center gap-2">
                                    <LayoutDashboard className="text-green-500" /> Customer Panel
                                </h2>
                                <p className="text-gray-500 mt-1">Manage your life insurance assets & requests</p>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-2xl border flex items-center gap-3 shadow-sm self-start">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-[#00332c]">System Active</span>
                            </div>
                        </div>
                        
                        {/* Render Pages */}
                        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[70vh]">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div> 

            <div className="drawer-side z-[50]">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
                <div className="min-h-full w-72 bg-[#00332c] text-white flex flex-col overflow-hidden relative">
                    {/* Background Subtle Gradient */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

                    {/* Logo Section - Glassmorphism Card */}
                    <div className="p-6 relative">
                        <div className="bg-white p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-white/20">
                            <LifeShieldLogo />
                        </div>
                        
                        <label htmlFor="dashboard-drawer" className="lg:hidden absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full cursor-pointer text-white">
                            <X size={18} />
                        </label>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 relative">
                        {sideLinks}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;