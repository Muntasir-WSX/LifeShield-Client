import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock } from 'lucide-react';

const CheckoutForm = ({ amount, appId }) => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [applicationData, setApplicationData] = useState(null); 
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppData = async () => {
            try {
                const res = await axiosSecure.get(`/application/${appId}`); 
                setApplicationData(res.data);
            } catch (err) {
                console.error("Fetch App Error:", err);
            };
        };
        if (appId) fetchAppData();
    }, [appId, axiosSecure]);

    useEffect(() => {
        if (amount > 0) {
            axiosSecure.post('/create-payment-intent', { price: parseFloat(amount) })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Stripe Secret Error:", err));
        }
    }, [axiosSecure, amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret || processing) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        setProcessing(true);
        setError('');

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                },
            },
        });

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
        } else {
            if (paymentIntent.status === "succeeded") {
                const paymentInfo = {
                    transactionId: paymentIntent.id,
                    email: user?.email,
                    amount: amount,
                    appId: appId,
                    date: new Date(),
                    status: 'Awaiting Approval', // আপনার আগের লজিক অনুযায়ী
                    paymentStatus: 'Paid', 
                    agentEmail: applicationData?.agentEmail || '', 
                    agentName: applicationData?.agentName || '',
                    policyId: applicationData?.policyId || '' 
                };
                
                try {
                    const res = await axiosSecure.patch(`/applications/payment/${appId}`, paymentInfo);
                    if (res.data.modifiedCount > 0) {
                        navigate('/dashboard/my-policies');
                    }
                } catch (err) {
                    setError("Payment successful, but failed to update database.");
                } finally {
                    setProcessing(false);
                }
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto font-urbanist">
            <div className="bg-[#00332c] rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
                
                {/* --- Header & Amount Area --- */}
                <div className="p-8 pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Lock size={12}/> Secure Payment
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest opacity-60">Amount to Pay</p>
                        <h2 className="text-white text-5xl font-black">৳{amount.toLocaleString('en-BD')}</h2>
                    </div>
                </div>

                {/* --- Form Section --- */}
                <div className="bg-white m-2 rounded-[32px] p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[#00332c] text-[10px] font-black uppercase mb-3 tracking-widest opacity-50">
                                Card Credentials
                            </label>
                            <div className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus-within:border-[#00332c]/20 focus-within:bg-white transition-all duration-300">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#00332c',
                                                fontFamily: 'Inter, sans-serif',
                                                '::placeholder': { color: '#94a3b8' },
                                            },
                                            invalid: { color: '#ef4444' },
                                        },
                                        hidePostalCode: true,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={!stripe || !clientSecret || processing}
                                className="w-full bg-[#00332c] text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 overflow-hidden"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loading size="sm" /> <span>Verifying...</span>
                                    </div>
                                ) : (
                                    <span>Confirm Payment</span>
                                )}
                            </button>
                            
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border-l-4 border-red-500 animate-shake">
                                    <AlertCircle size={16} />
                                    <p className="text-[10px] font-bold uppercase tracking-tight">{error}</p>
                                </div>
                            )}
                        </div>
                    </form>
                    
                    {/* --- Trust Badges --- */}
                    <div className="mt-8 flex justify-center gap-6 opacity-20 grayscale pointer-events-none">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="stripe" />
                    </div>
                </div>
            </div>
            
            <p className="text-center mt-6 text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">
                256-bit SSL Encrypted Connection
            </p>
        </div>
    );
};

export default CheckoutForm;