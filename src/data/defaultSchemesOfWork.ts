import { SchemeOfWork } from '../types';

export const defaultSchemesOfWork: SchemeOfWork[] = [
  {
    id: 'scheme-math-sss2',
    subjectName: 'Mathematics',
    classLevel: 'SSS 2',
    term: '2nd Term',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: 'Comprehensive 12-week senior syllabus covering Quadratic Equations, Trigonometric Ratios, Simultaneous Equations, and Coordinate Geometry.',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Algebraic Processes & Quadratic Equations',
        subtopics: ['Factorization Method', 'Completing the Square', 'The Quadratic Formula'],
        learningObjectives: ['State and apply the general quadratic formula x = (-b ± √(b² - 4ac)) / (2a)', 'Evaluate the discriminant Δ to test roots'],
        keyFormulasOrTerms: ['Δ = b² - 4ac', 'x = (-b ± √(b² - 4ac)) / (2a)'],
        suggestedActivities: 'Solve worked examples from WAEC past questions and plot parabolic graphs.'
      },
      {
        week: 2,
        topic: 'Simultaneous Linear & Quadratic Equations',
        subtopics: ['Substitution Method', 'Elimination Method', 'Graphical Interpretation'],
        learningObjectives: ['Solve a pair of simultaneous equations where one is linear and the other quadratic'],
        keyFormulasOrTerms: ['Intersection points', 'Root coordinates (x, y)'],
        suggestedActivities: 'Determine points of intersection of a line and a curve.'
      },
      {
        week: 3,
        topic: 'Trigonometric Ratios & Sine/Cosine Rules',
        subtopics: ['Right-angled Triangles (SOH CAH TOA)', 'Sine Rule: a/sin A = b/sin B', 'Cosine Rule: a² = b² + c² - 2bc cos A'],
        learningObjectives: ['Apply Sine and Cosine rules to solve acute and obtuse triangles'],
        keyFormulasOrTerms: ['a / sin A = b / sin B = c / sin C', 'a² = b² + c² - 2bc cos A'],
        suggestedActivities: 'Surveying exercises calculating bearings and distances.'
      }
    ],
    uploadedFileName: 'Official_NERDC_Mathematics_SSS2.pdf',
    uploadedAt: '2026-01-10',
    isAiLearned: true,
    lastUpdated: '2026-01-10'
  },
  {
    id: 'scheme-phys-sss2',
    subjectName: 'Physics',
    classLevel: 'SSS 2',
    term: '2nd Term',
    curriculumStandard: 'NERDC & Cambridge IGCSE',
    summary: 'Mechanics, Heat Energy, Linear Momentum, and Newton\'s Laws of Motion with laboratory experiments.',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Newton\'s Laws of Motion & Momentum',
        subtopics: ['Inertia', 'Force F = ma', 'Action and Reaction', 'Conservation of Momentum'],
        learningObjectives: ['Define the three laws of motion and solve numerical problems on impulse and momentum'],
        keyFormulasOrTerms: ['F = ma', 'p = mv', 'Impulse = FΔt = m(v - u)'],
        suggestedActivities: 'Trolley dynamics laboratory experiment using ticker-tape timer.'
      },
      {
        week: 2,
        topic: 'Work, Energy and Power',
        subtopics: ['Mechanical Work', 'Kinetic Energy Ek = 1/2 mv²', 'Potential Energy Ep = mgh', 'Power = W / t'],
        learningObjectives: ['Calculate work done by variable and constant forces', 'State the principle of conservation of energy'],
        keyFormulasOrTerms: ['Work = F × d', 'Ek = 1/2 mv²', 'Ep = mgh'],
        suggestedActivities: 'Laboratory determination of power developed by a student running up stairs.'
      }
    ],
    uploadedFileName: 'Official_Physics_Curriculum_SSS2.pdf',
    uploadedAt: '2026-01-10',
    isAiLearned: true,
    lastUpdated: '2026-01-10'
  },
  {
    id: 'scheme-bio-sss2',
    subjectName: 'Biology',
    classLevel: 'SSS 2',
    term: '2nd Term',
    curriculumStandard: 'NERDC & Cambridge IGCSE',
    summary: 'Cell Physiology, Photosynthesis, Mineral Nutrition, and Transport Systems in Plants and Animals.',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Plant Nutrition & Photosynthesis',
        subtopics: ['Light-dependent Reaction', 'Calvin Cycle (Light-independent)', 'Chloroplast Anatomy', 'Limiting Factors'],
        learningObjectives: ['State the balanced chemical equation 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'Describe the role of chlorophyll and photolysis of water'],
        keyFormulasOrTerms: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'Photolysis', 'RuBisCO'],
        suggestedActivities: 'Starch test on variegated hibiscus leaf after sunlight exposure.'
      }
    ],
    uploadedFileName: 'Official_Biology_Curriculum_SSS2.pdf',
    uploadedAt: '2026-01-10',
    isAiLearned: true,
    lastUpdated: '2026-01-10'
  }
];
