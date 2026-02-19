'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Redirect to library after 3 seconds
        const timeout = setTimeout(() => {
            router.push('/my-library');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-4">
                    Your book has been added to your library.
                </p>
                {orderId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Order ID: {orderId}
                    </p>
                )}
                <button
                    onClick={() => router.push('/my-library')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    Go to My Library
                </button>
                <p className="text-xs text-gray-400 mt-4">
                    Redirecting automatically in 3 seconds...
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-center">
                    <div className="text-5xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}