export type CharacterId = 
  | 'kazeyori'
  | 'haruna'
  | 'sankei'
  | 'aurelian'
  | 'harusuke'
  | 'mizuki'
  | 'kaze'
  | 'volt'
  | 'iwagami';

export interface CharacterScores {
  kazeyori: number;
  haruna: number;
  sankei: number;
  aurelian: number;
  harusuke: number;
  mizuki: number;
  kaze: number;
  volt: number;
  iwagami: number;
}

export interface CharacterMatch {
  characterId: CharacterId;
  soulResonance: number;
}
