const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getCategories
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/categories', getCategories);
router.get('/:id', getBook);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;