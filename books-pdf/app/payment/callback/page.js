'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentAPI } from '@/lib/api';
const getPaymentStatus = async (merchantOrderId) => {
        const res = await paymentAPI.getStatus(merchantOrderId);
        if (!res.success) throw new Error(res.message || 'Status check failed');
        console.log("getPaymentStatus API Data:", res);
        return res.data; 
    };

export default function PaymentCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const merchantOrderId = searchParams.get('orderId');
    const [statusMsg, setStatusMsg] = useState('Verifying your payment...');
    
    useEffect(() => {
        if (!merchantOrderId) {
            router.push('/payment/error?reason=missing_order');
            return;
        }

        let attempts = 0;
        const maxAttempts = 6;
        const intervalMs = 3000;

        const poll = async () => {
            try {
                console.log("Calling status API with:", merchantOrderId);

                const data = await getPaymentStatus(merchantOrderId);

                console.log("Payment Status Data:", data);

                if (!data) {
                    console.log("No data returned");
                    return;
                }
            
                if (data.status === 'SUCCESS') {
                    router.push(`/payment/success?orderId=${merchantOrderId}`);
                    return;
                }

                if (data.status === 'FAILED') {
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
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(poll, intervalMs);
                } else {
                    router.push(`/payment/error?reason=server_error`);
                }
            }
        };

        poll();
    }, [merchantOrderId]);


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

