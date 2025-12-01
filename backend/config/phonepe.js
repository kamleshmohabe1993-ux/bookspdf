const PhonePeSDK = require('../utils/phonepeSDK');
const dotenv = require('dotenv');
dotenv.config();
// Initialize PhonePe Client
const phonePeClient = new PhonePeSDK({
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    saltKey: process.env.PHONEPE_SALT_KEY,
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX),
    env: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'UAT'
});

// Verify Configuration
const verifyPhonePeConfig = () => {
    const requiredEnvVars = [
        'PHONEPE_MERCHANT_ID',
        'PHONEPE_SALT_KEY',
        'PHONEPE_SALT_INDEX'
    ];

    const missingVars = requiredEnvVars.filter(
        varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
        console.error('❌ Missing PhonePe configuration:', missingVars.join(', '));
        return false;
    }

    console.log('✅ PhonePe configuration verified');
    console.log(`📱 Environment: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'UAT (Test)'}`);
    console.log(`🏪 Merchant ID: ${process.env.PHONEPE_MERCHANT_ID}`);
    
    // Test that phonePeClient has the method
    console.log('🔍 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(phonePeClient)));
    
    return true;
};

module.exports = {
    phonePeClient,
    verifyPhonePeConfig
};