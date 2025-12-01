const Book = require('../models/Book');
const { processImage, validateImage } = require('../utils/imageHelper');
const { getDriveDownloadLink, validateDriveLink } = require('../utils/driveHelper');

// @route   GET /api/books
// @desc    Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const { search, category, isPaid } = req.query;
        
        let query = { isActive: true };

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Paid/Free filter
        if (isPaid !== undefined) {
            query.isPaid = isPaid === 'true';
        }

        const books = await Book.find(query)
            .select('-pdfDownloadLink') // Don't send download link to frontend
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/books/:id
// @desc    Get single book
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .select('-pdfDownloadLink');

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   POST /api/books
// @desc    Create book (Admin only)
exports.createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            thumbnailBase64,
            pdfDriveLink,
            previewText,
            price,
            isPaid,
            category,
            tags
        } = req.body;

        // Validate required fields
        if (!title || !description || !pdfDriveLink || !thumbnailBase64) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Validate Drive link
        validateDriveLink(pdfDriveLink);

        // Process thumbnail
        let thumbnail;
        if (thumbnailBase64.startsWith('data:image')) {
            // Extract base64 data
            const base64Data = thumbnailBase64.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            thumbnail = await processImage(buffer);
        } else {
            // Already in correct format
            thumbnail = {
                data: thumbnailBase64,
                contentType: 'image/jpeg'
            };
        }

        // Generate download link
        const pdfDownloadLink = getDriveDownloadLink(pdfDriveLink);

        // Create book
        const book = await Book.create({
            title,
            author,
            description,
            thumbnail,
            pdfDriveLink,
            pdfDownloadLink,
            previewText,
            price: isPaid ? price : 0,
            isPaid,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   PUT /api/books/:id
// @desc    Update book (Admin only)
exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Process new thumbnail if provided
        if (req.body.thumbnailBase64) {
            const base64Data = req.body.thumbnailBase64.startsWith('data:image')
                ? req.body.thumbnailBase64.split(',')[1]
                : req.body.thumbnailBase64;
            
            const buffer = Buffer.from(base64Data, 'base64');
            req.body.thumbnail = await processImage(buffer);
            delete req.body.thumbnailBase64;
        }

        // Update Drive link if changed
        if (req.body.pdfDriveLink && req.body.pdfDriveLink !== book.pdfDriveLink) {
            validateDriveLink(req.body.pdfDriveLink);
            req.body.pdfDownloadLink = getDriveDownloadLink(req.body.pdfDriveLink);
        }

        // Update tags if provided
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   DELETE /api/books/:id
// @desc    Delete book (Admin only)
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        await book.deleteOne();

        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/books/categories
// @desc    Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};