'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
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
                <p className="text-sm text-gray-500 mb-6">
                    Order ID: {orderId}
                </p>
                <button
                    onClick={() => router.push('/my-library')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    Go to My Library
                </button>
            </div>
        </div>
    );
}