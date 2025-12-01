'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { paymentAPI } from '@/lib/api';
import PaymentReceipt from '@/components/PaymentReceipt';

export default function PaymentStatusPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const txnId = searchParams.get('txnId');
    
    const [status, setStatus] = useState('checking');
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);

    

    const checkPaymentStatus = async () => {
        try {
            const response = await paymentAPI.checkStatus(txnId);
            
            if (response.data.data.paymentStatus === 'COMPLETED') {
                setStatus('success');
                setPaymentData(response.data.data);
                
                // Auto-show receipt after 1 second
                setTimeout(() => {
                    setShowReceipt(true);
                }, 1000);
            } else if (response.data.data.paymentStatus === 'FAILED') {
                setStatus('failed');
            } else {
                setStatus('pending');
                // Retry after 3 seconds
                setTimeout(checkPaymentStatus, 3000);
            }
        } catch (error) {
            setStatus('error');
            setError(error.response?.data?.error || 'Failed to check payment status');
        }
    };
    useEffect(() => {
        if (txnId) {
            checkPaymentStatus();
        }
    }, [txnId]);
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    {status === 'checking' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Verifying Payment
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we confirm your transaction...
                            </p>
                        </div>
                    )}

                    {status === 'pending' && (
                        <div className="text-center">
                            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Payment Pending
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Your payment is being processed. This may take a few moments.
                            </p>
                            <div className="animate-pulse text-sm text-gray-500">
                                Checking status...
                            </div>
                        </div>
                    )}

                    {status === 'success' && !showReceipt && (
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your transaction has been completed successfully.
                            </p>
                            <div className="animate-pulse text-sm text-gray-500">
                                Generating receipt...
                            </div>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="text-center">
                            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your payment could not be processed. Please try again.
                            </p>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-12 h-12 text-orange-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Something Went Wrong
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {error || 'Unable to verify payment status.'}
                            </p>
                            
                            <button
                                onClick={() => router.push('/my-library')}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
                            >
                                Check My Library
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Receipt Modal */}
            {showReceipt && paymentData && (
                <PaymentReceipt
                    purchase={paymentData}
                    onClose={() => {
                        setShowReceipt(false);
                        router.push('/my-library');
                    }}
                />
            )}
        </>
    );
}