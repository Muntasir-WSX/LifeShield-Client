import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
    const location = useLocation();
    const { id } = useParams(); 
    
    const appId = location.state?.appId; 
    const amount = location.state?.payableAmount || 0;

    return (
        <div className="max-w-2xl mx-auto py-6 md:py-10 px-4">
            <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl md:shadow-2xl border border-gray-100 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <ShieldCheck size={32} className="md:w-10 md:h-10" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#00332c] mb-2">Complete Your Payment</h2>
                <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">Secure your future with LifeShield Protection</p>
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 border border-dashed border-gray-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm mb-3 md:mb-2 gap-1 md:gap-0">
                        <span className="text-gray-500 font-medium">Application ID:</span>
                        <span className="font-mono font-bold text-[#00332c] break-all text-left md:text-right">
                            {appId || id || 'N/A'}
                        </span>
                    </div>
                    
                    <div className="h-px bg-gray-200 my-3 md:hidden"></div> 

                    <div className="flex justify-between items-center text-lg md:text-xl font-black text-[#00332c]">
                        <span>Total Premium:</span>
                        <span className="text-green-600">৳ {amount.toLocaleString('en-BD')}</span>
                    </div>
                </div>

                {/* Stripe Elements Provider */}
                <div className="p-4 md:p-6 border-2 border-green-500/20 rounded-3xl md:rounded-3xl bg-green-50/10">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm amount={amount}  appId={id} />
                    </Elements>
                </div>
                
                <p className="mt-6 text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-bold">
                     Secure 256-bit SSL Encrypted Payment
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;