export type Language = 'he' | 'en';

export interface MenuItem {
  id: string;
  name: {
    he: string;
    en: string;
  };
  description: {
    he: string;
    en: string;
  };
  price?: number;
  category: string;
  imagePlaceholder?: string;
  kashrutNote?: {
    he: string;
    en: string;
  };
  isSpecialty?: boolean;
}

export interface MenuCategory {
  id: string;
  name: {
    he: string;
    en: string;
  };
  iconName: string;
  description?: {
    he: string;
    en: string;
  };
}

export interface GalleryItem {
  id: string;
  title: {
    he: string;
    en: string;
  };
  caption: {
    he: string;
    en: string;
  };
  imageSrc: string;
  aspectRatio: string;
}

export interface StrengthItem {
  id: string;
  title: {
    he: string;
    en: string;
  };
  description: {
    he: string;
    en: string;
  };
  iconName: string;
}
