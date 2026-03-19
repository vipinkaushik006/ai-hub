export const mockTools = [
  { _id: '1', name: 'ChatGPT', slug: 'chatgpt', category: 'AI Writing', description: 'Advanced conversational AI by OpenAI for writing, coding, analysis, and more.', websiteLink: 'https://chat.openai.com', pricing: 'Freemium', rating: 4.8, trending: true, featured: true, tags: ['chatbot', 'writing', 'GPT-4'], logoUrl: '' },
  { _id: '2', name: 'Claude', slug: 'claude', category: 'AI Writing', description: "Anthropic's intelligent AI for complex reasoning, analysis, and creative writing.", websiteLink: 'https://claude.ai', pricing: 'Freemium', rating: 4.9, trending: true, featured: true, tags: ['chatbot', 'reasoning'], logoUrl: '' },
  { _id: '3', name: 'GitHub Copilot', slug: 'github-copilot', category: 'AI Coding', description: 'AI pair programmer that suggests code completions and entire functions in real time.', websiteLink: 'https://github.com/features/copilot', pricing: 'Paid', rating: 4.7, trending: true, tags: ['coding', 'IDE'], logoUrl: '' },
  { _id: '4', name: 'Cursor', slug: 'cursor', category: 'AI Coding', description: 'AI-first code editor built for pair programming with cutting-edge language models.', websiteLink: 'https://cursor.sh', pricing: 'Freemium', rating: 4.8, trending: true, tags: ['IDE', 'coding'], logoUrl: '' },
  { _id: '5', name: 'Midjourney', slug: 'midjourney', category: 'AI Image Generation', description: 'Create stunning, photorealistic images from text prompts using Discord-based AI.', websiteLink: 'https://midjourney.com', pricing: 'Paid', rating: 4.7, trending: true, tags: ['image', 'art', 'design'], logoUrl: '' },
  { _id: '6', name: 'DALL-E 3', slug: 'dall-e-3', category: 'AI Image Generation', description: "OpenAI's most advanced image generator integrated in ChatGPT for stunning visuals.", websiteLink: 'https://openai.com/dall-e-3', pricing: 'Freemium', rating: 4.5, trending: false, tags: ['image', 'OpenAI'], logoUrl: '' },
  { _id: '7', name: 'Runway ML', slug: 'runway-ml', category: 'AI Video', description: 'Professional AI video generation and editing platform for creators and filmmakers.', websiteLink: 'https://runwayml.com', pricing: 'Freemium', rating: 4.6, trending: true, tags: ['video', 'editing'], logoUrl: '' },
  { _id: '8', name: 'Sora', slug: 'sora', category: 'AI Video', description: "OpenAI's text-to-video model capable of generating cinematic video clips from prompts.", websiteLink: 'https://openai.com/sora', pricing: 'Paid', rating: 4.7, trending: true, tags: ['video', 'text-to-video'], logoUrl: '' },
  { _id: '9', name: 'Grammarly', slug: 'grammarly', category: 'AI Writing', description: 'AI-powered grammar checker and writing assistant for clear, engaging content.', websiteLink: 'https://grammarly.com', pricing: 'Freemium', rating: 4.5, trending: false, tags: ['writing', 'grammar'], logoUrl: '' },
  { _id: '10', name: 'Tabnine', slug: 'tabnine', category: 'AI Coding', description: 'AI code completion tool supporting 30+ programming languages across major IDEs.', websiteLink: 'https://tabnine.com', pricing: 'Freemium', rating: 4.3, trending: false, tags: ['coding', 'autocomplete'], logoUrl: '' },
  { _id: '11', name: 'Stable Diffusion', slug: 'stable-diffusion', category: 'AI Image Generation', description: 'Open-source text-to-image model you can run locally or use via hosted platforms.', websiteLink: 'https://stability.ai', pricing: 'Open Source', rating: 4.4, trending: false, tags: ['image', 'open-source'], logoUrl: '' },
  { _id: '12', name: 'Jasper', slug: 'jasper', category: 'AI Writing', description: 'Marketing-focused AI writing tool for blog posts, ads, and social media content.', websiteLink: 'https://jasper.ai', pricing: 'Paid', rating: 4.3, trending: false, tags: ['marketing', 'copywriting'], logoUrl: '' },
];

export const mockAnalytics = [
  { skill: 'Python', category: 'Technology', demand: 92, salary: 125000, growth: 18, jobPostings: 85000 },
  { skill: 'Machine Learning', category: 'AI/ML', demand: 88, salary: 145000, growth: 35, jobPostings: 62000 },
  { skill: 'JavaScript', category: 'Technology', demand: 90, salary: 115000, growth: 12, jobPostings: 95000 },
  { skill: 'React.js', category: 'Technology', demand: 85, salary: 120000, growth: 20, jobPostings: 72000 },
  { skill: 'Data Science', category: 'Data', demand: 82, salary: 135000, growth: 28, jobPostings: 58000 },
  { skill: 'Cloud (AWS)', category: 'Cloud', demand: 87, salary: 130000, growth: 30, jobPostings: 70000 },
  { skill: 'LLM Engineering', category: 'AI/ML', demand: 78, salary: 155000, growth: 120, jobPostings: 35000 },
  { skill: 'Kubernetes', category: 'DevOps', demand: 75, salary: 138000, growth: 25, jobPostings: 42000 },
  { skill: 'TypeScript', category: 'Technology', demand: 80, salary: 122000, growth: 40, jobPostings: 60000 },
  { skill: 'SQL', category: 'Data', demand: 88, salary: 105000, growth: 8, jobPostings: 80000 },
];

export const mockBlogs = [
  { _id: '1', title: 'Best AI Tools for Students in 2025', slug: 'best-ai-tools-for-students-2025', excerpt: 'Discover the top AI tools every student should be using in 2025—from writing assistants to coding helpers and image generators.', category: 'AI Tools', tags: ['AI tools', 'students', 'productivity'], readTime: 8, views: 1247, createdAt: '2025-01-15', author: { name: 'Admin' }, coverImage: '' },
  { _id: '2', title: 'Top Programming Languages to Learn in 2026', slug: 'top-programming-languages-2026', excerpt: 'An in-depth look at which programming languages are dominating job boards and salaries in 2026.', category: 'Programming', tags: ['programming', 'career', 'languages'], readTime: 10, views: 2341, createdAt: '2025-01-10', author: { name: 'Admin' }, coverImage: '' },
  { _id: '3', title: 'AI vs Data Science: Which Career Path is Right for You?', slug: 'ai-vs-data-science-career', excerpt: 'A detailed comparison of AI engineering and data science career paths—salaries, skills, growth prospects, and more.', category: 'Career', tags: ['AI', 'data science', 'career'], readTime: 12, views: 3102, createdAt: '2025-01-05', author: { name: 'Admin' }, coverImage: '' },
];
