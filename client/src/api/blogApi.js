// src/api/blogApi.js
import axios from 'axios';

// ── BLOG APIs ─────────────────────────────────────────────────

// Get all blogs (with optional search, category, pagination)
export const fetchBlogs = async ({ page = 1, search = '', category = '' } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);
  const { data } = await axios.get(`/api/blogs?${params.toString()}`);
  return data;
};

// Get single blog by ID
export const fetchBlogById = async (id) => {
  const { data } = await axios.get(`/api/blogs/${id}`);
  return data;
};

// Create a new blog (requires auth token in axios headers)
export const createBlog = async (blogData) => {
  const { data } = await axios.post('/api/blogs', blogData);
  return data;
};

// Update a blog
export const updateBlog = async (id, blogData) => {
  const { data } = await axios.put(`/api/blogs/${id}`, blogData);
  return data;
};

// Delete a blog
export const deleteBlog = async (id) => {
  const { data } = await axios.delete(`/api/blogs/${id}`);
  return data;
};

// Get current user's blogs (dashboard)
export const fetchMyBlogs = async () => {
  const { data } = await axios.get('/api/blogs/user/my-blogs');
  return data;
};

// Toggle like on a blog
export const toggleLike = async (id) => {
  const { data } = await axios.put(`/api/blogs/${id}/like`);
  return data;
};

// ── AUTH APIs ─────────────────────────────────────────────────

export const updateProfile = async (profileData) => {
  const { data } = await axios.put('/api/auth/profile', profileData);
  return data;
};
