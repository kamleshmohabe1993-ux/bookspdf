import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentCallback () {
    const [searchParams]      = useSearchParams();
    const navigate             = useNavigate();
    const [status, setStatus] = useState('CHECKING');
    const merchantOrderId     = searchParams.get('orderId');

    useEffect(() => {
        if (!merchantOrderId) return;

        let attempts = 0;
        const maxAttempts = 5;  // Poll max 5 times
        const interval = 3000; // Every 3 seconds

        const pollStatus = async () => {
            try {
                const res = await fetch(
                    `/api/payments/v2/status/${merchantOrderId}`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        }
                    }
                );
                const data = await res.json();

                if (data.data.status === 'SUCCESS') {
                    setStatus('SUCCESS');
                    navigate(`/payment/success?orderId=${merchantOrderId}`);
                    return true;
                }
                
                if (data.data.status === 'FAILED') {
                    setStatus('FAILED');
                    navigate(`/payment/failed?orderId=${merchantOrderId}`);
                    return true;
                }

                return false; // Still PENDING

            } catch (err) {
                console.error('Poll error:', err);
                return false;
            }
        };

        const startPolling = async () => {
            while (attempts < maxAttempts) {
                const done = await pollStatus();
                if (done) break;
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise(r => setTimeout(r, interval));
                }
            }
            // If max attempts reached and still pending
            if (attempts >= maxAttempts) {
                navigate(`/payment/processing?orderId=${merchantOrderId}`);
            }
        };

        startPolling();
    }, [merchantOrderId]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <h2 className="text-xl font-semibold">
                    Confirming your payment...
                </h2>
                <p className="text-gray-500 mt-2">
                    Please wait, do not close or refresh this page
                </p>
            </div>
        </div>
    );
};