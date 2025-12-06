// src/app/payment/process/page.js
'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaytmPaymentPage() {
    const searchParams = useSearchParams();
    const formRef = useRef(null);

    useEffect(() => {
        // Get payment data from URL params
        const paytmParams = JSON.parse(
            decodeURIComponent(searchParams.get('params'))
        );

        // Auto-submit the form to Paytm
        if (formRef.current && paytmParams) {
            formRef.current.submit();
        }
    }, [searchParams]);

    const paytmParams = JSON.parse(
        decodeURIComponent(searchParams.get('params') || '{}')
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">Redirecting to Paytm...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
            </div>

            <form
                ref={formRef}
                method="post"
                action={process.env.NEXT_PUBLIC_PAYTM_TRANSACTION_URL}
                style={{ display: 'none' }}
            >
                <input
                    type="hidden"
                    name="mid"
                    value={paytmParams.body?.mid}
                />
                <input
                    type="hidden"
                    name="orderId"
                    value={paytmParams.body?.orderId}
                />
                <input
                    type="hidden"
                    name="txnToken"
                    value={paytmParams.head?.signature}
                />
            </form>
        </div>
    );
}