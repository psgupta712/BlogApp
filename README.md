# ✒ Inkwell — MERN Blog Application

A full-stack blog platform built with MongoDB, Express, React (Vite), and Node.js.

---

## 📁 Project Structure

```
blog-app/
├── client/                        ← React + Vite Frontend
│   ├── index.html
│   ├── vite.config.js             ← Vite config + proxy to backend
│   └── src/
│       ├── main.jsx               ← React entry point
│       ├── App.jsx                ← All routes defined here
│       ├── index.css              ← Global styles + CSS variables
│       ├── api/
│       │   └── blogApi.js         ← All Axios API call functions
│       ├── context/
│       │   └── AuthContext.jsx    ← Global auth state (user, login, logout)
│       ├── components/
│       │   ├── Navbar.jsx/css     ← Top navigation bar
│       │   ├── BlogCard.jsx/css   ← Card shown in blog grid
│       │   └── ProtectedRoute.jsx ← Redirects if not logged in
│       └── pages/
│           ├── Home.jsx/css       ← Blog listing, search, filters
│           ├── Login.jsx          ← Sign in form
│           ├── Register.jsx       ← Sign up form
│           ├── AuthPages.css      ← Shared auth page styles
│           ├── BlogDetail.jsx/css ← Single blog post view
│           ├── CreateBlog.jsx     ← Write new post
│           ├── EditBlog.jsx       ← Edit existing post
│           ├── BlogForm.css       ← Shared form styles
│           ├── Dashboard.jsx/css  ← User profile + my posts
│           └── NotFound.jsx       ← 404 page
│
└── server/                        ← Node.js + Express Backend
    ├── server.js                  ← Entry point, middleware, routes
    ├── .env.example               ← Copy to .env and fill in values
    ├── config/
    │   └── db.js                  ← MongoDB connection
    ├── models/
    │   ├── User.js                ← User schema (bcrypt password hashing)
    │   └── Blog.js                ← Blog schema
    ├── controllers/
    │   ├── authController.js      ← register, login, getMe, updateProfile
    │   └── blogController.js      ← CRUD + like/unlike
    ├── middleware/
    │   └── authMiddleware.js      ← JWT verification
    └── routes/
        ├── authRoutes.js          ← /api/auth/*
        └── blogRoutes.js          ← /api/blogs/*
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works)

### 1. Clone / download the project

```bash
git clone <your-repo-url>
cd blog-app
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/blogapp
JWT_SECRET=anyLongRandomSecretString123!
NODE_ENV=development
```

> 💡 Get your MongoDB URI from [mongodb.com](https://cloud.mongodb.com) → Clusters → Connect → Drivers

Start the backend:
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
✅ Server running on http://localhost:5000
```

### 3. Set up the Frontend

Open a **new terminal**:
```bash
cd client
npm install
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update name/bio |

### Blog Routes (`/api/blogs`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/blogs` | Public | Get all blogs (search, filter, paginate) |
| GET | `/api/blogs/:id` | Public | Get single blog |
| POST | `/api/blogs` | Private | Create blog |
| PUT | `/api/blogs/:id` | Private | Update blog (author only) |
| DELETE | `/api/blogs/:id` | Private | Delete blog (author only) |
| GET | `/api/blogs/user/my-blogs` | Private | Get logged-in user's blogs |
| PUT | `/api/blogs/:id/like` | Private | Toggle like/unlike |

### Query Parameters (GET /api/blogs)
```
?page=1          → Pagination (default: 1)
?limit=9         → Items per page (default: 9)
?search=react    → Search title, content, tags
?category=Tech   → Filter by category
```

---

## ✨ Features

- **Authentication** — Register, login, JWT-based sessions, persistent across page reloads
- **Blog CRUD** — Create, read, update, delete posts
- **Rich Cards** — Auto-generated gradients for posts without cover images
- **Search & Filter** — Full-text search + category filters with pagination
- **Like System** — Toggle likes (authenticated users only)
- **Dashboard** — View your posts, stats (views, likes), edit profile
- **Protected Routes** — Unauthenticated users redirected to login
- **Responsive** — Works on mobile, tablet, desktop

---

## 🎨 Design Choices

- **Theme**: Dark editorial — inspired by literary magazines
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Accent**: Warm amber/gold (`#e8a838`)
- **CSS approach**: Custom properties (variables) — no external UI library

---

## 🌐 Deployment

### Backend → Render.com (Free)
1. Push `server/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`

### Frontend → Vercel (Free)
1. Push `client/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Create `client/.env.production`:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
4. In `src/context/AuthContext.jsx`, update:
   ```js
   axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```
5. In Render backend, add `https://your-vercel-app.vercel.app` to the CORS allowed origins

---

## 🧠 Key Concepts Used

| Concept | Where |
|---------|-------|
| Mongoose pre-save hooks | `User.js` — auto-hash passwords |
| JWT auth middleware | `authMiddleware.js` — protects private routes |
| React Context API | `AuthContext.jsx` — global auth state |
| React Router v6 | `App.jsx` — client-side routing |
| Axios interceptors | `AuthContext.jsx` — auto-attach auth token |
| Protected Routes | `ProtectedRoute.jsx` — redirect if not logged in |
| Vite proxy | `vite.config.js` — avoids CORS in development |
