/**
 * AUTHORITATIVE BUSINESS INFORMATION — SOURCE OF TRUTH
 * Yehudales (יהודלס) — Premium Takeaway & WhatsApp Food Brand, Ashdod
 * 
 * NEVER invent business facts. Placeholders are clearly identified.
 */

import { MenuCategory, MenuItem, GalleryItem, StrengthItem } from '../types';

export const BUSINESS_CONFIG = {
  // Identifiers
  name: {
    he: 'יהודלס',
    en: 'Yehudales'
  },
  tagline: {
    he: 'חווית ליל שישי טעם ברמה גבוהה',
    en: 'A Friday Night Experience with Supreme Taste'
  },
  subtitle: {
    he: 'הצ\'ולנט הכי טעים בעיר',
    en: 'The Tastiest Cholent in Town'
  },
  description: {
    he: 'יהודלס הוא מותג אוכל פרימיום בטייק אווי והזמנות WhatsApp באשדוד, הפועל כ-6 שנים. אנו מציעים חוויית ליל שישי אותנטית עם צ\'ולנט עשיר, בשרים מובחרים, שירות ללא פשרות ורמת ניקיון יוצאת דופן.',
    en: 'Yehudales is a premier takeaway and WhatsApp food brand based in Ashdod, operating for approximately 6 years. Offering an authentic Shabbat-evening feast with rich cholent, prime meats, impeccable service, and spotless cleanliness.'
  },

  // Contact & Location (Exact supplied data)
  location: {
    city: {
      he: 'אשדוד',
      en: 'Ashdod'
    },
    address: {
      he: 'אדמו"ר מבעלזא 7, אשדוד',
      en: 'Admor MiBelz 7, Ashdod, Israel'
    },
    googleMapsUrl: '[GOOGLE_MAPS_URL]', // Authoritative placeholder until provided
    takeawayNote: {
      he: 'טייק אווי והזמנות בוואטסאפ בלבד • ללא מקומות ישיבה • איסוף עצמי בתיאום מראש',
      en: 'Takeaway & WhatsApp Orders Only • No Dine-in Seating • Self-pickup by arrangement'
    }
  },

  contact: {
    phone: '0542251438',
    phoneFormatted: '054-225-1438',
    phoneInternational: '+972542251438',
    email: 'yehudales.ashdod@gmail.com',
  },

  // Centralized WhatsApp Primary Ordering Configuration
  whatsapp: {
    number: '0542251438',
    phoneFormatted: '054-225-1438',
    internationalNumber: '972542251438',
    ctaText: {
      he: 'הזמנה דרך WhatsApp',
      en: 'Order via WhatsApp'
    },
    defaultOrderMessage: {
      he: 'שלום יהודלס, ברצוני לבצע הזמנה לליל שישי הקרוב.',
      en: 'Hello Yehudales, I would like to place an order for this Friday night.'
    },
    businessOrdersMessage: {
      he: 'שלום יהודלס, מעוניין לקבל הצעת מחיר ופרטים לגבי הזמנה עסקית / קייטרינג לשבת.',
      en: 'Hello Yehudales, I would like details and a quote regarding business orders / Shabbat catering.'
    },
    options: {
      order: {
        title: {
          he: 'הזמנת אוכל לליל שישי',
          en: 'Order Food for Friday Night'
        },
        desc: {
          he: 'הזמנת צ\'ולנט, בשרים, קוגלים ומטעמי שבת לאיסוף עצמי',
          en: 'Order cholent, meats, kugels and Shabbat specialties for pickup'
        },
        message: 'שלום יהודלס, ברצוני להזמין אוכל חם לליל שישי הקרוב.'
      },
      general: {
        title: {
          he: 'סיוע כללי ושאלות',
          en: 'General Inquiries & Assistance'
        },
        desc: {
          he: 'לבירורים כלליים, שאלות וסיוע בהזמנות',
          en: 'For general questions, information, and order help'
        },
        message: 'שלום, הגעתי דרך האתר ויש לי שאלה/בקשה לעזרה.'
      },
      catering: {
        title: {
          he: 'הזמנות עסקיות וקייטרינג',
          en: 'Business Orders & Catering'
        },
        desc: {
          he: 'לשבתות חתן, אירועים עסקיים, קידושים והזמנות מיוחדות',
          en: 'For corporate events, Shabbat Chatan, kiddushim and large catering orders'
        },
        message: 'שלום, הגעתי דרך האתר ואני מעוניין לבצע הזמנה עסקית / לקבל פרטים לגבי קייטרינג.'
      }
    }
  },

  // Kashrut Certifications (PRESERVE EXACTLY)
  kashrut: {
    title: {
      he: 'כשרות מהודרת למהדרין',
      en: 'Strict Kosher Certification'
    },
    meat: {
      he: 'נווה ציון',
      en: 'Neve Zion'
    },
    otherProducts: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    },
    fullBadge: {
      he: 'בשר: נווה ציון | שאר המוצרים: בד״ץ העדה החרדית',
      en: 'Meat: Neve Zion | Other Products: Badatz Edah HaChareidis'
    }
  },

  // Operating Hours: EVERY THURSDAY 17:00 → 01:00 (Friday early morning)
  hours: {
    summary: {
      he: 'ימי חמישי בלבד: 17:00 עד 01:00 בלילה (ליל שישי)',
      en: 'Thursdays Only: 17:00 to 01:00 (Friday early morning)'
    },
    rawSchedule: 'חמישי 17:00–01:00',
    note: {
      he: 'הזמנות מראש ובירורים דרך WhatsApp • פתוח בליל שישי בלבד',
      en: 'Advance orders and inquiries via WhatsApp • Open Thursday nights only'
    }
  },

  // Operating History
  history: {
    yearsOfExperience: 6,
    badgeText: {
      he: 'כ-6 שנות ניסיון קולינרי',
      en: '~6 Years Culinary Excellence'
    }
  },

  // Social Links (placeholders)
  social: {
    instagram: '[INSTAGRAM_URL]',
    facebook: '[FACEBOOK_URL]'
  },

  // Media (Hero Video & Assets - Single authorized path)
  media: {
    heroVideoUrl: '/assets/videos/hero.mp4',
    heroVideoMobileUrl: '',
    heroPoster: '',
    heroImage: ''
  }
};

/**
 * Generates direct WhatsApp click-to-chat URL using centralized configuration
 */
export function getWhatsAppOrderUrl(customMessage?: string): string {
  const text = customMessage || BUSINESS_CONFIG.whatsapp.defaultOrderMessage.he;
  return `https://wa.me/${BUSINESS_CONFIG.whatsapp.internationalNumber}?text=${encodeURIComponent(text)}`;
}

// 6 Core Strengths strictly based on supplied business facts (Section 20 & 42)
export const BUSINESS_STRENGTHS: StrengthItem[] = [
  {
    id: 'taste',
    title: {
      he: 'טעם ייחודי וגבוה',
      en: 'Distinctive, Elevated Flavor'
    },
    description: {
      he: 'מתכון צ\'ולנט ומטעמי שבת שהשתבחו במהלך כ-6 שנות ניסיון, בתיבול עשיר וטעם עמוק ובלתי נשכח.',
      en: 'A signature cholent recipe perfected over ~6 years of experience, infused with rich, unforgettable flavors.'
    },
    iconName: 'Flame'
  },
  {
    id: 'quality',
    title: {
      he: 'איכות בלתי מתפשרת',
      en: 'Uncompromising Quality'
    },
    description: {
      he: 'שימוש בבשרים מובחרים, חומרי גלם איכותיים ביותר ובישול מסורתי מוקפד בכל מנה ומנה.',
      en: 'Selected prime meats and the highest quality ingredients cooked with meticulous traditional care.'
    },
    iconName: 'Award'
  },
  {
    id: 'cleanliness',
    title: {
      he: 'ניקיון והיגיינה מוקפדת',
      en: 'Spotless Cleanliness'
    },
    description: {
      he: 'סטנדרט היגיינה עליון וסטריליות בכל שלבי ההכנה, האריזה והמשלוח לביתכם.',
      en: 'Highest hygiene standards and absolute cleanliness throughout preparation, packing, and dispatch.'
    },
    iconName: 'Sparkles'
  },
  {
    id: 'service',
    title: {
      he: 'שירות מעולה ומהיר',
      en: 'Exceptional Service'
    },
    description: {
      he: 'יחס חם, אריזה מוקפדת השומרת על חום המנות, ומענה מהיר להזמנות ב-WhatsApp עם איסוף עצמי מסודר.',
      en: 'Warm customer dedication, secure thermal packaging, and rapid WhatsApp order response with seamless pickup.'
    },
    iconName: 'Clock'
  },
  {
    id: 'kashrut',
    title: {
      he: 'כשרות מהודרת ללא פשרות',
      en: 'Prestigious Kashrut'
    },
    description: {
      he: 'בשר נווה ציון ושאר מוצרים בהשגחת בד״ץ העדה החרדית – כשרות ברורה, אמינה ומפוקחת.',
      en: 'Meat from Neve Zion and other products under Badatz Edah HaChareidis — trusted and strictly supervised.'
    },
    iconName: 'ShieldCheck'
  },
  {
    id: 'experience',
    title: {
      he: 'חוויית ליל שישי אמיתית',
      en: 'Authentic Friday Night Experience'
    },
    description: {
      he: 'האווירה, הריחות והטעמים של ליל שישי מסורתי וחם, זמינים עבורכם בכל שבוע באשדוד.',
      en: 'The genuine warmth, aroma, and tradition of Friday night feast, delivered to your table in Ashdod.'
    },
    iconName: 'HeartHandshake'
  }
];

// Menu categories ready for complete menu insertion (Section 8 & 21)
export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'cholent',
    name: {
      he: 'צ\'ולנט מובחר',
      en: 'Prime Cholent'
    },
    iconName: 'Soup',
    description: {
      he: 'מנת הדגל של יהודלס בבישול איטי של שעות ארוכות',
      en: 'Yehudales signature dish, slow-cooked for rich depth'
    }
  },
  {
    id: 'meats',
    name: {
      he: 'בשרים ומנות מיוחדות',
      en: 'Meats & Specialties'
    },
    iconName: 'Utensils',
    description: {
      he: 'בשרים איכותיים בכשרות נווה ציון',
      en: 'Select meats under Neve Zion kosher standard'
    }
  },
  {
    id: 'sides',
    name: {
      he: 'תוספות מסורתיות',
      en: 'Traditional Sides'
    },
    iconName: 'Salad',
    description: {
      he: 'קיגל, קישקע, תפוחי אדמה ומטעמי שבת',
      en: 'Kugel, Kishke, seasoned potatoes and Shabbat treats'
    }
  },
  {
    id: 'beverages',
    name: {
      he: 'שתייה וקינוחים',
      en: 'Drinks & Desserts'
    },
    iconName: 'Coffee',
    description: {
      he: 'שתייה קרה וסיומת מתוקה לחוויה',
      en: 'Cold beverages and sweet additions'
    }
  }
];

// Menu items template with real supplied facts & placeholders for upcoming full menu assets
export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'cholent-classic',
    name: {
      he: 'צ\'ולנט הבית המלכותי',
      en: 'Signature Royal Cholent'
    },
    description: {
      he: 'תבשיל צ\'ולנט עשיר ומסורתי עם בשר בקר מובחר (נווה ציון), קטניות מובחרות, תפוחי אדמה נימוחים וביצה חומה.',
      en: 'Traditional rich cholent with prime beef (Neve Zion), slow-braised legumes, tender potatoes, and hard-boiled egg.'
    },
    category: 'cholent',
    isSpecialty: true,
    kashrutNote: {
      he: 'בשר נווה ציון | בד״ץ העדה החרדית',
      en: 'Neve Zion Beef | Badatz Edah HaChareidis'
    }
  },
  {
    id: 'cholent-kishke',
    name: {
      he: 'צ\'ולנט פרימיום עם קישקע',
      en: 'Premium Cholent with Kishke'
    },
    description: {
      he: 'מנת צ\'ולנט עמוסת בשר בקר רך, בליווי קישקע מסורתי עשיר בתבלינים וניחוח ביתי.',
      en: 'Generous serving of slow-simmered beef cholent served with traditional spiced savory kishke.'
    },
    category: 'cholent',
    isSpecialty: true,
    kashrutNote: {
      he: 'בשר נווה ציון | בד״ץ העדה החרדית',
      en: 'Neve Zion Beef | Badatz Edah HaChareidis'
    }
  },
  {
    id: 'meat-asado',
    name: {
      he: 'נתחי אסאדו מובחרים לשבת',
      en: 'Prime Shabbat Asado Cuts'
    },
    description: {
      he: 'בשר אסאדו עסיסי הנימוח בפה, מתובל בעדינות ונצלה בצלייה איטית ומבוקרת.',
      en: 'Succulent slow-roasted asado beef with gentle seasoning that melts in your mouth.'
    },
    category: 'meats',
    isSpecialty: true,
    kashrutNote: {
      he: 'בשר נווה ציון',
      en: 'Neve Zion Beef'
    }
  },
  {
    id: 'meat-brisket',
    name: {
      he: 'בריסקט בקר מובחר ברוטב ביתי',
      en: 'Prime Beef Brisket in House Sauce'
    },
    description: {
      he: 'פרוסות בקר רכות במיוחד ברוטב עמוק של בצל מקורמל וירקות שורש.',
      en: 'Tender beef brisket slices bathed in a rich caramelized onion and root vegetable reduction.'
    },
    category: 'meats',
    kashrutNote: {
      he: 'בשר נווה ציון',
      en: 'Neve Zion Beef'
    }
  },
  {
    id: 'side-kugel-yerushalmi',
    name: {
      he: 'קוגל ירושלמי חם ומתובל',
      en: 'Spiced Yerushalmi Kugel'
    },
    description: {
      he: 'קוגל אטריות ירושלמי קלאסי בניחוח פלפל שחור חריף-מתוק, נאפה בזהירות לשלמות.',
      en: 'Authentic caramelized noodle kugel with a balanced sweet and peppery kick.'
    },
    category: 'sides',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'side-potato-kugel',
    name: {
      he: 'קוגל תפוחי אדמה מסורתי',
      en: 'Golden Potato Kugel'
    },
    description: {
      he: 'מאפה תפוחי אדמה זהוב ופריך מבחוץ, רך וטעים מבפנים, בדיוק כמו בבית אמא.',
      en: 'Crispy golden exterior with a melt-in-the-mouth center, baked with traditional care.'
    },
    category: 'sides',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'side-kishke',
    name: {
      he: 'קישקע ביתי מובחר',
      en: 'Handcrafted Traditional Kishke'
    },
    description: {
      he: 'תוספת קישקע אותנטית עם ניחוח שבת עמוק המושלם לצד הצ\'ולנט.',
      en: 'Authentic savory kishke prepared to complement the rich cholent taste.'
    },
    category: 'sides',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'side-challah-dip',
    name: {
      he: 'חלה טרייה ומגוון מטבלים',
      en: 'Fresh Challah & Shabbat Dips'
    },
    description: {
      he: 'חלת שבת אוורירית וטרייה בליווי מטבוחה חריפה וטחינה עשירה.',
      en: 'Fluffy fresh Shabbat challah accompanied by house matbucha and creamy tahini.'
    },
    category: 'sides',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  }
];

// Gallery items - Empty state until user explicitly uploads/provides gallery assets
export const GALLERY_ITEMS: GalleryItem[] = [];
