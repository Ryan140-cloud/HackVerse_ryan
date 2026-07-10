// Study Hub content — all topics + curated resources.
// Data-only, so the page stays lean and reusable elsewhere.

export const STUDY_TOPICS = [
  {
    slug: 'dsa',
    title: 'DSA',
    tagline: 'Data Structures & Algorithms',
    emoji: '🧮',
    color: 'from-fuchsia-500 to-purple-600',
    resources: [
      { name: 'NeetCode 150', type: 'Practice', href: 'https://neetcode.io/practice', level: 'Beginner' },
      { name: 'CS50 by Harvard', type: 'Course', href: 'https://cs50.harvard.edu/x/', level: 'Beginner' },
      { name: 'Grokking Algorithms (PDF)', type: 'PDF', href: 'https://www.manning.com/books/grokking-algorithms', level: 'Beginner' },
      { name: 'LeetCode Top Interview 150', type: 'Practice', href: 'https://leetcode.com/studyplan/top-interview-150/', level: 'Intermediate' },
      { name: 'CLRS — Introduction to Algorithms', type: 'Book', href: 'https://mitpress.mit.edu/9780262046305/', level: 'Advanced' },
    ],
    interviews: ['Reverse a linked list', 'Two-sum in O(n)', 'LRU cache from scratch', 'Median of two sorted arrays'],
  },
  {
    slug: 'web',
    title: 'Web Development',
    tagline: 'Frontend + Backend',
    emoji: '🌐',
    color: 'from-blue-500 to-indigo-600',
    resources: [
      { name: 'MDN Web Docs', type: 'Docs', href: 'https://developer.mozilla.org', level: 'Beginner' },
      { name: 'The Odin Project', type: 'Course', href: 'https://www.theodinproject.com/', level: 'Beginner' },
      { name: 'Next.js Learn', type: 'Course', href: 'https://nextjs.org/learn', level: 'Intermediate' },
      { name: 'Full-Stack Open (Helsinki)', type: 'Course', href: 'https://fullstackopen.com/en/', level: 'Intermediate' },
      { name: 'You Don’t Know JS (PDF)', type: 'PDF', href: 'https://github.com/getify/You-Dont-Know-JS', level: 'Intermediate' },
    ],
    interviews: ['Event loop in JS', 'Difference between SSR and SSG', 'Explain CORS', 'What is a service worker'],
  },
  {
    slug: 'ai',
    title: 'AI',
    tagline: 'Applied Artificial Intelligence',
    emoji: '🤖',
    color: 'from-emerald-500 to-teal-600',
    resources: [
      { name: 'DeepLearning.AI — AI for Everyone', type: 'Course', href: 'https://www.deeplearning.ai/courses/ai-for-everyone/', level: 'Beginner' },
      { name: 'LangChain Docs', type: 'Docs', href: 'https://python.langchain.com/', level: 'Intermediate' },
      { name: 'Prompt Engineering Guide', type: 'Docs', href: 'https://www.promptingguide.ai/', level: 'Beginner' },
      { name: 'Building LLM apps (Vercel AI SDK)', type: 'Docs', href: 'https://sdk.vercel.ai/docs', level: 'Intermediate' },
    ],
    interviews: ['What is a transformer', 'Difference between fine-tuning and RAG', 'Explain temperature and top-p', 'Design an AI chat backend'],
  },
  {
    slug: 'ml',
    title: 'Machine Learning',
    tagline: 'Foundations + Advanced',
    emoji: '📊',
    color: 'from-orange-500 to-red-500',
    resources: [
      { name: 'Andrew Ng — Machine Learning Specialization', type: 'Course', href: 'https://www.coursera.org/specializations/machine-learning-introduction', level: 'Beginner' },
      { name: 'Fast.ai — Practical Deep Learning', type: 'Course', href: 'https://course.fast.ai/', level: 'Intermediate' },
      { name: 'Hands-On ML with Scikit-learn (PDF)', type: 'PDF', href: 'https://github.com/ageron/handson-ml3', level: 'Intermediate' },
      { name: 'Papers With Code', type: 'Practice', href: 'https://paperswithcode.com/', level: 'Advanced' },
    ],
    interviews: ['Bias vs Variance', 'When to use L1 vs L2', 'Explain gradient descent', 'How does batch normalization work'],
  },
  {
    slug: 'cloud',
    title: 'Cloud',
    tagline: 'AWS · GCP · Azure',
    emoji: '☁️',
    color: 'from-sky-500 to-cyan-600',
    resources: [
      { name: 'AWS Cloud Practitioner Essentials', type: 'Course', href: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', level: 'Beginner' },
      { name: 'Google Cloud Skills Boost', type: 'Course', href: 'https://www.cloudskillsboost.google/', level: 'Beginner' },
      { name: 'Kubernetes the Hard Way', type: 'Guide', href: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', level: 'Advanced' },
      { name: 'Terraform Registry', type: 'Docs', href: 'https://registry.terraform.io/', level: 'Intermediate' },
    ],
    interviews: ['VPC vs subnet', 'Difference between IAM role and IAM user', 'What is a load balancer', 'Explain blue-green deployment'],
  },
  {
    slug: 'cyber',
    title: 'Cyber Security',
    tagline: 'Offense + Defense',
    emoji: '🛡️',
    color: 'from-rose-500 to-pink-600',
    resources: [
      { name: 'TryHackMe', type: 'Practice', href: 'https://tryhackme.com/', level: 'Beginner' },
      { name: 'PortSwigger Web Security Academy', type: 'Course', href: 'https://portswigger.net/web-security', level: 'Intermediate' },
      { name: 'HackTheBox', type: 'Practice', href: 'https://www.hackthebox.com/', level: 'Intermediate' },
      { name: 'OWASP Top 10 (PDF)', type: 'PDF', href: 'https://owasp.org/www-project-top-ten/', level: 'Beginner' },
    ],
    interviews: ['XSS vs CSRF', 'How does JWT work', 'What is a zero-day', 'Explain public-key cryptography'],
  },
  {
    slug: 'system-design',
    title: 'System Design',
    tagline: 'Design large-scale systems',
    emoji: '🏗️',
    color: 'from-amber-500 to-orange-600',
    resources: [
      { name: 'System Design Primer', type: 'Guide', href: 'https://github.com/donnemartin/system-design-primer', level: 'Beginner' },
      { name: 'ByteByteGo Newsletter', type: 'Blog', href: 'https://blog.bytebytego.com/', level: 'Intermediate' },
      { name: 'Designing Data-Intensive Applications (Book)', type: 'Book', href: 'https://dataintensive.net/', level: 'Advanced' },
      { name: 'High Scalability', type: 'Blog', href: 'http://highscalability.com/', level: 'Advanced' },
    ],
    interviews: ['Design URL shortener', 'Design WhatsApp', 'Design Instagram feed', 'CAP theorem in practice'],
  },
  {
    slug: 'interviews',
    title: 'Interview Questions',
    tagline: 'Behavioural + technical prep',
    emoji: '💼',
    color: 'from-slate-500 to-zinc-700',
    resources: [
      { name: 'Cracking the Coding Interview', type: 'Book', href: 'https://www.crackingthecodinginterview.com/', level: 'Beginner' },
      { name: 'STAR method template', type: 'Guide', href: 'https://en.wikipedia.org/wiki/Situation,_task,_action,_result', level: 'Beginner' },
      { name: 'Tech Interview Handbook', type: 'Guide', href: 'https://www.techinterviewhandbook.org/', level: 'Intermediate' },
      { name: 'Pramp — Mock Interviews', type: 'Practice', href: 'https://www.pramp.com/', level: 'Intermediate' },
    ],
    interviews: ['Tell me about yourself', 'Why this company', 'Describe a hard bug you fixed', 'Where do you see yourself in 5 years'],
  },
];

export function findTopic(slug) {
  return STUDY_TOPICS.find((t) => t.slug === slug) || null;
}
