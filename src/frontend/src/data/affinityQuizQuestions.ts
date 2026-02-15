export interface AffinityAnswer {
  text: string;
  scores: {
    kazeyori?: number;
    haruna?: number;
    sankei?: number;
    aurelian?: number;
    harusuke?: number;
    mizuki?: number;
    kaze?: number;
    volt?: number;
    iwagami?: number;
  };
}

export interface AffinityQuestion {
  id: number;
  question: string;
  answers: AffinityAnswer[];
}

export const affinityQuizQuestions: AffinityQuestion[] = [
  {
    id: 1,
    question: "When conflict arises, how do you typically respond?",
    answers: [
      { text: "I try to understand everyone's feelings and find peace", scores: { kazeyori: 3, haruna: 2, mizuki: 1 } },
      { text: "I speak my mind loudly and don't back down", scores: { sankei: 3, harusuke: 1 } },
      { text: "I take charge and resolve it with authority", scores: { aurelian: 3, harusuke: 2 } },
      { text: "I stay calm and strike when the moment is right", scores: { kaze: 3, volt: 2, iwagami: 1 } }
    ]
  },
  {
    id: 2,
    question: "What's your leadership style?",
    answers: [
      { text: "I lead by example with strength and honor", scores: { aurelian: 3, harusuke: 2 } },
      { text: "I inspire others with positivity and energy", scores: { harusuke: 3, mizuki: 2, haruna: 1 } },
      { text: "I prefer to support from the sidelines", scores: { kazeyori: 2, volt: 2, iwagami: 1 } },
      { text: "I lead through action, not words", scores: { kaze: 3, sankei: 2 } }
    ]
  },
  {
    id: 3,
    question: "How do you handle your emotions?",
    answers: [
      { text: "I wear my heart on my sleeve", scores: { haruna: 3, mizuki: 2, kazeyori: 1 } },
      { text: "I keep them hidden and controlled", scores: { kaze: 3, volt: 2, iwagami: 1 } },
      { text: "I express them openly but with purpose", scores: { sankei: 2, harusuke: 2, aurelian: 1 } },
      { text: "I'm gentle and sensitive to others' feelings", scores: { kazeyori: 3, mizuki: 2 } }
    ]
  },
  {
    id: 4,
    question: "What drives you forward?",
    answers: [
      { text: "Protecting those I care about", scores: { kazeyori: 3, aurelian: 2, harusuke: 1 } },
      { text: "Proving my strength and skill", scores: { kaze: 3, sankei: 2, aurelian: 1 } },
      { text: "Bringing joy and energy to others", scores: { harusuke: 3, mizuki: 3, haruna: 2 } },
      { text: "Uncovering mysteries and hidden truths", scores: { iwagami: 3, volt: 1 } }
    ]
  },
  {
    id: 5,
    question: "How would your friends describe you?",
    answers: [
      { text: "Kind, innocent, and caring", scores: { kazeyori: 3, mizuki: 2 } },
      { text: "Organized, talkative, and emotional", scores: { haruna: 3, mizuki: 1 } },
      { text: "Hot-headed but cool when it counts", scores: { sankei: 3, harusuke: 1 } },
      { text: "Mysterious and unpredictable", scores: { iwagami: 3, kaze: 2, volt: 1 } }
    ]
  },
  {
    id: 6,
    question: "What's your fighting philosophy?",
    answers: [
      { text: "Fight with honor and protect the weak", scores: { aurelian: 3, harusuke: 2, kazeyori: 1 } },
      { text: "Strike fast, strike hard, end it quickly", scores: { kaze: 3, volt: 2, sankei: 1 } },
      { text: "Use strategy and adaptability", scores: { haruna: 2, iwagami: 2, volt: 1 } },
      { text: "Fight with passion and never give up", scores: { sankei: 3, harusuke: 2, mizuki: 1 } }
    ]
  },
  {
    id: 7,
    question: "What's your greatest fear?",
    answers: [
      { text: "Letting down the people who depend on me", scores: { kazeyori: 3, aurelian: 2, haruna: 1 } },
      { text: "Being weak or powerless", scores: { sankei: 2, kaze: 2, aurelian: 1 } },
      { text: "Losing my freedom or being controlled", scores: { volt: 3, mizuki: 2, iwagami: 1 } },
      { text: "Being forgotten or left behind", scores: { haruna: 2, harusuke: 2, kazeyori: 1 } }
    ]
  },
  {
    id: 8,
    question: "How do you approach challenges?",
    answers: [
      { text: "With careful planning and organization", scores: { haruna: 3, aurelian: 2 } },
      { text: "Head-on with full force", scores: { sankei: 3, harusuke: 2, kaze: 1 } },
      { text: "With a smile and unshakeable optimism", scores: { harusuke: 3, mizuki: 3 } },
      { text: "Quietly and efficiently, no wasted effort", scores: { kaze: 3, volt: 3, iwagami: 2 } }
    ]
  },
  {
    id: 9,
    question: "What's your ideal way to spend free time?",
    answers: [
      { text: "Relaxing and taking it easy", scores: { volt: 3, kazeyori: 2, mizuki: 1 } },
      { text: "Training or showing off my skills", scores: { mizuki: 3, sankei: 2, kaze: 1 } },
      { text: "Socializing and connecting with others", scores: { haruna: 3, harusuke: 3 } },
      { text: "Exploring mysteries or being alone", scores: { iwagami: 3, kaze: 2, volt: 1 } }
    ]
  },
  {
    id: 10,
    question: "What role do you play in your friend group?",
    answers: [
      { text: "The reliable leader everyone looks up to", scores: { aurelian: 3, harusuke: 2 } },
      { text: "The energetic one who keeps spirits high", scores: { harusuke: 3, mizuki: 2, haruna: 1 } },
      { text: "The quiet protector watching from the shadows", scores: { kaze: 3, kazeyori: 2, volt: 1 } },
      { text: "The wild card no one can predict", scores: { iwagami: 3, sankei: 2, volt: 1 } }
    ]
  }
];
