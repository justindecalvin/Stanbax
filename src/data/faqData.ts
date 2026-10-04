import { FAQItem, FAQSectionContent } from '../types';

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions',
    question: 'How do I enroll my child at Stanbax Schools Ibadan?',
    answer: 'Admissions are open for Crèche, Nursery, Primary, and Junior/Senior Secondary classes. You can submit an online application via this portal, download our entrance form, or visit our main campus beside Ikolaba High School, Ibadan.'
  },
  {
    id: 'faq-2',
    category: 'Academics',
    question: 'What curriculum does Stanbax Schools follow?',
    answer: 'We deliver a dual British-Nigerian curriculum that integrates the Nigerian National Curriculum (NERDC / WAEC / NECO) with the British Cambridge Primary, Checkpoint, and IGCSE standards.'
  },
  {
    id: 'faq-3',
    category: 'Tuition & Fees',
    question: 'Are installment payment plans available for tuition?',
    answer: 'Yes! Stanbax Schools offers flexible installment payment arrangements through the Bursary (typically 60% upon resumption, and the remaining 40% before mid-term).'
  },
  {
    id: 'faq-4',
    category: 'Facilities & Security',
    question: 'Does the school provide bus transportation in Ibadan?',
    answer: 'Yes, our fleet of air-conditioned school buses with trained drivers and bus minders services major areas including Bodija, Jericho, Oluyole, Ring Road, Agodi GRA, Akobo, and Samonda.'
  },
  {
    id: 'faq-5',
    category: 'AI & Innovation',
    question: 'What is Calvin AI and how does it support students?',
    answer: 'Calvin AI is our dedicated 24/7 academic tutor and school guide. It is directly grounded in our approved Nigerian-British scheme of work, providing step-by-step math derivations, science formulas, and exam guidance for all enrolled scholars.'
  }
];

export const DEFAULT_FAQ_CONTENT: FAQSectionContent = {
  badge: 'Frequently Asked Questions',
  title: 'Everything You Need to Know About Stanbax Schools',
  subtitle: 'Find clear answers to questions regarding our admissions process, dual British-Nigerian curriculum, school fees, and student life.'
};
