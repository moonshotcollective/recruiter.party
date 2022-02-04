export interface Education {
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Image {
  original: {
    src: string;
  };
}

export interface BasicProfile {
  background: Image;
  image: Image;
  emoji: string;
  name: string;
  description: string;
  homeLocation: string;
  residenceCountry: string;
  [key: string]: any;
}

export interface PublicProfile {
  skillTags: string[];
  experiences: Experience[];
  educations: Education[];
  [key: string]: any;
}

export interface DecryptedData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  twitter: string;
  [key: string]: any;
}