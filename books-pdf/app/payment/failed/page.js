'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

function PaymentFailedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'Payment failed';
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Failed
                </h1>
                
                <p className="text-gray-600 mb-2">
                    {reason}
                </p>

                {orderId && (
                    <p className="text-xs text-gray-400 font-mono mb-6">
                        Order ID: {orderId}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentFailed() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-center">
                    <div className="text-5xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <PaymentFailedContent />
        </Suspense>
    );
}