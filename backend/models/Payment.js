
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    downloadToken: {
        type: String,
        unique: true,
        sparse: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    maxDownloads: {
        type: Number,
        default: 5
    },
    paymentGateway: {
        type: String,
        enum: ['PhonePe', 'Free'], 
    },
    // V2 uses merchantOrderId instead of merchantTransactionId
    merchantOrderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phonePeOrderId: String, // PhonePe's internal order ID
    
    amount: {
        type: Number,
        required: true // Amount in paise
    },
    currency: {
        type: String,
        default: 'INR'
    },
    
    status: {
        type: String,
        enum: ['INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
        index: true
    },
    
    paymentState: String, // Raw PhonePe state
    paymentMethod: String,
    paymentInstrument: mongoose.Schema.Types.Mixed,
    
    userMobile: String,
    userEmail: String,
    
    initiatedAt: {
        type: Date,
        default: Date.now
    },
    purchasedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    expireAt: Date,
    
    redirectUrl: String,
    
    webhookReceived: {
        type: Boolean,
        default: false
    },
    
    errorCode: String,
    errorMessage: String,
    
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date

}, {
    timestamps: true
});

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Payment', paymentSchema);