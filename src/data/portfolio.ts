export interface Profile {
  name: string;
  title: string;
  headline: string;
  bioPoints: { emoji: string; text: string }[];
  skills: string[];
  contacts: { label: string; value: string; url?: string; icon: string; tooltip?: string }[];
}

export interface Education {
  institution: string;
  period: string;
  details: string[];
  status: string;
}

export interface Certification {
  category: string;
  categoryIcon: string;
  items: { name: string; date: string; detail?: string }[];
}

export interface Project {
  title: string;
  period: string;
  affiliation: string;
  description: string;
  highlights: string[];
  techs: string[];
  url?: string;
  github?: string;
}

export interface Award {
  title: string;
  grade: string;
  issuer: string;
  date: string;
  affiliation: string;
  description: string;
}

export interface Album {
  artist: string;
  title: string;
  comment: string;
}

export interface Book {
  author: string;
  titles: string[];
  comment: string;
}

export interface Game {
  title: string;
  platform: string;
  comment: string;
}

export interface Hobby {
  label: string;
  emoji: string;
}
