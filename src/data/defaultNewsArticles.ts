import { SchoolNewsArticle } from '../types';

export const DEFAULT_NEWS_ARTICLES: SchoolNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Stanbax Scholars Excel with 100% Distinction in WAEC and Cambridge IGCSE',
    slug: 'stanbax-scholars-excel-waec-cambridge-2026',
    excerpt: 'Our graduating scholars achieved straight A distinctions across Mathematics, Further Maths, Physics, and Chemistry.',
    content: 'Stanbax Schools Ibadan celebrates the extraordinary scholastic achievement of our graduating scholars. Through disciplined mentoring and our dual British-Nigerian curriculum, every candidate secured admission into premier universities globally.',
    category: 'Academic Honors',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    publishedAt: '2026-09-15',
    readTime: '3 min read',
    author: {
      id: 'auth-1',
      name: 'Mrs. Adebisi Folashade Bello',
      role: 'Principal Administrator',
      gradeOrTitle: 'Executive Director'
    },
    tags: ['WASSCE', 'Cambridge', 'Academics'],
    isFeatured: true
  },
  {
    id: 'news-2',
    title: 'Launch of the Stanbax Robotics & AI Innovation Hub for Junior & Senior Scholars',
    slug: 'launch-of-robotics-and-ai-hub',
    excerpt: 'A state-of-the-art laboratory equipped with 3D printers, microcontrollers, and Calvin AI tutoring consoles was officially commissioned.',
    content: 'In line with our mission to cultivate global innovators, Mrs. Adebisi Folashade Bello commissioned the new Robotics & Artificial Intelligence Innovation Hub.',
    category: 'STEM & Innovation',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-01',
    readTime: '4 min read',
    author: {
      id: 'auth-2',
      name: 'Engr. David Adeleke',
      role: 'Staff Patron',
      gradeOrTitle: 'Head of STEM'
    },
    tags: ['Robotics', 'AI', 'Innovation'],
    isFeatured: false
  }
];
