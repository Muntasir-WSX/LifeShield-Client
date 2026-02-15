import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import Mastercard from "../../../assets/mastercard.png";
import stripeImage from "../../../assets/stripe.png";
import visa from "../../../assets/visa.jpg";

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

    // Stripe Client Secret তৈরি
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
        if (!stripe || !elements || !clientSecret) return;

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
                    status: 'Pending', 
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
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Card Details</label>
                <div className="p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-[#00332c] focus-within:bg-white transition-all duration-300 shadow-inner min-h-[60px]">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '17px', 
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
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                     {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className={`w-full h-14 rounded-2xl text-white text-lg font-black transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-3 ${
                    processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00332c] hover:bg-black'
                }`}
            >
                {processing ? (
                    <div className="flex items-center gap-2 text-white">
                         <Loading /> <span>Processing Payment...</span>
                    </div>
                ) : (
                    <>
                        <span>Authorize Payment</span>
                        <span className="opacity-40">|</span>
                        <span>৳{amount.toLocaleString('en-BD')}</span>
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
                <img src={Mastercard} className="h-6 opacity-40" alt="Mastercard" />
                <img src={visa} className="h-6 opacity-40" alt="Visa" />
                <img src={stripeImage} className="h-6 opacity-40" alt="Stripe" />
            </div>
        </form>
    );
};

export default CheckoutForm;