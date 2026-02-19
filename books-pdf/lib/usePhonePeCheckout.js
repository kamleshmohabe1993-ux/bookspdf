
import { useState, useCallback } from 'react';
import { initiatePayment, getPaymentStatus } from '../services/paymentService';

/**
 * Custom hook — handles the full PhonePe V2 checkout flow
 * Supports both IFRAME and REDIRECT modes
 */
export const usePhonePeCheckout = ({ mode = 'IFRAME', onSuccess, onFailure } = {}) => {
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);

    /**
     * Poll payment status (used after IFRAME callback)
     */
    const pollPaymentStatus = useCallback(async (merchantOrderId, maxAttempts = 6, interval = 3000) => {
        let attempts = 0;

        return new Promise((resolve) => {
            const poll = async () => {
                try {
                    const status = await getPaymentStatus(merchantOrderId);

                    if (status.status === 'SUCCESS') {
                        resolve({ result: 'SUCCESS', status });
                        return;
                    }

                    if (status.status === 'FAILED') {
                        resolve({ result: 'FAILED', status });
                        return;
                    }

                    // Still PENDING
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(poll, interval);
                    } else {
                        resolve({ result: 'PENDING', status }); // Timed out
                    }

                } catch (err) {
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(poll, interval);
                    } else {
                        resolve({ result: 'ERROR', error: err.message });
                    }
                }
            };

            poll();
        });
    }, []);

    /**
     * Main checkout function — call this on "Buy Now" click
     */
    const startCheckout = useCallback(async (bookId) => {
        setLoading(true);
        setError(null);

        try {
            // ── Step 1: Create order on your backend ───────────────────────
            const orderData = await initiatePayment(bookId);
            setOrderInfo(orderData);

            const { paymentUrl, merchantOrderId } = orderData;

            // ── Step 2: Check PhonePe checkout.js is loaded ────────────────
            if (!window.PhonePeCheckout || !window.PhonePeCheckout.transact) {
                throw new Error('PhonePe checkout bundle not loaded. Check your index.html');
            }

            if (mode === 'IFRAME') {
                // ── IFRAME MODE ─────────────────────────────────────────────
                // PhonePe opens an overlay on your page
                // callback fires when user completes/cancels payment

                const callback = async (response) => {
                    // response from PhonePe: { code, message }
                    // NEVER trust this alone — always verify with your backend
                    console.log('📞 PhonePe IFRAME callback:', response);

                    setLoading(true);

                    // Poll your backend for the real status
                    const { result, status } = await pollPaymentStatus(merchantOrderId);

                    setLoading(false);

                    if (result === 'SUCCESS') {
                        onSuccess?.(status);
                    } else if (result === 'FAILED') {
                        onFailure?.(status);
                    } else {
                        // Still PENDING - tell user we're processing
                        onFailure?.({ status: 'PENDING', message: 'Payment is being processed' });
                    }
                };

                // Invoke PayPage in IFRAME mode
                window.PhonePeCheckout.transact({
                    tokenUrl: paymentUrl, // redirectUrl from backend response
                    callback,
                    type: 'IFRAME'
                });

            } else {
                // ── REDIRECT MODE ───────────────────────────────────────────
                // User is sent away to PhonePe page, then redirected back
                // to your redirectUrl (/payment/callback)

                window.PhonePeCheckout.transact({
                    tokenUrl: paymentUrl,
                    callback: () => {}, // Not used in redirect mode
                    type: 'REDIRECT'
                });
            }

        } catch (err) {
            console.error('❌ Checkout error:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [mode, onSuccess, onFailure, pollPaymentStatus]);

    /**
     * Explicitly close the IFRAME (only use if you need to close it programmatically)
     */
    const closeIframe = useCallback(() => {
        if (window.PhonePeCheckout?.closePage) {
            window.PhonePeCheckout.closePage();
        }
    }, []);

    return { startCheckout, loading, error, orderInfo, closeIframe };
};
