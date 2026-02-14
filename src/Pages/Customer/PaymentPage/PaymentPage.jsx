import React from 'react';
import { useLocation } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
    const location = useLocation();
    const appId = location.state?.appId; // আগের পেজ থেকে আসা ID

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-black text-[#00332c] mb-2">Complete Your Payment</h2>
                <p className="text-gray-500 mb-8">Secure your future with LifeShield Protection Plan</p>

                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-dashed border-gray-300">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">Application ID:</span>
                        <span className="font-mono font-bold text-[#00332c]">{appId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black text-[#00332c]">
                        <span>Total Premium:</span>
                        <span>৳ 1200.00</span>
                    </div>
                </div>

                {/* Stripe Elements এখানে বসবে */}
                <div className="p-8 border-2 border-green-500/20 rounded-3xl bg-green-50/30">
                    <div className="flex items-center gap-3 mb-6 justify-center text-green-700 font-bold">
                        <CreditCard size={20} />
                        <span>Stripe Secure Payment</span>
                    </div>
                    
                    {/* Placeholder for Stripe Checkout Form */}
                    <button className="btn btn-block bg-green-600 text-white hover:bg-green-700 h-14 rounded-xl shadow-lg shadow-green-200">
                        Pay Now
                    </button>
                </div>

                <p className="mt-6 text-xs text-gray-400 italic">
                    By clicking "Pay Now", you agree to our terms and conditions.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;