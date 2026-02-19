'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'Payment failed';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Failed
                </h1>
                <p className="text-gray-600 mb-6">
                    {reason}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}