'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentAPI } from '@/lib/api';

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [statusMsg, setStatusMsg] = useState('Verifying your payment...');

    useEffect(() => {
        const merchantOrderId = searchParams.get('orderId');
        
        if (!merchantOrderId) {
            router.push('/payment/error?reason=missing_order');
            return;
        }

        let attempts = 0;
        const maxAttempts = 6;
        const intervalMs = 3000;

        const poll = async () => {
            try {
                const res = await paymentAPI.getStatus(merchantOrderId);
                const data = res.data;

                const status =
                    data?.status ||
                    data?.state ||
                    data?.data?.status ||
                    data?.data?.state;

                if (status === 'SUCCESS' || status === 'COMPLETED') {
                    router.push(`/payment/success?orderId=${merchantOrderId}`);
                    return;
                }

                if (status === 'FAILED') {
                    router.push(`/payment/failed?orderId=${merchantOrderId}`);
                    return;
                }

                attempts++;
                setStatusMsg(`Confirming payment... (${attempts}/${maxAttempts})`);

                if (attempts < maxAttempts) {
                    setTimeout(poll, intervalMs);
                } else {
                    router.push(`/payment/processing?orderId=${merchantOrderId}`);
                }

            } catch (err) {
                console.error("Status Error:", err);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(poll, intervalMs);
                } else {
                    router.push(`/payment/error?reason=server_error`);
                }
            }
        };

        poll();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
                <div className="animate-spin text-5xl mb-6">⏳</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {statusMsg}
                </h2>
                <p className="text-gray-500">
                    Please wait. Do not close or refresh this page.
                </p>
            </div>
        </div>
    );
}

export default function PaymentCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-5xl">⏳</div>
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}