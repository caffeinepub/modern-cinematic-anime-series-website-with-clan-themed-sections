export interface QuizAnswer {
  text: string;
  scores: {
    moon?: number;
    fire?: number;
    water?: number;
    sun?: number;
    earth?: number;
    wind?: number;
    lightning?: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When faced with a difficult challenge, what's your first instinct?",
    answers: [
      { text: "Analyze the situation carefully before acting", scores: { moon: 3, water: 2 } },
      { text: "Charge forward with confidence and courage", scores: { fire: 3, sun: 2 } },
      { text: "Find a creative or unconventional solution", scores: { wind: 3, lightning: 1 } },
      { text: "Stand firm and endure whatever comes", scores: { earth: 3, sun: 1 } }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to spend your free time?",
    answers: [
      { text: "Reflecting quietly, reading, or meditating", scores: { moon: 3, water: 1 } },
      { text: "Training, competing, or pushing your limits", scores: { fire: 2, lightning: 2 } },
      { text: "Exploring new places or trying new experiences", scores: { wind: 3, lightning: 1 } },
      { text: "Spending time with family and close friends", scores: { earth: 3, sun: 2 } }
    ]
  },
  {
    id: 3,
    question: "What role do you naturally take in a group?",
    answers: [
      { text: "The strategist who plans ahead", scores: { water: 3, moon: 2 } },
      { text: "The leader who inspires others", scores: { sun: 3, fire: 2 } },
      { text: "The protector who keeps everyone safe", scores: { earth: 3, sun: 1 } },
      { text: "The scout who finds new opportunities", scores: { wind: 3, lightning: 2 } }
    ]
  },
  {
    id: 4,
    question: "How do you handle conflict?",
    answers: [
      { text: "Seek to understand all perspectives first", scores: { moon: 2, water: 3 } },
      { text: "Confront it directly and decisively", scores: { fire: 3, lightning: 2 } },
      { text: "Find a diplomatic solution that honors everyone", scores: { sun: 3, water: 1 } },
      { text: "Stay grounded and wait for the right moment", scores: { earth: 3, moon: 1 } }
    ]
  },
  {
    id: 5,
    question: "What motivates you most?",
    answers: [
      { text: "Discovering hidden truths and deeper meaning", scores: { moon: 3, water: 1 } },
      { text: "Achieving greatness and proving yourself", scores: { fire: 3, sun: 2 } },
      { text: "Protecting those you care about", scores: { earth: 3, sun: 2 } },
      { text: "Freedom and the thrill of the unknown", scores: { wind: 3, lightning: 1 } }
    ]
  },
  {
    id: 6,
    question: "How do you make important decisions?",
    answers: [
      { text: "Trust your intuition and inner wisdom", scores: { moon: 3, wind: 1 } },
      { text: "Follow your passion and heart", scores: { fire: 3, sun: 1 } },
      { text: "Carefully weigh all options logically", scores: { water: 3, earth: 2 } },
      { text: "Act quickly based on instinct", scores: { lightning: 3, wind: 2 } }
    ]
  },
  {
    id: 7,
    question: "What's your greatest strength?",
    answers: [
      { text: "Emotional intelligence and empathy", scores: { water: 3, moon: 2 } },
      { text: "Unwavering determination and willpower", scores: { fire: 2, earth: 2, sun: 1 } },
      { text: "Adaptability and quick thinking", scores: { wind: 2, lightning: 2, water: 1 } },
      { text: "Wisdom and deep understanding", scores: { moon: 3, sun: 1 } }
    ]
  },
  {
    id: 8,
    question: "How do you respond to change?",
    answers: [
      { text: "Embrace it as an opportunity for growth", scores: { wind: 3, water: 2 } },
      { text: "Face it head-on with courage", scores: { fire: 3, lightning: 1 } },
      { text: "Observe carefully before adapting", scores: { moon: 3, water: 1 } },
      { text: "Remain steady and trust in your foundation", scores: { earth: 3, sun: 1 } }
    ]
  },
  {
    id: 9,
    question: "What kind of environment do you thrive in?",
    answers: [
      { text: "Quiet, mysterious, and contemplative spaces", scores: { moon: 3, water: 1 } },
      { text: "Dynamic, energetic, and competitive settings", scores: { fire: 2, lightning: 2 } },
      { text: "Open, free, and ever-changing landscapes", scores: { wind: 3, lightning: 1 } },
      { text: "Stable, traditional, and grounded communities", scores: { earth: 3, sun: 2 } }
    ]
  },
  {
    id: 10,
    question: "What's your approach to learning new skills?",
    answers: [
      { text: "Study deeply and master the fundamentals", scores: { moon: 2, earth: 2, water: 1 } },
      { text: "Jump in and learn through intense practice", scores: { fire: 3, lightning: 2 } },
      { text: "Experiment freely and find your own way", scores: { wind: 3, water: 1 } },
      { text: "Learn from experienced mentors and tradition", scores: { earth: 3, sun: 2 } }
    ]
  }
];
