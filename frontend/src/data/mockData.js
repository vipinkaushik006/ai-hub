// ─────────────────────────────────────────────
// src/mocks/tools.js
// Matches exact shape returned by GET /api/tools
// ─────────────────────────────────────────────

// ✅ Real MongoDB _ids — 24-char hex strings, not '1', '2', '3'
// These match the shape that ObjectId.toString() returns
export const mockTools = [
  {
    _id: '6679a1f2e4b0c3d5a8f12301',
    name: 'ChatGPT',
    slug: 'chatgpt',
    category: 'AI Writing',
    description: 'Advanced conversational AI by OpenAI for writing, coding, analysis, and more.',
    websiteLink: 'https://chat.openai.com',
    pricing: 'Freemium',
    rating: 4.8,
    totalRatings: 1200,   // ✅ Always include — used by RatingDisplay components
    ratingSum: 5760,
    trending: true,
    featured: true,       // ✅ Always include — used by FeaturedBadge components
    tags: ['chatbot', 'writing', 'gpt-4'], // ✅ lowercase — matches schema lowercase:true
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(), // ✅ ISO string matches JSON.stringify(Date)
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12302',
    name: 'Claude',
    slug: 'claude',
    category: 'AI Writing',
    description: "Anthropic's intelligent AI for complex reasoning, analysis, and creative writing.",
    websiteLink: 'https://claude.ai',
    pricing: 'Freemium',
    rating: 4.9,
    totalRatings: 800,
    ratingSum: 3920,
    trending: true,
    featured: true,
    tags: ['chatbot', 'reasoning', 'writing'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12303',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'AI Coding',
    description: 'AI pair programmer that suggests code completions and entire functions in real time.',
    websiteLink: 'https://github.com/features/copilot',
    pricing: 'Paid',
    rating: 4.7,
    totalRatings: 900,
    ratingSum: 4230,
    trending: true,
    featured: false,
    tags: ['coding', 'autocomplete', 'ide'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12304',
    name: 'Cursor',
    slug: 'cursor',
    category: 'AI Coding',
    description: 'AI-first code editor built for pair programming with cutting-edge language models.',
    websiteLink: 'https://cursor.sh',
    pricing: 'Freemium',
    rating: 4.8,
    totalRatings: 600,
    ratingSum: 2880,
    trending: true,
    featured: false,
    tags: ['ide', 'coding', 'gpt-4'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12305',
    name: 'Midjourney',
    slug: 'midjourney',
    category: 'AI Image Generation',
    description: 'Create stunning, photorealistic images from text prompts using Discord-based AI.',
    websiteLink: 'https://midjourney.com',
    pricing: 'Paid',
    rating: 4.7,
    totalRatings: 1100,
    ratingSum: 5170,
    trending: true,
    featured: false,
    tags: ['image', 'art', 'design'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12306',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    category: 'AI Audio',
    description: 'Hyper-realistic AI voice synthesis and cloning platform for narration and podcasts.',
    websiteLink: 'https://elevenlabs.io',
    pricing: 'Freemium',
    rating: 4.8,
    totalRatings: 750,
    ratingSum: 3600,
    trending: true,
    featured: false,
    tags: ['voice', 'text-to-speech', 'audio'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12307',
    name: 'Notion AI',
    slug: 'notion-ai',
    category: 'Productivity',
    description: 'AI assistant built into Notion for writing, summarizing, and organizing notes and docs.',
    websiteLink: 'https://notion.so/product/ai',
    pricing: 'Paid',
    rating: 4.5,
    totalRatings: 620,
    ratingSum: 2790,
    trending: true,
    featured: false,
    tags: ['notes', 'productivity', 'writing'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12308',
    name: 'Bolt.new',
    slug: 'bolt-new',
    category: 'AI Coding',
    description: 'AI-powered full-stack web app builder that scaffolds, runs, and deploys code in the browser.',
    websiteLink: 'https://bolt.new',
    pricing: 'Freemium',
    rating: 4.7,
    totalRatings: 430,
    ratingSum: 2021,
    trending: true,
    featured: false,
    tags: ['coding', 'web-app', 'deployment'],
    logoUrl: '',
    views: 0,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  }
];

// ─────────────────────────────────────────────
// src/mocks/analytics.js
// Matches exact shape returned by GET /api/analytics
// ─────────────────────────────────────────────
export const mockAnalytics = [
  { _id: '6679a1f2e4b0c3d5a8f12401', skill: 'Python',           category: 'Technology', demand: 92, salary: 125000, growth: 18,  jobPostings: 85000 },
  { _id: '6679a1f2e4b0c3d5a8f12402', skill: 'Machine Learning', category: 'AI/ML',      demand: 88, salary: 145000, growth: 35,  jobPostings: 62000 },
  { _id: '6679a1f2e4b0c3d5a8f12403', skill: 'JavaScript',       category: 'Technology', demand: 90, salary: 115000, growth: 12,  jobPostings: 95000 },
  { _id: '6679a1f2e4b0c3d5a8f12404', skill: 'React.js',         category: 'Technology', demand: 85, salary: 120000, growth: 20,  jobPostings: 72000 },
  { _id: '6679a1f2e4b0c3d5a8f12405', skill: 'Data Science',     category: 'Data',       demand: 82, salary: 135000, growth: 28,  jobPostings: 58000 },
  { _id: '6679a1f2e4b0c3d5a8f12406', skill: 'Cloud (AWS)',      category: 'Cloud',      demand: 87, salary: 130000, growth: 30,  jobPostings: 70000 },
  { _id: '6679a1f2e4b0c3d5a8f12407', skill: 'LLM Engineering',  category: 'AI/ML',      demand: 78, salary: 155000, growth: 120, jobPostings: 35000 },
  { _id: '6679a1f2e4b0c3d5a8f12408', skill: 'Kubernetes',       category: 'DevOps',     demand: 75, salary: 138000, growth: 25,  jobPostings: 42000 },
  { _id: '6679a1f2e4b0c3d5a8f12409', skill: 'TypeScript',       category: 'Technology', demand: 80, salary: 122000, growth: 40,  jobPostings: 60000 },
  { _id: '6679a1f2e4b0c3d5a8f12410', skill: 'SQL',              category: 'Data',       demand: 88, salary: 105000, growth: 8,   jobPostings: 80000 },
];

// ─────────────────────────────────────────────
// src/mocks/blogs.js
// Matches exact shape returned by GET /api/blogs
// including populated author shape from .populate()
// ─────────────────────────────────────────────
export const mockBlogs = [
  {
    _id: '6679a1f2e4b0c3d5a8f12501',
    title: 'Best AI Tools for Students in 2025',
    slug: 'best-ai-tools-for-students-2025',
    excerpt: 'Discover the top AI tools every student should be using in 2025.',
    content: 'Students can use AI tools for notes, coding, writing, and more...',
    category: 'AI Tools',
    tags: ['ai tools', 'students', 'productivity'], // ✅ lowercase
    readTime: 8,
    views: 0,             // ✅ starts at 0 — not fake inflated number
    published: true,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
    // ✅ Full populated author shape — matches .populate('author', 'name avatar')
    author: {
      _id: '6679a1f2e4b0c3d5a8f12001',
      name: 'Admin',
      avatar: ''
    },
    coverImage: ''
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12502',
    title: 'Top Programming Languages to Learn in 2026',
    slug: 'top-programming-languages-2026',
    excerpt: 'Explore the most in-demand programming languages in 2026.',
    content: 'Languages like Python, JavaScript, and Go are dominating...',
    category: 'Programming',
    tags: ['coding', 'career'],
    readTime: 10,
    views: 0,
    published: true,
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString(),
    author: {
      _id: '6679a1f2e4b0c3d5a8f12001',
      name: 'Admin',
      avatar: ''
    },
    coverImage: ''
  },
  {
    _id: '6679a1f2e4b0c3d5a8f12503',
    title: 'AI vs Data Science: Which Career is Better?',
    slug: 'ai-vs-data-science-career',
    excerpt: 'A complete comparison between AI and Data Science careers.',
    content: 'AI and Data Science both offer high salaries...',
    category: 'Career',
    tags: ['ai', 'career'],
    readTime: 12,
    views: 0,
    published: true,
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-01-05').toISOString(),
    author: {
      _id: '6679a1f2e4b0c3d5a8f12001',
      name: 'Admin',
      avatar: ''
    },
    coverImage: ''
  }
];

// ─────────────────────────────────────────────
// src/mocks/index.js
// Single import point for all mock data
// ─────────────────────────────────────────────
export { mockTools }     from './tools';
export { mockAnalytics } from './analytics';
export { mockBlogs }     from './blogs';