# 🤖 AI Tools & Tech Analytics Hub

> A full-stack MERN platform for AI tool discovery, free developer utilities, tech analytics dashboards, and SEO-optimized blog content — built for organic traffic growth and Google AdSense monetization.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-4f6ef7?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-black?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Deployment Guide](#-deployment-guide)
- [SEO & Monetization](#-seo--monetization)
- [Roadmap](#-roadmap)

---

## ✨ Features

### 🔍 AI Tools Directory
- Searchable directory of 200+ AI tools
- Categories: Writing, Coding, Image Generation, Video, Audio, Data
- Filter by pricing: Free / Freemium / Paid / Open Source
- Star ratings & user reviews
- Bookmark favorite tools (requires login)
- Trending & Featured tool badges

### ⚙️ Free Developer Tools (Browser-Based)
| Tool | Description |
|------|-------------|
| 🔐 Password Generator | Configurable length, character types, strength meter |
| 📄 JSON Formatter | Pretty-print, minify, and validate JSON instantly |
| 📝 Word Counter | Words, characters, sentences, paragraphs, reading time |
| 🖼️ Image Compressor | Client-side JPEG compression with quality slider |
| 🤖 AI Resume Analyzer | ATS score, keyword gap analysis, improvement tips |

### 📊 Tech Analytics Dashboard
- Interactive Chart.js visualizations
- Skills demand scores for 2025-2026
- Average salary by technology
- YoY growth rate analysis
- AI job market trend lines (2020–2026)
- Searchable data table

### ✍️ SEO Blog System
- Markdown rendering
- Category filtering
- Read time estimation
- View counters
- Open Graph meta tags per article
- Tags and author attribution

### 🔐 User Authentication
- JWT-based auth (30-day tokens)
- Register / Login / Logout
- Role-based access (user / admin)
- Bookmark management

### 💰 AdSense-Ready
- Placeholder banners in: header, sidebar, inline (blog)
- Easy swap to real AdSense `<ins>` tags

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS v3 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| SEO | react-helmet-async |
| Notifications | react-hot-toast |
| Deploy (FE) | Vercel or Netlify |
| Deploy (BE) | Render |
| Version Control | GitHub |

---

## 📁 Project Structure

```
ai-hub/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (auth, bookmarks, role)
│   │   ├── Tool.js          # AI tool schema (slug, rating, tags)
│   │   ├── Blog.js          # Blog schema (SEO meta, readTime)
│   │   └── Analytics.js     # Tech skills demand/salary data
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   ├── tools.js         # CRUD + search + rating
│   │   ├── blogs.js         # CRUD + slug-based access
│   │   ├── analytics.js     # GET/POST analytics data
│   │   └── users.js         # Bookmark toggle
│   ├── middleware/
│   │   └── auth.js          # JWT protect + admin guard
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Seed 12 tools + analytics + admin + blog
│   ├── render.yaml          # Render deployment config
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html       # AdSense placeholder, OG tags
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.js      # Sticky, mobile-responsive
│   │   │   │   ├── Footer.js      # Links, social, copyright
│   │   │   │   ├── SEO.js         # Helmet wrapper
│   │   │   │   ├── AdBanner.js    # AdSense placeholder
│   │   │   │   └── ScrollToTop.js
│   │   │   ├── tools/
│   │   │   │   └── ToolCard.js    # Rating, pricing, bookmark
│   │   │   └── blog/
│   │   │       └── BlogCard.js    # Gradient cover, meta info
│   │   ├── context/
│   │   │   └── AuthContext.js     # Global user state
│   │   ├── data/
│   │   │   └── mockData.js        # Static fallback data
│   │   ├── pages/
│   │   │   ├── HomePage.js        # Hero, trending, features, CTA
│   │   │   ├── ToolsPage.js       # Search, filter, paginate
│   │   │   ├── ToolDetailPage.js  # Tool info + rating
│   │   │   ├── BlogPage.js        # Blog listing + category filter
│   │   │   ├── BlogDetailPage.js  # Article renderer + AdSense
│   │   │   ├── AnalyticsPage.js   # Charts, table, stat cards
│   │   │   ├── DevToolsPage.js    # All 5 dev utilities
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── BookmarksPage.js
│   │   │   └── NotFoundPage.js
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance + interceptors
│   │   ├── App.js                 # Routes
│   │   └── index.css              # Tailwind + custom utilities
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── netlify.toml
│
├── package.json             # Root scripts (dev, build, seed)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-tools-hub.git
cd ai-tools-hub
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Configure environment variables

**Backend** — copy and edit:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/aihub
JWT_SECRET=your_super_secret_key_here_min_32_chars
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — for local development, the CRA proxy handles API calls automatically (no `.env` needed locally).

### 4. Seed the database
```bash
npm run seed
```
This creates:
- 12 AI tools (trending/featured)
- 10 analytics data points
- 1 sample blog post
- Admin user: `admin@aihub.com` / `Admin@123456`

### 5. Start development servers
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (min 32 chars) |
| `PORT` | ❌ | API port (default: 5000) |
| `FRONTEND_URL` | ✅ | CORS origin (e.g. http://localhost:3000) |
| `NODE_ENV` | ❌ | development / production |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Production only | Full backend URL (e.g. https://ai-hub.onrender.com/api) |

---

## 🗄 Database Schema

### Users
```js
{ name, email, password (hashed), role: ['user','admin'], bookmarks: [ToolId], createdAt }
```

### Tools
```js
{ name, slug, category, description, longDescription, websiteLink, logoUrl,
  tags[], pricing, rating, totalRatings, ratingSum, views, trending, featured, createdAt }
```

### Blogs
```js
{ title, slug, content, excerpt, author (ref User), coverImage, category,
  tags[], metaTitle, metaDescription, readTime, views, published, createdAt }
```

### Analytics
```js
{ skill, category, demand, salary, growth, jobPostings, year, createdAt }
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Tools
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tools` | List tools (search, filter, paginate) | ❌ |
| GET | `/api/tools/trending` | Get trending tools | ❌ |
| GET | `/api/tools/:slug` | Get tool detail | ❌ |
| POST | `/api/tools/:id/rate` | Rate a tool (1-5) | ✅ |
| POST | `/api/tools` | Create tool | Admin |
| PUT | `/api/tools/:id` | Update tool | Admin |
| DELETE | `/api/tools/:id` | Delete tool | Admin |

### Blogs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/blogs` | List blogs | ❌ |
| GET | `/api/blogs/:slug` | Get blog | ❌ |
| POST | `/api/blogs` | Create blog | Admin |
| PUT | `/api/blogs/:id` | Update blog | Admin |
| DELETE | `/api/blogs/:id` | Delete blog | Admin |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get all analytics |
| POST | `/api/analytics` | Add analytics entry (Admin) |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/bookmarks` | Get bookmarks | ✅ |
| POST | `/api/users/bookmarks/:toolId` | Toggle bookmark | ✅ |

---

## 🌐 Deployment Guide

### Backend → Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add environment variables:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → a strong random string
   - `FRONTEND_URL` → your Vercel/Netlify URL
   - `NODE_ENV` → `production`

### Frontend → Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory**: `frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. Add environment variable:
   - `REACT_APP_API_URL` → `https://your-app.onrender.com/api`

### Alternative: Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) → New Site
2. Connect GitHub repo, set base directory to `frontend`
3. Build command: `npm run build`, publish: `build`
4. Set `REACT_APP_API_URL` in Site Settings → Environment Variables

### MongoDB Atlas (Cloud DB)

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user + password
3. Whitelist IP `0.0.0.0/0` (or Render IPs)
4. Copy connection string → use as `MONGODB_URI`
5. Run seed: `MONGODB_URI=<atlas-uri> npm run seed`

---

## 📈 SEO & Monetization

### SEO Checklist
- [x] React Helmet meta tags per page
- [x] Open Graph tags (title, description, type)
- [x] Twitter Card meta tags
- [x] SEO-friendly URL slugs for tools and blogs
- [x] Semantic HTML structure
- [x] Fast loading (static fallback data)
- [ ] Add `public/sitemap.xml` (generate after deploying)
- [ ] Submit sitemap to Google Search Console
- [ ] Add `public/robots.txt`

### Google AdSense Integration
Replace placeholder `AdBanner` components with real AdSense code:

```jsx
// In frontend/src/components/common/AdBanner.js
// Replace the div content with:
<ins className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
// And in index.html uncomment the AdSense script tag
```

AdSense placements already configured:
- **Header banner** — above trending tools on homepage
- **Inline banner** — inside blog articles (above and below content)
- **Inline banner** — on Tools and Dev Tools pages

### Traffic Growth Strategy
1. **SEO Content**: Publish 20+ blog articles targeting keywords:
   - "best AI tools for [profession]"
   - "free [tool] alternative"
   - "[skill] salary 2025"
2. **Analytics Dashboards**: Share on LinkedIn/Reddit for backlinks
3. **Free Tools**: The resume analyzer is highly shareable
4. **YouTube**: Create short demos of each AI tool you feature

---

## 🗺 Roadmap

### Phase 1 — MVP (Done ✅)
- [x] AI Tools Directory with search & filter
- [x] 5 Free Developer Tools
- [x] Analytics Dashboard with Chart.js
- [x] SEO Blog system
- [x] User auth (register/login/bookmarks)
- [x] AI Resume Analyzer
- [x] AdSense-ready banner placements
- [x] Responsive design (mobile-first)
- [x] Vercel + Render deployment configs

### Phase 2 — Growth
- [ ] AI-powered tool recommendations
- [ ] Newsletter signup (Mailchimp integration)
- [ ] Tool submission form (community contributions)
- [ ] Advanced blog editor (rich text / MDX)
- [ ] Google OAuth login
- [ ] Admin dashboard UI

### Phase 3 — Monetization
- [ ] Sponsored tool listings (premium placement)
- [ ] Affiliate links tracker
- [ ] Premium membership tier
- [ ] API access for developers

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2025 AIHub — Built for developers, by developers.
