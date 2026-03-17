// server/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  toggleLike,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Private routes (require authentication)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.get('/user/my-blogs', protect, getMyBlogs);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
