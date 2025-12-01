const https = require('https');
const PaytmChecksum = require('paytmchecksum');

class PaytmHelper {
    constructor() {
        this.MID = process.env.PAYTM_MID;
        this.MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
        this.WEBSITE = process.env.PAYTM_WEBSITE;
        this.INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE;
        this.CHANNEL_ID = process.env.PAYTM_CHANNEL_ID;
        this.CALLBACK_URL = process.env.PAYTM_CALLBACK_URL;
        this.TRANSACTION_STATUS_URL = process.env.PAYTM_TRANSACTION_STATUS_URL;
        this.TRANSACTION_URL = process.env.PAYTM_TRANSACTION_URL;
    }

    // Generate checksum for payment
    async generateChecksum(orderId, customerId, amount) {
        const paytmParams = {
            body: {
                requestType: "Payment",
                mid: this.MID,
                websiteName: this.WEBSITE,
                orderId: orderId,
                callbackUrl: this.CALLBACK_URL,
                txnAmount: {
                    value: amount.toString(),
                    currency: "INR"
                },
                userInfo: {
                    custId: customerId
                }
            }
        };

        const checksum = await PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            this.MERCHANT_KEY
        );

        paytmParams.head = {
            signature: checksum
        };

        return paytmParams;
    }

    // Verify checksum from callback
    verifyChecksum(paytmResponse, checksum) {
        return PaytmChecksum.verifySignature(
            JSON.stringify(paytmResponse),
            this.MERCHANT_KEY,
            checksum
        );
    }

    // Check transaction status
    async getTransactionStatus(orderId) {
        return new Promise((resolve, reject) => {
            const paytmParams = {
                body: {
                    mid: this.MID,
                    orderId: orderId
                }
            };

            PaytmChecksum.generateSignature(
                JSON.stringify(paytmParams.body),
                this.MERCHANT_KEY
            ).then(checksum => {
                paytmParams.head = {
                    signature: checksum
                };

                const post_data = JSON.stringify(paytmParams);

                const options = {
                    hostname: new URL(this.TRANSACTION_STATUS_URL).hostname,
                    port: 443,
                    path: new URL(this.TRANSACTION_STATUS_URL).pathname,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                const post_req = https.request(options, function(post_res) {
                    let response = '';
                    post_res.on('data', function(chunk) {
                        response += chunk;
                    });

                    post_res.on('end', function() {
                        resolve(JSON.parse(response));
                    });
                });

                post_req.write(post_data);
                post_req.end();
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = new PaytmHelper();