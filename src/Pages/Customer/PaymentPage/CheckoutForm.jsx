import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../../SharedComponents/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ amount, appId }) => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (amount > 0) {
            axiosSecure.post('/create-payment-intent', { price: parseFloat(amount) })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
        }
    }, [axiosSecure, amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        setProcessing(true);

        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (paymentMethodError) {
            setError(paymentMethodError.message);
            setProcessing(false);
            return;
        } else {
            setError('');
        }

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
                    status: 'Paid'
                }
                
                const res = await axiosSecure.patch(`/applications/payment/${appId}`, paymentInfo);
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: "Success!",
                        text: `Transaction ID: ${paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: "#00332c"
                    }).then(() => {
                        navigate('/dashboard/my-policies');
                    });
                }
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4 md:space-y-6">
            {/* Card Input Container */}
            <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-200 focus-within:border-[#00332c] transition-all duration-300">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px', 
                                color: '#00332c',
                                fontSmoothing: 'antialiased',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#ef4444' },
                        },
                    }}
                />
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs md:text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className={`w-full h-12 md:h-14 rounded-xl md:rounded-2xl text-white text-base md:text-lg font-black transition-all duration-300 active:scale-95 shadow-sm ${
                    processing ? 'bg-gray-400' : 'bg-[#00332c] hover:bg-black'
                }`}
            >
                {processing ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loading /> <span>Processing...</span>
                    </div>
                ) : (
                    `Pay ৳${amount.toLocaleString('en-BD')}`
                )}
            </button>

            {/* Secure Badge - Optional but good for UI */}
            <p className="text-[10px] md:text-xs text-gray-400 text-center font-medium uppercase tracking-widest mt-4">
                🔒 Secure SSL Encrypted Payment
            </p>
        </form>
    );
};

export default CheckoutForm;