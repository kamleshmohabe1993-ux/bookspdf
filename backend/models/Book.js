const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        data: String,
        contentType: String
    },
    pdfDriveLink: {
        type: String,
        required: true
    },
    pdfDownloadLink: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        enum: ['Education', 'Business', 'Design', 'Marketing', 'Religious', 'Spiritual', 'Relationship', 'Motivational', 'Other',],
        default: 'Other'
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    // Rating fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp
bookSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Book', bookSchema);