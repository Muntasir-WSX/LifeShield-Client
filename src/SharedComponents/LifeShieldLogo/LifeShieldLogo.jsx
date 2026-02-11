import React from 'react';
import { Link } from 'react-router-dom';

const LifeShieldLogo = () => {
    return (
        <Link to="/" className="flex items-center gap-1 group">
            <div className="relative">
                <img 
                    src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1770814585/Plus_Logo_yh01ln.png" 
                    alt="Life Shield Logo Icon" 
                    className="w-5 h-5 ml-2"
                />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-[#00332c]">
                    Life <span className="text-green-600">Shield</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[2px] text-gray-500 mt-1 leading-none">
                    Secure Your Tomorrow
                </p>
            </div>
        </Link>
    );
};

export default LifeShieldLogo;