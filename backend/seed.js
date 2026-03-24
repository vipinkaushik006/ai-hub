require('dotenv').config();
const mongoose = require('mongoose');
const Tool = require('./models/Tool');
const Analytics = require('./models/Analytics');
const User = require('./models/User');
const Blog = require('./models/Blog');

// ✅ Hard crash if required env vars are missing — never silently fall back
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!MONGODB_URI)      throw new Error('MONGODB_URI is required in .env');
if (!ADMIN_EMAIL)      throw new Error('SEED_ADMIN_EMAIL is required in .env');
if (!ADMIN_PASSWORD)   throw new Error('SEED_ADMIN_PASSWORD is required in .env');

// ✅ Block accidental runs in production
if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed script must not be run in production. Set NODE_ENV to development.');
}

// ─────────────────────────────────────────────
// Seed data
// Note: rating/ratingSum/totalRatings omitted —
// these are computed fields managed by the model
// ─────────────────────────────────────────────
const tools = [
  {
    name: 'ChatGPT',
    category: 'AI Writing',
    description: 'Advanced conversational AI by OpenAI for writing, coding, analysis, and more.',
    websiteLink: 'https://chat.openai.com',
    pricing: 'Freemium',
    trending: true,
    featured: true,
    tags: ['chatbot', 'writing', 'gpt-4'] // ✅ lowercase — matches schema's lowercase:true
  },
  {
    name: 'Claude',
    category: 'AI Writing',
    description: "Anthropic's intelligent AI assistant for complex reasoning, analysis, and creative writing.",
    websiteLink: 'https://claude.ai',
    pricing: 'Freemium',
    trending: true,
    featured: true,
    tags: ['chatbot', 'reasoning', 'writing']
  },
  {
    name: 'GitHub Copilot',
    category: 'AI Coding',
    description: 'AI pair programmer that suggests code completions and entire functions in real time.',
    websiteLink: 'https://github.com/features/copilot',
    pricing: 'Paid',
    trending: true,
    tags: ['coding', 'autocomplete', 'ide']
  },
  {
    name: 'Cursor',
    category: 'AI Coding',
    description: 'AI-first code editor built for pair programming with cutting-edge language models.',
    websiteLink: 'https://cursor.sh',
    pricing: 'Freemium',
    trending: true,
    tags: ['ide', 'coding', 'gpt-4']
  },
  {
    name: 'Midjourney',
    category: 'AI Image Generation',
    description: 'Create stunning, photorealistic images from text prompts using Discord-based AI.',
    websiteLink: 'https://midjourney.com',
    pricing: 'Paid',
    trending: true,
    tags: ['image', 'art', 'design']
  },
  {
    name: 'DALL-E 3',
    category: 'AI Image Generation',
    description: "OpenAI's most advanced image generator integrated in ChatGPT for stunning visuals.",
    websiteLink: 'https://openai.com/dall-e-3',
    pricing: 'Freemium',
    trending: false,
    tags: ['image', 'openai', 'creative']
  },
  {
    name: 'Stable Diffusion',
    category: 'AI Image Generation',
    description: 'Open-source text-to-image model you can run locally or use via hosted platforms.',
    websiteLink: 'https://stability.ai',
    pricing: 'Open Source',
    trending: false,
    tags: ['image', 'open-source', 'local']
  },
  {
    name: 'Runway ML',
    category: 'AI Video',
    description: 'Professional AI video generation and editing platform for creators and filmmakers.',
    websiteLink: 'https://runwayml.com',
    pricing: 'Freemium',
    trending: true,
    tags: ['video', 'editing', 'generation']
  },
  {
    name: 'Sora',
    category: 'AI Video',
    description: "OpenAI's revolutionary text-to-video model capable of generating realistic videos.",
    websiteLink: 'https://openai.com/sora',
    pricing: 'Paid',
    trending: true,
    tags: ['video', 'text-to-video', 'openai']
  },
  {
    name: 'Grammarly',
    category: 'AI Writing',
    description: 'AI-powered grammar checker and writing assistant for clear, engaging content.',
    websiteLink: 'https://grammarly.com',
    pricing: 'Freemium',
    trending: false,
    tags: ['writing', 'grammar', 'editing']
  },
  {
    name: 'Jasper',
    category: 'AI Writing',
    description: 'Marketing-focused AI writing tool for blog posts, ads, and social media content.',
    websiteLink: 'https://jasper.ai',
    pricing: 'Paid',
    trending: false,
    tags: ['marketing', 'copywriting', 'seo']
  },
  {
    name: 'Tabnine',
    category: 'AI Coding',
    description: 'AI code completion tool supporting 30+ programming languages across major IDEs.',
    websiteLink: 'https://tabnine.com',
    pricing: 'Freemium',
    trending: false,
    tags: ['coding', 'autocomplete', 'multi-language']
  }
];

const analyticsData = [
  { skill: 'Python',                category: 'Technology', demand: 92, salary: 125000, growth: 18,  jobPostings: 85000 },
  { skill: 'Machine Learning',      category: 'AI/ML',      demand: 88, salary: 145000, growth: 35,  jobPostings: 62000 },
  { skill: 'JavaScript',            category: 'Technology', demand: 90, salary: 115000, growth: 12,  jobPostings: 95000 },
  { skill: 'React.js',              category: 'Technology', demand: 85, salary: 120000, growth: 20,  jobPostings: 72000 },
  { skill: 'Data Science',          category: 'Data',       demand: 82, salary: 135000, growth: 28,  jobPostings: 58000 },
  { skill: 'Cloud (AWS)',           category: 'Cloud',      demand: 87, salary: 130000, growth: 30,  jobPostings: 70000 },
  { skill: 'LLM / Prompt Engineering', category: 'AI/ML',  demand: 78, salary: 155000, growth: 120, jobPostings: 35000 },
  { skill: 'Kubernetes',            category: 'DevOps',     demand: 75, salary: 138000, growth: 25,  jobPostings: 42000 },
  { skill: 'Rust',                  category: 'Technology', demand: 55, salary: 140000, growth: 45,  jobPostings: 18000 },
  { skill: 'SQL',                   category: 'Data',       demand: 88, salary: 105000, growth: 8,   jobPostings: 80000 },
  { skill: 'TypeScript',            category: 'Technology', demand: 80, salary: 122000, growth: 40,  jobPostings: 60000 },
  { skill: 'Deep Learning',         category: 'AI/ML',      demand: 72, salary: 150000, growth: 42,  jobPostings: 40000 },
];

const seedBlogContent = `Artificial intelligence has transformed the way we work, create, and communicate...`; // keep as-is

// ─────────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ Wipe only what we're reseeding
    await Promise.all([
      Tool.deleteMany({}),
      Analytics.deleteMany({}),
      Blog.deleteMany({})
    ]);
    console.log('🧹 Cleared existing seed collections');

    // ─────────────────────────────────────────
    // Tools — use save() per doc so pre('save')
    // hooks run and slugs are generated correctly
    // ─────────────────────────────────────────
    await Promise.all(tools.map((t) => new Tool(t).save()));
    console.log(`✅ ${tools.length} tools seeded`);

    // ─────────────────────────────────────────
    // Analytics — no hooks needed, insertMany ok
    // ─────────────────────────────────────────
    await Analytics.insertMany(analyticsData);
    console.log(`✅ ${analyticsData.length} analytics records seeded`);

    // ─────────────────────────────────────────
    // Admin user — credentials from .env only
    // ─────────────────────────────────────────
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
    }

    // ─────────────────────────────────────────
    // Blog — let pre('save') compute slug +
    // readTime automatically, never hardcode them
    // ─────────────────────────────────────────
    await new Blog({
      title: 'Best AI Tools for Students in 2025',
      // ✅ slug auto-generated by pre('save') hook
      content: seedBlogContent,
      excerpt: 'Discover the top AI tools every student should be using in 2025—from writing assistants to coding helpers and image generators.',
      author: admin._id,
      category: 'AI Tools',
      tags: ['ai tools', 'students', 'productivity', 'chatgpt', 'education'],
      metaTitle: 'Best AI Tools for Students in 2025 | AI Hub',
      metaDescription: 'Discover the top 10 AI tools every student should use in 2025. From ChatGPT to Midjourney, boost your productivity and grades with these essential AI apps.',
      // ✅ readTime auto-computed by pre('save') hook
      // ✅ views starts at 0 — never seed fake engagement data
    }).save();
    console.log('✅ Blog seeded');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();