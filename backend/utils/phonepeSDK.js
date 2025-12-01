const axios = require('axios');
const crypto = require('crypto');

class PhonePeSDK {
    constructor(config) {
        this.merchantId = config.merchantId;
        this.saltKey = config.saltKey;
        this.saltIndex = config.saltIndex;
        this.env = config.env || 'UAT';
        console.log("config.merchantId", config);
        // Set base URL based on environment
        this.baseUrl = this.env === 'PRODUCTION' 
            ? 'https://api.phonepe.com/apis/hermes'
            : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
        
        console.log('✅ PhonePeSDK initialized');
        console.log('📱 Base URL:', this.baseUrl);
        console.log('🏪 Merchant ID:', this.merchantId);
    }

    /**
     * Generate checksum for request
     */
    generateChecksum(payload, endpoint) {
        const stringToHash = payload + endpoint + this.saltKey;
        const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
        return sha256Hash + '###' + this.saltIndex;
    }

    /**
     * Verify checksum from PhonePe response
     */
    verifyChecksum(response, checksum) {
        const stringToHash = response + '/pg/v1/status/' + this.merchantId + '/' + this.saltKey;
        const calculatedChecksum = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + this.saltIndex;
        return calculatedChecksum === checksum;
    }

    /**
     * Initiate payment - CORRECT FUNCTION NAME
     */
    async initiatePayment(paymentData) {
        try {
            console.log('💳 Initiating payment with data:', paymentData);

            const payload = {
                merchantId: this.merchantId,
                merchantTransactionId: paymentData.transactionId,
                merchantUserId: paymentData.userId,
                amount: paymentData.amount, // Amount in paise
                redirectUrl: paymentData.redirectUrl,
                redirectMode: paymentData.redirectMode || 'POST',
                callbackUrl: paymentData.callbackUrl,
                mobileNumber: paymentData.mobileNumber || null,
                paymentInstrument: {
                    type: 'PAY_PAGE'
                }
            };

            console.log('📦 Payment payload:', JSON.stringify(payload, null, 2));

            // Encode payload to base64
            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            console.log('🔐 Base64 Payload:', base64Payload.substring(0, 50) + '...');
            
            // Generate checksum
            const checksum = this.generateChecksum(base64Payload, '/pg/v1/pay');
            console.log('✅ Checksum generated:', checksum.substring(0, 20) + '...');

            // Make API request
            const response = await axios.post(
                `${this.baseUrl}/pg/v1/pay`,
                {
                    request: base64Payload
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum
                    }
                }
            );

            console.log('✅ PhonePe Response:', response.data);

            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data
            };

        } catch (error) {
            console.error('❌ PhonePe Payment Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Payment initiation failed');
        }
    }

    /**
     * Check payment status
     */
    async checkStatus(transactionId) {
        try {
            console.log('🔍 Checking status for transaction:', transactionId);

            const endpoint = `/pg/v1/status/${this.merchantId}/${transactionId}`;
            const checksum = this.generateChecksum('', endpoint);

            const response = await axios.get(
                `${this.baseUrl}${endpoint}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum,
                        'X-MERCHANT-ID': this.merchantId
                    }
                }
            );

            console.log('✅ Status Response:', response.data);

            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data
            };

        } catch (error) {
            console.error('❌ PhonePe Status Check Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Status check failed');
        }
    }

    /**
     * Initiate refund
     */
    async initiateRefund(refundData) {
        try {
            console.log('💸 Initiating refund:', refundData);

            const payload = {
                merchantId: this.merchantId,
                merchantUserId: refundData.userId,
                originalTransactionId: refundData.originalTransactionId,
                merchantTransactionId: refundData.refundTransactionId,
                amount: refundData.amount, // Amount in paise
                callbackUrl: refundData.callbackUrl
            };

            // Encode payload to base64
            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            
            // Generate checksum
            const checksum = this.generateChecksum(base64Payload, '/pg/v1/refund');

            // Make API request
            const response = await axios.post(
                `${this.baseUrl}/pg/v1/refund`,
                {
                    request: base64Payload
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum
                    }
                }
            );

            console.log('✅ Refund Response:', response.data);

            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data
            };

        } catch (error) {
            console.error('❌ PhonePe Refund Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Refund initiation failed');
        }
    }

    /**
     * Verify webhook callback
     */
    verifyWebhook(base64Response, xVerifyHeader) {
        try {
            console.log('🔐 Verifying webhook...');

            // Decode response
            const decodedResponse = JSON.parse(
                Buffer.from(base64Response, 'base64').toString('utf-8')
            );

            console.log('📦 Decoded webhook data:', decodedResponse);

            const { transactionId } = decodedResponse.data || {};

            if (!transactionId) {
                console.error('❌ No transaction ID in webhook');
                return { valid: false, error: 'Invalid transaction data' };
            }

            // Verify checksum
            const checksumString = base64Response + '/pg/v1/status/' + this.merchantId + '/' + transactionId + this.saltKey;
            const calculatedChecksum = crypto.createHash('sha256')
                .update(checksumString)
                .digest('hex') + '###' + this.saltIndex;

            console.log('🔐 Calculated checksum:', calculatedChecksum);
            console.log('🔐 Received checksum:', xVerifyHeader);

            if (xVerifyHeader !== calculatedChecksum) {
                console.error('❌ Checksum mismatch');
                return { valid: false, error: 'Checksum verification failed' };
            }

            console.log('✅ Webhook verified successfully');

            return {
                valid: true,
                data: decodedResponse
            };

        } catch (error) {
            console.error('❌ Webhook verification error:', error);
            return { valid: false, error: error.message };
        }
    }
}

module.exports = PhonePeSDK;