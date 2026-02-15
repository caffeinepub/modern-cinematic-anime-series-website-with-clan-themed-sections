import { CharacterId } from '../components/affinity/affinityTypes';

export interface AffinityCharacter {
  id: CharacterId;
  name: string;
  portraitPath: string;
  personality: string;
  whyYouMatch: string;
  fightingStyle: string;
  roleInStory: string;
}

export const affinityCharacters: AffinityCharacter[] = [
  {
    id: 'kazeyori',
    name: 'Kazeyori',
    portraitPath: '/assets/generated/affinity-kazeyori-portrait.dim_1024x1024.png',
    personality: 'Kind-hearted and innocent, you see the good in everyone. Your gentle nature and pure intentions make you a beacon of hope in dark times.',
    whyYouMatch: 'Like Kazeyori, you lead with compassion and empathy. You believe in protecting others and finding peaceful solutions, even when the world around you is chaotic.',
    fightingStyle: 'Defensive and protective techniques that prioritize shielding allies. Your abilities focus on barriers, healing, and support magic that keeps your team safe.',
    roleInStory: 'The Pure Heart - A young warrior whose innocence and kindness inspire others to be better. Despite facing darkness, you never lose sight of what truly matters.'
  },
  {
    id: 'haruna',
    name: 'Haruna',
    portraitPath: '/assets/generated/affinity-haruna-portrait.dim_1024x1024.png',
    personality: 'Talkative, organized, and deeply emotional. You express yourself freely and care deeply about maintaining order and connection with those around you.',
    whyYouMatch: 'Like Haruna, you wear your heart on your sleeve and aren\'t afraid to speak up. Your organizational skills and emotional intelligence make you the glue that holds groups together.',
    fightingStyle: 'Strategic and coordinated combat that relies on planning and teamwork. You excel at reading situations and adapting your approach based on your allies\' needs.',
    roleInStory: 'The Heart of the Team - Your emotional depth and communication skills keep everyone connected. You remind others why they fight and what they\'re fighting for.'
  },
  {
    id: 'sankei',
    name: 'Sankei',
    portraitPath: '/assets/generated/affinity-sankei-portrait.dim_1024x1024.png',
    personality: 'Hot-headed yet surprisingly nonchalant when it counts. You have a fiery spirit but know when to keep your cool under pressure.',
    whyYouMatch: 'Like Sankei, you\'re passionate and direct, never backing down from a challenge. But beneath that fierce exterior, you have the composure to make smart decisions when it matters most.',
    fightingStyle: 'Aggressive and explosive techniques that overwhelm opponents with raw power. Your fighting style is direct and intimidating, leaving no room for hesitation.',
    roleInStory: 'The Wild Fire - Your intensity and passion drive you forward, but your hidden tactical mind makes you more dangerous than enemies expect.'
  },
  {
    id: 'aurelian',
    name: 'Aurelian',
    portraitPath: '/assets/generated/affinity-aurelian-portrait.dim_1024x1024.png',
    personality: 'A natural leader with unwavering strength and honor. You command respect through your actions and inspire others to rise to their potential.',
    whyYouMatch: 'Like Aurelian, you embody leadership and strength. People naturally look to you for guidance, and you take that responsibility seriously, always striving to protect and uplift those around you.',
    fightingStyle: 'Powerful and honorable combat techniques that demonstrate mastery and control. Your abilities are both devastating and precise, reflecting years of disciplined training.',
    roleInStory: 'The Noble Commander - You stand at the forefront of every battle, leading by example. Your strength isn\'t just physical—it\'s the courage to do what\'s right, no matter the cost.'
  },
  {
    id: 'harusuke',
    name: 'Harusuke',
    portraitPath: '/assets/generated/affinity-harusuke-portrait.dim_1024x1024.png',
    personality: 'Always happy, energetic, and strong. Your infectious optimism and unwavering positivity lift everyone around you, even in the darkest moments.',
    whyYouMatch: 'Like Harusuke, you face every challenge with a smile and unshakeable confidence. Your strength comes not just from power, but from your ability to inspire hope and joy in others.',
    fightingStyle: 'Dynamic and energetic combat that combines power with agility. Your techniques are flashy and uplifting, turning every battle into a display of unstoppable spirit.',
    roleInStory: 'The Radiant Champion - Your positivity is your greatest weapon. You prove that strength and kindness aren\'t opposites—they\'re two sides of the same heroic spirit.'
  },
  {
    id: 'mizuki',
    name: 'Mizuki',
    portraitPath: '/assets/generated/affinity-mizuki-portrait.dim_1024x1024.png',
    personality: 'Innocent, happy, playful, and surprisingly skilled. You approach life with childlike wonder while possessing impressive abilities that catch others off guard.',
    whyYouMatch: 'Like Mizuki, you maintain a playful spirit while harboring hidden depths. Your joy is genuine, but you\'re more capable than anyone expects, making you a delightful surprise.',
    fightingStyle: 'Acrobatic and unpredictable techniques that blend playfulness with precision. Your fighting style is as entertaining as it is effective, keeping opponents guessing.',
    roleInStory: 'The Joyful Prodigy - You remind everyone that power doesn\'t require seriousness. Your playful nature hides a prodigy\'s skill, making you both endearing and formidable.'
  },
  {
    id: 'kaze',
    name: 'Kaze',
    portraitPath: '/assets/generated/affinity-kaze-portrait.dim_1024x1024.png',
    personality: 'Dangerous, strong, and lightning-quick. You move through life with lethal efficiency, speaking through actions rather than words.',
    whyYouMatch: 'Like Kaze, you possess a quiet intensity that others find both intimidating and magnetic. Your strength isn\'t loud—it\'s the silent promise that you\'re always ready for anything.',
    fightingStyle: 'Swift and lethal techniques that end fights before they begin. Your combat style emphasizes speed, precision, and overwhelming force delivered in an instant.',
    roleInStory: 'The Silent Storm - You are the blade in the darkness, the protector who strikes without warning. Your presence alone is enough to shift the tide of battle.'
  },
  {
    id: 'volt',
    name: 'Volt',
    portraitPath: '/assets/generated/affinity-volt-portrait.dim_1024x1024.png',
    personality: 'Nonchalant, lazy, yet incredibly fast when motivated. You conserve energy until the moment demands action, then move with shocking speed.',
    whyYouMatch: 'Like Volt, you understand that efficiency matters more than constant effort. Your laid-back attitude masks a sharp mind and explosive potential that activates when it counts.',
    fightingStyle: 'Minimal-effort techniques that maximize results. Your fighting style is about doing exactly what\'s needed—no more, no less—with devastating speed when you choose to act.',
    roleInStory: 'The Reluctant Ace - You\'d rather not get involved, but when you do, everyone remembers why you\'re not to be underestimated. Your speed is legendary among those who\'ve seen it.'
  },
  {
    id: 'iwagami',
    name: 'Iwagami',
    portraitPath: '/assets/generated/affinity-iwagami-portrait.dim_1024x1024.png',
    personality: 'Funny yet deeply mysterious. You use humor to deflect while hiding layers of secrets and knowledge that few ever discover.',
    whyYouMatch: 'Like Iwagami, you\'re an enigma wrapped in laughter. Your jokes and lighthearted nature mask a complex inner world filled with hidden truths and untold stories.',
    fightingStyle: 'Unpredictable and mysterious techniques that confuse and disorient opponents. Your fighting style is as much about psychological warfare as physical combat.',
    roleInStory: 'The Laughing Enigma - No one truly knows your full story, and that\'s exactly how you like it. Your humor disarms while your mysteries intrigue, making you unforgettable.'
  }
];

export function getCharacterById(id: CharacterId): AffinityCharacter | undefined {
  return affinityCharacters.find(char => char.id === id);
}
