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
    postalCode: '7730022',
    fullAddress: {
      he: 'אדמו"ר מבעלזא 7, אשדוד 7730022',
      en: 'Admor MiBelz 7, Ashdod 7730022, Israel'
    },
    wazeUrl: `https://waze.com/ul?q=${encodeURIComponent('אדמו"ר מבעלזא 7, אשדוד 7730022')}&navigate=yes`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('אדמו"ר מבעלזא 7, אשדוד 7730022')}`,
    embedMapUrl: `https://maps.google.com/maps?q=${encodeURIComponent('אדמו"ר מבעלזא 7 אשדוד 7730022')}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
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
  },

  // Authoritative live updates & announcements
  updates: [
    {
      id: 'update-1',
      date: {
        he: 'יום חמישי הקרוב • מ-17:00',
        en: 'This Thursday • From 17:00'
      },
      badge: {
        he: 'טרי מהסיר',
        en: 'Fresh & Hot'
      },
      title: {
        he: 'הסירים מבעבעים: צ\'ולנט בקר עשיר, קישקע וקוגלים ירושלמיים',
        en: 'Pots Simmering: Prime Beef Cholent, Kishke & Yerushalmi Kugels'
      },
      description: {
        he: 'הצטרפו לחוויית ליל שישי המסורתית של יהודלס. מומלץ להזמין מראש בוואטסאפ להבטחת המנות האהובות עליכם.',
        en: 'Join the authentic Yehudales Thursday night feast. Pre-ordering via WhatsApp is recommended to secure your favorite dishes.'
      },
      tag: {
        he: 'הזמנות פתוחות',
        en: 'Orders Open'
      }
    },
    {
      id: 'update-2',
      date: {
        he: 'עדכון קבוע',
        en: 'Notice'
      },
      badge: {
        he: 'כשרות מהודרת',
        en: 'Strict Kosher'
      },
      title: {
        he: 'בשר חלק מהדרין: בקר נווה ציון ומוצרי בד״ץ העדה החרדית',
        en: 'Mehadrin Glatt Meat: Neve Zion Beef & Badatz Edah HaChareidis'
      },
      description: {
        he: 'בכל שבוע אנו מקפידים על חומרי הגלם המובחרים והאיכותיים ביותר לשמירה על שקט נפשי וביטחון מושלם.',
        en: 'Every week we select only the finest certified kosher ingredients for absolute quality and customer peace of mind.'
      },
      tag: {
        he: 'ללא פשרות',
        en: 'Uncompromised'
      }
    },
    {
      id: 'update-3',
      date: {
        he: 'הזמנות מראש',
        en: 'Advance Inquiries'
      },
      badge: {
        he: 'אריזות חמות',
        en: 'Thermal Care'
      },
      title: {
        he: 'איסוף עצמי מסודר וחם באדמו"ר מבעלזא 7, אשדוד',
        en: 'Organized Warm Pickup at Admor MiBelz 7, Ashdod'
      },
      description: {
        he: 'כל המנות נארזות באריזות תרמיות מוקפדות השומרות על חום וטריות מקסימלית עד השולחן שלכם.',
        en: 'All orders are packed in premium thermal containers preserving optimal heat and freshness to your home.'
      },
      tag: {
        he: 'טייק אווי מהיר',
        en: 'Fast Pickup'
      }
    }
  ]
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
      he: 'צ\'ולנט',
      en: 'Cholent'
    },
    iconName: 'Soup',
    description: {
      he: 'תבשילי צ\'ולנט עשירים בבישול לילה איטי ומסורתי',
      en: 'Rich slow-simmered overnight cholent pots'
    }
  },
  {
    id: 'fried',
    name: {
      he: 'מטוגנים',
      en: 'Fried Menu'
    },
    iconName: 'Utensils',
    description: {
      he: 'מטוגנים פריכים וטריים, בלינצ\'סים, סיגרים ופסטלים',
      en: 'Fresh crispy fried bites, blintzes, cigars, and pastels'
    }
  },
  {
    id: 'special-thursday',
    name: {
      he: 'חמישי שמח',
      en: 'Thursday Specials'
    },
    iconName: 'Sparkles',
    description: {
      he: 'דילים ומנות ספיישל מיוחדות לליל שישי',
      en: 'Special Thursday night combos & cuts'
    }
  },
  {
    id: 'kishke',
    name: {
      he: 'קישקע',
      en: 'Kishke'
    },
    iconName: 'Utensils',
    description: {
      he: 'קישקע מסורתי עמוס טעם וניחוח ביתי',
      en: 'Traditional savory handcrafted kishke'
    }
  },
  {
    id: 'sides',
    name: {
      he: 'תוספות',
      en: 'Sides'
    },
    iconName: 'Salad',
    description: {
      he: 'קוגלים זהובים, חלות שבת ומטבלי הבית',
      en: 'Golden kugels, challah, and house dips'
    }
  },
  {
    id: 'beverages',
    name: {
      he: 'שתייה וקינוחים',
      en: 'Drinks & Sweets'
    },
    iconName: 'Coffee',
    description: {
      he: 'שתייה קרה וסיומת מתוקה לחוויה',
      en: 'Chilled drinks and traditional sweet treats'
    }
  }
];

// Menu items template with real supplied facts & placeholders for upcoming full menu assets
export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'cholent-asado',
    name: {
      he: 'צ\'ולנט בקר אסאדו',
      en: 'Asado Beef Cholent'
    },
    description: {
      he: 'מורכב מ: - תפוחי אדמה - שעועית - גריסים - בשר בקר משובח - "אסאדו" - ביצה חומה',
      en: 'Potatoes • Beans • Barley • Prime Asado Beef • Hard-boiled egg'
    },
    price: 30,
    category: 'cholent',
    isSpecialty: true,
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון | בד״ץ העדה החרדית',
      en: 'Neve Zion Beef | Badatz Edah HaChareidis'
    }
  },
  {
    id: 'cholent-classic',
    name: {
      he: 'צ\'ולנט בקר רגיל',
      en: 'Classic Beef Cholent'
    },
    description: {
      he: 'מורכב מ: - תפוחי אדמה - שעועית - גריסים - בשר בקר מובחר - ביצה חומה',
      en: 'Potatoes • Beans • Barley • Select Tender Beef • Hard-boiled egg'
    },
    price: 34,
    category: 'cholent',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון | בד״ץ העדה החרדית',
      en: 'Neve Zion Beef | Badatz Edah HaChareidis'
    }
  },
  {
    id: 'fried-tomato-paste',
    name: {
      he: 'רסק עגבניות',
      en: 'Fresh Tomato Dip'
    },
    description: {
      he: 'רסק עגבניות טרי ומתובל בתיבול ביתי עדין',
      en: 'Freshly grated seasoned tomato dip'
    },
    price: 3,
    category: 'fried',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'fried-blintz-sausage',
    name: {
      he: 'בלינצ\'ס נקניק',
      en: 'Sausage Blintz'
    },
    description: {
      he: '(2 ב-10₪) בלינצ\'ס חם ופריך במילוי נקניק מובחר',
      en: '(2 for ₪10) Crispy warm blintzes filled with prime sausage'
    },
    price: 6,
    category: 'fried',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון',
      en: 'Neve Zion Meat'
    }
  },
  {
    id: 'fried-meat-cigar',
    name: {
      he: 'סיגר בשר',
      en: 'Crispy Meat Cigar'
    },
    description: {
      he: '(2 ב-5₪) סיגר פריך במילוי בשר בקר מתובל',
      en: '(2 for ₪5) Crispy Moroccan cigar filled with seasoned beef'
    },
    price: 3,
    category: 'fried',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון',
      en: 'Neve Zion Meat'
    }
  },
  {
    id: 'fried-potato-pastel',
    name: {
      he: 'פסטל תפו״א',
      en: 'Potato Pastel'
    },
    description: {
      he: 'פסטל פריך במילוי מחית תפוחי אדמה חמה ומתובלת',
      en: 'Crispy pastry filled with seasoned savory mashed potatoes'
    },
    price: 3,
    category: 'fried',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'cholent-kishke',
    name: {
      he: 'צ\'ולנט מובחר עם קישקע',
      en: 'Prime Cholent with Kishke'
    },
    description: {
      he: 'מנת צ\'ולנט עמוסת בשר רך בליווי קישקע מסורתי עשיר בתבלינים',
      en: 'Generous beef cholent portion served with traditional spiced kishke'
    },
    price: 42,
    category: 'cholent',
    isSpecialty: true,
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון | בד״ץ העדה החרדית',
      en: 'Neve Zion Beef | Badatz Edah HaChareidis'
    }
  },
  {
    id: 'thursday-combo-deluxe',
    name: {
      he: 'קומבו חמישי שמח מורחב',
      en: 'Thursday Night Combo Deluxe'
    },
    description: {
      he: 'מנת צ\'ולנט בקר גדולה + קוגל ירושלמי חם + פחית שתייה קרה לבחירה',
      en: 'Large beef cholent + warm Yerushalmi kugel + cold drink of choice'
    },
    price: 48,
    category: 'special-thursday',
    isSpecialty: true,
    availability: 'in_stock',
    kashrutNote: {
      he: 'מהדרין מן המהדרין',
      en: 'Strict Mehadrin'
    }
  },
  {
    id: 'thursday-asado-ribs',
    name: {
      he: 'נתחי אסאדו מובחרים ברוטב ביתי',
      en: 'Prime Asado Beef Ribs'
    },
    description: {
      he: 'בשר אסאדו עסיסי הנימוח בפה, מתובל בעדינות ונצלה בצלייה איטית ומבוקרת',
      en: 'Succulent slow-roasted asado beef that melts in your mouth'
    },
    price: 68,
    category: 'special-thursday',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בשר נווה ציון',
      en: 'Neve Zion Beef'
    }
  },
  {
    id: 'kishke-portion',
    name: {
      he: 'קישקע ביתי מסורתי (מנה)',
      en: 'Traditional Handcrafted Kishke'
    },
    description: {
      he: 'קישקע אותנטי אפוי בתנור עם ניחוח שבת עמוק המושלם לצד הצ\'ולנט',
      en: 'Authentic oven-baked savory kishke prepared to perfection'
    },
    price: 18,
    category: 'kishke',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'kishke-double-platter',
    name: {
      he: 'צמד קישקע מתובל לשבת',
      en: 'Double Kishke Shabbat Platter'
    },
    description: {
      he: 'מנה כפולה של קישקע פרימיום בתוספת רוטב צ\'ולנט עשיר',
      en: 'Double portion of premium kishke topped with rich cholent sauce'
    },
    price: 32,
    category: 'kishke',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'side-kugel-yerushalmi',
    name: {
      he: 'קוגל ירושלמי חם ומתובל',
      en: 'Spiced Yerushalmi Kugel'
    },
    description: {
      he: 'קוגל אטריות ירושלמי קלאסי בניחוח פלפל שחור חריף-מתוק, נאפה בזהירות לשלמות',
      en: 'Authentic caramelized noodle kugel with a balanced sweet and peppery kick'
    },
    price: 24,
    category: 'sides',
    availability: 'in_stock',
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
      he: 'מאפה תפוחי אדמה זהוב ופריך מבחוץ, רך וטעים מבפנים',
      en: 'Crispy golden exterior with a melt-in-the-mouth center'
    },
    price: 24,
    category: 'sides',
    availability: 'in_stock',
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
      he: 'חלת שבת אוורירית וטרייה בליווי מטבוחה חריפה וטחינה עשירה',
      en: 'Fluffy fresh Shabbat challah accompanied by house matbucha and tahini'
    },
    price: 18,
    category: 'sides',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  },
  {
    id: 'beverage-cola',
    name: {
      he: 'קוקה קולה קר (1.5 ליטר)',
      en: 'Chilled Coca-Cola (1.5L)'
    },
    description: {
      he: 'בקבוק קוקה קולה קלאסי קר ומרענן',
      en: 'Classic chilled refreshing 1.5L bottle'
    },
    price: 14,
    category: 'beverages',
    availability: 'in_stock',
    kashrutNote: {
      he: 'כשר למהדרין',
      en: 'Kosher Mehadrin'
    }
  },
  {
    id: 'beverage-zero',
    name: {
      he: 'קוקה קולה זירו קר (1.5 ליטר)',
      en: 'Chilled Coca-Cola Zero (1.5L)'
    },
    description: {
      he: 'בקבוק קוקה קולה זירו קר ללא סוכר',
      en: 'Zero sugar chilled refreshing 1.5L bottle'
    },
    price: 14,
    category: 'beverages',
    availability: 'in_stock',
    kashrutNote: {
      he: 'כשר למהדרין',
      en: 'Kosher Mehadrin'
    }
  },
  {
    id: 'dessert-compote',
    name: {
      he: 'קומפוט פירות מסורתי עשיר',
      en: 'Traditional Fruit Compote'
    },
    description: {
      he: 'קינוח פירות מבושל מסורתי עם שזיפים, תפוחים וקינמון',
      en: 'Traditional slow-cooked fruit compote with plums, apples, and cinnamon'
    },
    price: 20,
    category: 'beverages',
    availability: 'in_stock',
    kashrutNote: {
      he: 'בד״ץ העדה החרדית',
      en: 'Badatz Edah HaChareidis'
    }
  }
];

// Gallery items - Empty state until user explicitly uploads/provides gallery assets
export const GALLERY_ITEMS: GalleryItem[] = [];
