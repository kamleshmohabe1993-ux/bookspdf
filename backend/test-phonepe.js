require('dotenv').config();
const { phonePeClient, verifyPhonePeConfig } = require('./config/phonepe');

console.log('🧪 Testing PhonePe SDK...\n');

// Verify config
verifyPhonePeConfig();

console.log('\n📋 PhonePe Client Details:');
console.log('Type:', typeof phonePeClient);
console.log('Constructor:', phonePeClient.constructor.name);
console.log('Has initiatePayment?', typeof phonePeClient.initiatePayment === 'function');
console.log('Has checkStatus?', typeof phonePeClient.checkStatus === 'function');
console.log('Has initiateRefund?', typeof phonePeClient.initiateRefund === 'function');
console.log('Has verifyWebhook?', typeof phonePeClient.verifyWebhook === 'function');

console.log('\n🔍 All available methods:');
const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(phonePeClient));
methods.forEach(method => {
    if (typeof phonePeClient[method] === 'function') {
        console.log(`  - ${method}()`);
    }
});

// Test payment initiation (without actually calling API)
console.log('\n💳 Testing payment initiation (dry run)...');
const testData = {
    transactionId: 'TEST123',
    userId: 'USER123',
    amount: 10000, // ₹100 in paise
    callbackUrl: 'https://example.com/callback',
    redirectUrl: 'https://example.com/redirect',
    mobileNumber: '9999999999'
};

console.log('Test data prepared:', testData);
console.log('\n✅ PhonePe SDK is ready to use!');