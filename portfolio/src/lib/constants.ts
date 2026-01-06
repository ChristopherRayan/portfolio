export const BLOG_CATEGORIES = [
  "Web Development",
  "AI",
  "Projects",
  "Cyber Security",
  "Networking",
  "Careers"
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
