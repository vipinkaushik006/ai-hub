require('dotenv').config();
const mongoose = require('mongoose');
const Tool = require('./models/Tool');
const Analytics = require('./models/Analytics');
const User = require('./models/User');
const Blog = require('./models/Blog');

const tools = [
  { name: 'ChatGPT', category: 'AI Writing', description: 'Advanced conversational AI by OpenAI for writing, coding, analysis, and more.', websiteLink: 'https://chat.openai.com', pricing: 'Freemium', rating: 4.8, totalRatings: 1200, ratingSum: 5760, trending: true, featured: true, tags: ['chatbot', 'writing', 'GPT-4'] },
  { name: 'Claude', category: 'AI Writing', description: 'Anthropic\'s intelligent AI assistant for complex reasoning, analysis, and creative writing.', websiteLink: 'https://claude.ai', pricing: 'Freemium', rating: 4.9, totalRatings: 800, ratingSum: 3920, trending: true, featured: true, tags: ['chatbot', 'reasoning', 'writing'] },
  { name: 'GitHub Copilot', category: 'AI Coding', description: 'AI pair programmer that suggests code completions and entire functions in real time.', websiteLink: 'https://github.com/features/copilot', pricing: 'Paid', rating: 4.7, totalRatings: 900, ratingSum: 4230, trending: true, tags: ['coding', 'autocomplete', 'IDE'] },
  { name: 'Cursor', category: 'AI Coding', description: 'AI-first code editor built for pair programming with cutting-edge language models.', websiteLink: 'https://cursor.sh', pricing: 'Freemium', rating: 4.8, totalRatings: 600, ratingSum: 2880, trending: true, tags: ['IDE', 'coding', 'GPT-4'] },
  { name: 'Midjourney', category: 'AI Image Generation', description: 'Create stunning, photorealistic images from text prompts using Discord-based AI.', websiteLink: 'https://midjourney.com', pricing: 'Paid', rating: 4.7, totalRatings: 1100, ratingSum: 5170, trending: true, tags: ['image', 'art', 'design'] },
  { name: 'DALL-E 3', category: 'AI Image Generation', description: 'OpenAI\'s most advanced image generator integrated in ChatGPT for stunning visuals.', websiteLink: 'https://openai.com/dall-e-3', pricing: 'Freemium', rating: 4.5, totalRatings: 700, ratingSum: 3150, trending: false, tags: ['image', 'OpenAI', 'creative'] },
  { name: 'Stable Diffusion', category: 'AI Image Generation', description: 'Open-source text-to-image model you can run locally or use via hosted platforms.', websiteLink: 'https://stability.ai', pricing: 'Open Source', rating: 4.4, totalRatings: 850, ratingSum: 3740, trending: false, tags: ['image', 'open-source', 'local'] },
  { name: 'Runway ML', category: 'AI Video', description: 'Professional AI video generation and editing platform for creators and filmmakers.', websiteLink: 'https://runwayml.com', pricing: 'Freemium', rating: 4.6, totalRatings: 500, ratingSum: 2300, trending: true, tags: ['video', 'editing', 'generation'] },
  { name: 'Sora', category: 'AI Video', description: 'OpenAI\'s revolutionary text-to-video model capable of generating realistic videos.', websiteLink: 'https://openai.com/sora', pricing: 'Paid', rating: 4.7, totalRatings: 400, ratingSum: 1880, trending: true, tags: ['video', 'text-to-video', 'OpenAI'] },
  { name: 'Grammarly', category: 'AI Writing', description: 'AI-powered grammar checker and writing assistant for clear, engaging content.', websiteLink: 'https://grammarly.com', pricing: 'Freemium', rating: 4.5, totalRatings: 1400, ratingSum: 6300, trending: false, tags: ['writing', 'grammar', 'editing'] },
  { name: 'Jasper', category: 'AI Writing', description: 'Marketing-focused AI writing tool for blog posts, ads, and social media content.', websiteLink: 'https://jasper.ai', pricing: 'Paid', rating: 4.3, totalRatings: 600, ratingSum: 2580, trending: false, tags: ['marketing', 'copywriting', 'SEO'] },
  { name: 'Tabnine', category: 'AI Coding', description: 'AI code completion tool supporting 30+ programming languages across major IDEs.', websiteLink: 'https://tabnine.com', pricing: 'Freemium', rating: 4.3, totalRatings: 550, ratingSum: 2365, trending: false, tags: ['coding', 'autocomplete', 'multi-language'] },
];

const analyticsData = [
  { skill: 'Python', category: 'Technology', demand: 92, salary: 125000, growth: 18, jobPostings: 85000 },
  { skill: 'Machine Learning', category: 'AI/ML', demand: 88, salary: 145000, growth: 35, jobPostings: 62000 },
  { skill: 'JavaScript', category: 'Technology', demand: 90, salary: 115000, growth: 12, jobPostings: 95000 },
  { skill: 'React.js', category: 'Technology', demand: 85, salary: 120000, growth: 20, jobPostings: 72000 },
  { skill: 'Data Science', category: 'Data', demand: 82, salary: 135000, growth: 28, jobPostings: 58000 },
  { skill: 'Cloud (AWS)', category: 'Cloud', demand: 87, salary: 130000, growth: 30, jobPostings: 70000 },
  { skill: 'LLM / Prompt Engineering', category: 'AI/ML', demand: 78, salary: 155000, growth: 120, jobPostings: 35000 },
  { skill: 'Kubernetes', category: 'DevOps', demand: 75, salary: 138000, growth: 25, jobPostings: 42000 },
  { skill: 'Rust', category: 'Technology', demand: 55, salary: 140000, growth: 45, jobPostings: 18000 },
  { skill: 'SQL', category: 'Data', demand: 88, salary: 105000, growth: 8, jobPostings: 80000 },
  { skill: 'TypeScript', category: 'Technology', demand: 80, salary: 122000, growth: 40, jobPostings: 60000 },
  { skill: 'Deep Learning', category: 'AI/ML', demand: 72, salary: 150000, growth: 42, jobPostings: 40000 },
];

const seedBlogContent = `Artificial intelligence has transformed the way we work, create, and communicate. In 2025 and beyond, AI tools are no longer a luxury—they are a necessity for students, developers, entrepreneurs, and content creators alike.

## Why AI Tools Matter for Students

Students across all disciplines are discovering how AI tools can supercharge their productivity. Whether you are writing essays, solving math problems, learning a new language, or building software projects, there is now an AI tool designed specifically for your needs.

### Writing & Research Tools

**ChatGPT** remains the gold standard for conversational AI. Students can use it to brainstorm ideas, outline essays, explain complex concepts, and even practice for exams. The GPT-4 model can understand nuance, follow long conversations, and produce human-quality text.

**Claude by Anthropic** excels at long-form analysis and reasoning. It has a massive context window which makes it ideal for analyzing entire research papers, textbooks, or lengthy documents. Many students prefer Claude for its thoughtful, well-reasoned responses.

**Grammarly** is essential for anyone who writes in English. It goes beyond basic grammar checking to suggest stylistic improvements, clarity enhancements, and tone adjustments. The Premium version even helps with plagiarism detection.

### Coding & Development Tools

**GitHub Copilot** is a game-changer for computer science students. It integrates directly into VS Code and other editors, suggesting entire functions and blocks of code as you type. Students learning to program find that Copilot serves as an always-available tutor.

**Cursor** takes this even further with a fully AI-native IDE experience. You can describe what you want in plain English and watch the code write itself.

### Image & Design Tools

**Midjourney** allows students in design, marketing, or media programs to generate professional-quality images from text descriptions. Creating presentations, posters, and mockups has never been faster.

**DALL-E 3** integrated into ChatGPT makes image generation accessible to everyone without any design background.

## Getting the Most Out of AI Tools

The key to using AI effectively is understanding what these tools are good at and what they are not. AI tools excel at:

- Generating first drafts and outlines
- Explaining concepts in multiple ways
- Helping debug code and find errors
- Summarizing long documents
- Translating between languages
- Brainstorming creative ideas

However, students should always verify facts provided by AI, as these models can sometimes produce plausible-sounding but incorrect information (a phenomenon called "hallucination").

## The Future of AI in Education

Educational institutions are rapidly adapting their policies around AI. Rather than banning these tools outright, forward-thinking schools are teaching students how to use AI effectively and ethically. Learning to collaborate with AI is rapidly becoming a core skill for the modern workforce.

The students who thrive in the next decade will be those who master AI tools early, understand their limitations, and use them to augment their own creativity and critical thinking rather than replace it.

Start exploring these tools today—many offer free tiers that are powerful enough for most student use cases. Your future self will thank you.`;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aihub');
    console.log('Connected to MongoDB');

    await Tool.deleteMany({});
    await Analytics.deleteMany({});

    await Tool.insertMany(tools);
    console.log('✅ Tools seeded');

    await Analytics.insertMany(analyticsData);
    console.log('✅ Analytics seeded');

    // Create admin user
    let admin = await User.findOne({ email: 'admin@aihub.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@aihub.com',
        password: 'Admin@123456',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@aihub.com / Admin@123456)');
    }

    // Create sample blog
    await Blog.deleteMany({});
    await Blog.create({
      title: 'Best AI Tools for Students in 2025',
      slug: 'best-ai-tools-for-students-2025',
      content: seedBlogContent,
      excerpt: 'Discover the top AI tools every student should be using in 2025—from writing assistants to coding helpers and image generators.',
      author: admin._id,
      category: 'AI Tools',
      tags: ['AI tools', 'students', 'productivity', 'ChatGPT', 'education'],
      metaTitle: 'Best AI Tools for Students in 2025 | AI Hub',
      metaDescription: 'Discover the top 10 AI tools every student should use in 2025. From ChatGPT to Midjourney, boost your productivity and grades with these essential AI apps.',
      readTime: 8,
      views: 1247
    });
    console.log('✅ Blog seeded');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
