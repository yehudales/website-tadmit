import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ChevronUp,
  Info,
  Bell,
  Briefcase,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Flame,
  Award,
  Sparkles,
  HeartHandshake,
  Soup,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Language, NavSectionId } from '../types';
import { BUSINESS_CONFIG, getWhatsAppOrderUrl } from '../config/businessConfig';
import { getDrawerAnimationConfig } from '../utils/drawerAnimation';
import { PageEntranceAnimation } from './PageEntranceAnimation';

interface ExpandableContentSectionProps {
  lang: Language;
  activeSection: NavSectionId | null;
  onClose: () => void;
  onOpenWhatsApp: () => void;
  onOpenAccessibility: () => void;
  onOpenPrivacy: () => void;
}

export const ExpandableContentSection: React.FC<ExpandableContentSectionProps> = ({
  lang,
  activeSection,
  onClose,
  onOpenWhatsApp,
  onOpenAccessibility,
  onOpenPrivacy,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const drawerAnim = getDrawerAnimationConfig(shouldReduceMotion);
  const containerRef = useRef<HTMLDivElement>(null);

  // When active section changes, reset scroll inside panel to top
  useEffect(() => {
    if (activeSection && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // Keyboard accessibility: Escape closes the active panel
  useEffect(() => {
    if (!activeSection) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, onClose]);

  const sectionTitles: Record<NavSectionId, { he: string; en: string; icon: React.ReactNode }> = {
    about: {
      he: 'אודות יהודלס',
      en: 'About Yehudales',
      icon: <Info className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />,
    },
    updates: {
      he: 'עדכונים והודעות',
      en: 'Updates & Announcements',
      icon: <Bell className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />,
    },
    'business-orders': {
      he: 'הזמנות עסקיות וקייטרינג',
      en: 'Business Orders & Catering',
      icon: <Briefcase className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />,
    },
    location: {
      he: 'סניף יהודלס אשדוד',
      en: 'Ashdod Branch & Hours',
      icon: <MapPin className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />,
    },
    reviews: {
      he: 'ביקורות',
      en: 'Reviews',
      icon: <Star className="w-4 h-4 text-[#FF7B1C]" aria-hidden="true" />,
    },
  };

  const currentTitle = activeSection ? sectionTitles[activeSection] : null;
  const cateringWhatsAppUrl = getWhatsAppOrderUrl(BUSINESS_CONFIG.whatsapp.options.catering.message);

  // 6 Brand Pillars exactly as provided
  const brandPillars = [
    {
      num: '01',
      title: { he: 'טעם ייחודי וגבוה', en: 'Distinctive High Taste' },
      desc: {
        he: "מתכון צ'ולנט ומטעמי שבת שהשתבחו במהלך כ-6 שנות ניסיון, בתיבול עשיר וטעם עמוק ובלתי נשכח.",
        en: 'Cholent and Shabbat delicacies perfected through ~6 years of culinary craft, with rich seasoning and unforgettable depth.',
      },
    },
    {
      num: '02',
      title: { he: 'איכות בלתי מתפשרת', en: 'Uncompromising Quality' },
      desc: {
        he: 'שימוש בבשרים מובחרים, חומרי גלם איכותיים ביותר ובישול מסורתי מוקפד בכל מנה ומנה.',
        en: 'Choice select meats, premium raw ingredients, and meticulous traditional slow-cooking in every dish.',
      },
    },
    {
      num: '03',
      title: { he: 'ניקיון והיגיינה מוקפדת', en: 'Meticulous Cleanliness & Hygiene' },
      desc: {
        he: 'סטנדרט היגיינה עליון וסטריליות בכל שלבי ההכנה, האריזה והמשלוח לביתכם.',
        en: 'Top hygiene standards and sterility throughout all preparation, packaging, and delivery phases.',
      },
    },
    {
      num: '04',
      title: { he: 'שירות מעולה ומהיר', en: 'Fast & Excellent Service' },
      desc: {
        he: 'יחס חם, אריזה מוקפדת השומרת על חום המנות, ומענה מהיר להזמנות ב-WhatsApp עם איסוף עצמי מסודר.',
        en: 'Warm attentive service, thermal packaging keeping food piping hot, and swift WhatsApp orders with organized pickup.',
      },
    },
    {
      num: '05',
      title: { he: 'כשרות מהודרת ללא פשרות', en: 'Strict Kosher Without Compromise' },
      desc: {
        he: 'בשר נווה ציון ושאר מוצרים בהשגחת בד״ץ העדה החרדית – כשרות ברורה, אמינה ומפוקחת.',
        en: 'Neve Zion meats and all products under Badatz Edah HaChareidis supervision — clear, trustworthy, strictly overseen.',
      },
    },
    {
      num: '06',
      title: { he: 'חוויית ליל שישי אמיתית', en: 'Authentic Friday Night Experience' },
      desc: {
        he: 'האווירה, הריחות והטעמים של ליל שישי מסורתי וחם, זמינים עבורכם בכל שבוע באשדוד.',
        en: 'The genuine atmosphere, aromas, and heartfelt flavors of traditional Friday night, right here in Ashdod every week.',
      },
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {activeSection && currentTitle && (
        <motion.div
          id="expandable-content-area"
          ref={containerRef}
          key={activeSection}
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{
            ...drawerAnim.open,
            overflowY: shouldReduceMotion ? 'auto' : undefined,
            transitionEnd: {
              overflowY: 'auto',
            },
          }}
          exit={{
            ...drawerAnim.closed,
            overflow: 'hidden',
          }}
          className="w-full bg-[#0E1013]/98 backdrop-blur-2xl border-b border-[#252A32] shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[calc(100vh-var(--header-height,98px))] max-h-[calc(100dvh-var(--header-height,98px))] overscroll-contain relative z-40 select-text"
          role="region"
          aria-labelledby="expandable-heading"
        >
          {/* Animated Page Entrance Effect (Orange-only, ~2s duration, unmounts automatically) */}
          <PageEntranceAnimation key={activeSection} section={activeSection} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8">
            {/* Top Panel Control Bar with Section Badge (No X/Close Button) */}
            <div className="flex items-center justify-start pb-5 mb-6 border-b border-[#252A32]">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#1A1D22] border border-[#252A32] flex items-center justify-center">
                  {currentTitle.icon}
                </span>
                <h2 id="expandable-heading" className="text-lg sm:text-xl font-black text-[#FAF9F6] tracking-tight">
                  {currentTitle[lang]}
                </h2>
              </div>
            </div>

            {/* Section 1: אודות (About — Comprehensive Brand Content) */}
            {activeSection === 'about' && (
              <div className="space-y-10">
                {/* 1. Main Brand Story & Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C]">
                        {lang === 'he' ? 'על מותג יהודלס' : 'About Yehudales'}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6] mt-1 leading-tight">
                        {lang === 'he'
                          ? 'כ-6 שנות מומחיות ואיכות קולינרית'
                          : '~6 Years of Culinary Craft & Quality'}
                      </h3>
                      <p className="text-sm sm:text-base font-bold text-[#FF7B1C] mt-1">
                        {lang === 'he'
                          ? 'חווית ליל שישי ברמה הגבוהה ביותר'
                          : 'Friday Night Experience of the Highest Standard'}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      {lang === 'he'
                        ? 'מותג האוכל "יהודלס" פועל בעיר אשדוד כ-6 שנים, מתוך מחויבות עמוקה להביא אל שולחנכם את הטעם העמוק, העשיר והאותנטי של ליל שישי. אנו מתמחים בתבשילי צ\'ולנט מובחרים ובשרים מיוחדים המבושלים בבישול מסורתי ארוך, המעניק לכל ביס עומק טעמים שאין שני לו.'
                        : 'Yehudales has operated in Ashdod for approximately 6 years, dedicated to bringing authentic, rich Friday night food to your table. Specializing in signature slow-cooked cholent and select kosher meats.'}
                    </p>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      {lang === 'he'
                        ? 'העסק פועל במודל Takeaway והזמנות ישירות דרך WhatsApp בלבד (ללא ישיבה במקום), מתוך דגש בלתי מתפשר על שלושת עקרונות הברזל שלנו: איכות חומרי הגלם, שירות אישי ומהיר, ורמת ניקיון והיגיינה מופתית בכל שלב.'
                        : 'Operating exclusively as a takeaway and direct WhatsApp order service (no dine-in seating), focusing strictly on high-grade ingredients, attentive service, and spotless cleanliness.'}
                    </p>

                    {/* Featured Quote Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-[#FAF9F6]">
                        {lang === 'he' ? '"חווית ליל שישי טעם ברמה גבוהה"' : '"Friday Night Experience at the Highest Level"'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                        {lang === 'he'
                          ? 'סיר הצ\'ולנט המסורתי שלנו מבעבע שעות ארוכות בתבלינים מדויקים, בשר בקר מובחר ותפוחי אדמה נימוחים. זו לא סתם מנה – זו חוויה שלמה של קדושת השבת והטעם המושלם.'
                          : 'Our signature cholent pot simmers for long hours with precise seasonings, choice beef, and tender potatoes. It is a complete celebratory experience of Shabbat flavors.'}
                      </p>
                      <span className="text-xs font-bold text-[#FF7B1C] block pt-1">
                        {lang === 'he' ? 'יהודלס • חווית ליל שישי | אשדוד' : 'Yehudales • Friday Night Experience | Ashdod'}
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Highlight Badges */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF7B1C]">
                          {lang === 'he' ? 'פעילות מבוססת' : 'Established Business'}
                        </span>
                        <h4 className="text-base font-black text-[#FAF9F6]">
                          {lang === 'he' ? 'כ-6 שנות פעילות באשדוד' : '~6 Years in Ashdod'}
                        </h4>
                        <p className="text-xs text-[#94A3B8]">
                          {lang === 'he' ? 'מותג אוכל רציני ומבוסס' : 'Established culinary brand'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#252A32] space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF7B1C]">
                          {lang === 'he' ? 'כשרות מהודרת למהדרין' : 'Strict Kosher Certification'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'בשר: נווה ציון | שאר המוצרים: בד״ץ העדה החרדית' : 'Meat: Neve Zion | Other: Badatz Edah HaChareidis'}
                        </h4>
                      </div>

                      <div className="pt-3 border-t border-[#252A32]">
                        <button
                          onClick={onOpenWhatsApp}
                          type="button"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#FF7B1C] hover:bg-[#FF8F3D] text-[#0B0C0E] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{lang === 'he' ? 'שיחה ישירה בוואטסאפ' : 'Direct WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core Brand Values & Heritage ("ערכי היסוד ומסורת המותג" / "למה לבחור ביהודלס?") */}
                <div className="pt-6 border-t border-[#252A32] space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C] px-3 py-1 rounded-lg bg-[#14171C] border border-[#252A32] inline-block">
                      {lang === 'he' ? 'ערכי היסוד ומסורת המותג' : 'Our Brand Pillars & Heritage'}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6]">
                      {lang === 'he' ? 'למה לבחור ביהודלס?' : 'Why Choose Yehudales?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8]">
                      {lang === 'he'
                        ? 'הסטנדרטים הקולינריים והעקרונות המובילים אותנו לאורך כ-6 שנות עשייה קולינרית באשדוד'
                        : 'The culinary standards and principles that guide us across ~6 years of cooking in Ashdod'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brandPillars.map((pillar) => (
                      <div
                        key={pillar.num}
                        className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] hover:border-[#FF7B1C]/40 transition-colors flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-black text-[#FF7B1C] tabular-nums">
                              {pillar.num}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-[#FF7B1C]" aria-hidden="true" />
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-[#FAF9F6] mb-1.5">
                            {pillar.title[lang]}
                          </h4>
                          <p className="text-xs text-[#94A3B8] leading-relaxed">
                            {pillar.desc[lang]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Brand Tagline Strip */}
                  <div className="p-4 rounded-2xl bg-[#14171C] border border-[#252A32] text-center space-y-1">
                    <p className="text-sm font-black text-[#FAF9F6]">
                      {lang === 'he'
                        ? 'יהודלס — חווית ליל שישי טעם ברמה גבוהה'
                        : 'Yehudales — Friday Night Experience of the Highest Standard'}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {lang === 'he'
                        ? 'בשר נווה ציון • מוצרים בהשגחת בד״ץ העדה החרדית • כ-6 שנות ניסיון באשדוד'
                        : 'Neve Zion Meats • Badatz Edah HaChareidis • ~6 Years of Experience in Ashdod'}
                    </p>
                  </div>
                </div>

                {/* 3. Updates & Activity Schedule ("עדכונים ולוח פעילות") */}
                <div className="pt-6 border-t border-[#252A32] space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C] px-3 py-1 rounded-lg bg-[#14171C] border border-[#252A32] inline-block">
                      {lang === 'he' ? 'עדכונים ולוח פעילות' : 'Updates & Activity Schedule'}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6]">
                      {lang === 'he' ? 'מה חדש בסירים של יהודלס' : 'What is New in the Pots'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8]">
                      {lang === 'he'
                        ? 'הודעות שבועיות, זמני בישול, מנות מיוחדות ומידע עדכני להזמנות ליל שישי'
                        : 'Weekly notices, cooking times, special dishes, and live ordering details'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: טרי מהסיר */}
                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#1A1D22] text-[#FF7B1C] border border-[#252A32]">
                            {lang === 'he' ? 'טרי מהסיר' : 'Fresh from Pot'}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {lang === 'he' ? 'יום חמישי הקרוב • מ-17:00' : 'This Thursday • from 17:00'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#FAF9F6] mb-1 leading-snug">
                          {lang === 'he'
                            ? 'הסירים מבעבעים: צ\'ולנט בקר עשיר, קישקע וקוגלים ירושלמיים'
                            : 'Simmering Pots: Prime Beef Cholent, Kishke & Yerushalmi Kugels'}
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                          {lang === 'he'
                            ? 'הצטרפו לחוויית ליל שישי המסורתית של יהודלס. מומלץ להזמין מראש בוואטסאפ להבטחת המנות האהובות עליכם.'
                            : 'Join the authentic Friday night experience of Yehudales. We recommend ordering ahead on WhatsApp.'}
                        </p>
                        <span className="inline-block mt-2 text-[11px] font-bold text-[#FF7B1C]">
                          {lang === 'he' ? 'הזמנות פתוחות' : 'Orders Open'}
                        </span>
                      </div>

                      <button
                        onClick={onOpenWhatsApp}
                        type="button"
                        className="w-full py-2 px-3 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] border border-[#252A32] text-xs font-bold text-[#FAF9F6] hover:text-[#FF7B1C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#FF7B1C]" />
                        <span>{lang === 'he' ? 'לפרטים' : 'Details'}</span>
                      </button>
                    </div>

                    {/* Card 2: כשרות מהודרת */}
                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#1A1D22] text-[#FF7B1C] border border-[#252A32]">
                            {lang === 'he' ? 'כשרות מהודרת' : 'Strict Kosher'}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {lang === 'he' ? 'עדכון קבוע' : 'Ongoing Standard'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#FAF9F6] mb-1 leading-snug">
                          {lang === 'he'
                            ? 'בשר חלק מהדרין: בקר נווה ציון ומוצרי בד״ץ העדה החרדית'
                            : 'Strict Kosher Meat: Neve Zion Beef & Badatz Edah HaChareidis'}
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                          {lang === 'he'
                            ? 'בכל שבוע אנו מקפידים על חומרי הגלם המובחרים והאיכותיים ביותר לשמירה על שקט נפשי וביטחון מושלם.'
                            : 'Every single week we maintain the highest-grade raw ingredients for complete peace of mind.'}
                        </p>
                        <span className="inline-block mt-2 text-[11px] font-bold text-[#FF7B1C]">
                          {lang === 'he' ? 'ללא פשרות' : 'No Compromises'}
                        </span>
                      </div>

                      <button
                        onClick={onOpenWhatsApp}
                        type="button"
                        className="w-full py-2 px-3 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] border border-[#252A32] text-xs font-bold text-[#FAF9F6] hover:text-[#FF7B1C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#FF7B1C]" />
                        <span>{lang === 'he' ? 'לפרטים' : 'Details'}</span>
                      </button>
                    </div>

                    {/* Card 3: אריזות חמות */}
                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#1A1D22] text-[#FF7B1C] border border-[#252A32]">
                            {lang === 'he' ? 'אריזות חמות' : 'Hot Packaging'}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {lang === 'he' ? 'הזמנות מראש' : 'Advance Orders'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#FAF9F6] mb-1 leading-snug">
                          {lang === 'he'
                            ? 'איסוף עצמי מסודר וחם באדמו"ר מבעלזא 7, אשדוד'
                            : 'Organized Hot Pickup at Admor MiBelz 7, Ashdod'}
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                          {lang === 'he'
                            ? 'כל המנות נארזות באריזות תרמיות מוקפדות השומרות על חום וטריות מקסימלית עד השולחן שלכם.'
                            : 'All dishes are sealed in specialized thermal boxes ensuring optimal warmth and freshness directly to your table.'}
                        </p>
                        <span className="inline-block mt-2 text-[11px] font-bold text-[#FF7B1C]">
                          {lang === 'he' ? 'טייק אווי מהיר' : 'Fast Takeaway'}
                        </span>
                      </div>

                      <button
                        onClick={onOpenWhatsApp}
                        type="button"
                        className="w-full py-2 px-3 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] border border-[#252A32] text-xs font-bold text-[#FAF9F6] hover:text-[#FF7B1C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#FF7B1C]" />
                        <span>{lang === 'he' ? 'לפרטים' : 'Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: עדכונים (Updates) */}
            {activeSection === 'updates' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BUSINESS_CONFIG.updates.map((update) => (
                    <div
                      key={update.id}
                      className="p-4 sm:p-5 rounded-xl bg-[#14171C] border border-[#252A32] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#1A1D22] text-[#FF7B1C] border border-[#252A32]">
                            {update.tag[lang]}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">{update.date[lang]}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#FAF9F6] mb-1.5 leading-snug">
                          {update.title[lang]}
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">{update.description[lang]}</p>
                      </div>

                      <button
                        onClick={onOpenWhatsApp}
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF7B1C] hover:text-white pt-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'he' ? 'לבירור ב-WhatsApp' : 'Inquire via WhatsApp'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: הזמנות עסקיות (Business Orders & Catering) */}
            {activeSection === 'business-orders' && (
              <div className="space-y-8">
                {/* 1. אירועים וקייטרינג מיוחד (Event & Catering Information) */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C] px-3 py-1 rounded-lg bg-[#14171C] border border-[#252A32] inline-block">
                      {lang === 'he' ? 'אירועים וקייטרינג מיוחד' : 'Events & Catering'}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6] mt-2 leading-tight">
                      {lang === 'he'
                        ? 'הזמנות עסקיות, שבתות חתן ואירועים מיוחדים'
                        : 'Corporate Feasts, Shabbat Chatan & Special Events'}
                    </h3>
                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mt-1">
                      {lang === 'he'
                        ? 'תבשילי שבת מובחרים בכמויות גדולות, שירות מותאם אישית וכשרות מהודרת לאירוע בלתי נשכח.'
                        : 'Premium Shabbat cuisine for large groups, customized catering, and strict kosher standards.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-2">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF7B1C] shrink-0" />
                        <h4 className="text-sm font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'שבתות חתן ואירועים משפחתיים' : 'Shabbat Chatan & Family Events'}
                        </h4>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {lang === 'he'
                          ? 'סירי צ\'ולנט ענקיים, מבחר בשרים מובחרים, קוגלים, חלות ומטבלים בכמויות מותאמות אישית.'
                          : 'Generous pots of signature cholent, choice meats, kugels, and dips customized for your guests.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-2">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF7B1C] shrink-0" />
                        <h4 className="text-sm font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'אירועים עסקיים והרמות כוסית' : 'Corporate Feasts & Gatherings'}
                        </h4>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {lang === 'he'
                          ? 'חוויית אוכל חם וטרי במשרד או באירוע חברה, עם אריזות תרמיות מוקפדות והגשה נוחה.'
                          : 'Hot, fresh food experience for your office or company event, packed in insulated containers.'}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-2">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#FF7B1C] shrink-0" />
                        <h4 className="text-sm font-bold text-[#FAF9F6]">
                          {lang === 'he' ? 'קידושים ואירועי קהילה' : 'Synagogue Kiddushim & Community'}
                        </h4>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {lang === 'he'
                          ? 'כשרות מהודרת ללא פשרות (נווה ציון ובד״ץ העדה החרדית) המאפשרת לכל האורחים ליהנות בביטחון מלא.'
                          : 'Strict Kosher certification (Neve Zion & Badatz Edah HaChareidis) ensuring every guest dines with peace of mind.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. תיאום הזמנה עסקית / קייטרינג (Conversion / Contact Section) */}
                <div className="pt-6 border-t border-[#252A32]">
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#14171C] border border-[#252A32] max-w-2xl mx-auto text-center space-y-5 shadow-xl">
                    <div className="space-y-2">
                      <h4 className="text-xl sm:text-2xl font-black text-[#FAF9F6]">
                        {lang === 'he' ? 'תיאום הזמנה עסקית / קייטרינג' : 'Coordinate Corporate / Event Order'}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-lg mx-auto">
                        {lang === 'he'
                          ? 'ספרו לנו על האירוע שלכם, מספר האורחים והתאריך הרצוי, וצוות יהודלס יבנה עבורכם תפריט מושלם.'
                          : 'Tell us about your event, headcount, and preferred date, and we will tailor the perfect Shabbat menu.'}
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      <a
                        href="https://wa.me/972542251438?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%91%D7%A6%D7%A2%20%D7%94%D7%96%D7%9E%D7%A0%D7%94%20%D7%A2%D7%A1%D7%A7%D7%99%D7%AA%20%2F%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%9C%D7%92%D7%91%D7%99%20%D7%A7%D7%99%D7%99%D7%98%D7%A8%D7%99%D7%A0%D7%92."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF7B1C] hover:bg-[#FF8F3D] text-[#0B0C0E] font-black text-sm transition-all active:scale-95 shadow-lg cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5 text-[#0B0C0E]" />
                        <span>{lang === 'he' ? 'הזמנה עסקית דרך WhatsApp' : 'Order via WhatsApp'}</span>
                      </a>

                      <a
                        href="tel:0542251438"
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] text-[#FAF9F6] border border-[#252A32] text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-[#FF7B1C]" />
                        <span>054-225-1438</span>
                      </a>
                    </div>

                    <div className="pt-3 border-t border-[#252A32] text-[11px] sm:text-xs text-[#94A3B8]">
                      <span>{lang === 'he' ? 'מומלץ לתאם אירועים לפחות 48 שעות מראש' : 'Recommended booking at least 48h in advance'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: סניף (Branch & Location) */}
            {activeSection === 'location' && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF7B1C] px-3 py-1 rounded-lg bg-[#14171C] border border-[#252A32] inline-block">
                    {lang === 'he' ? 'סניף וניווט' : 'Branch & Navigation'}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F6] mt-2 leading-tight">
                    {lang === 'he' ? 'סניף יהודלס אשדוד' : 'Yehudales Ashdod Branch'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-1">
                    {lang === 'he'
                      ? 'טייק אווי ואיסוף עצמי בתיאום מראש • ללא מקומות ישיבה • רובע ג\', אשדוד'
                      : 'Takeaway & pickup by advance arrangement • No dine-in seating • Rova Gimmel, Ashdod'}
                  </p>
                </div>

                {/* 2-Column Info Cards & Google Maps */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Details Cards */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Card 1: כתובת מלאה לאיסוף */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                            {lang === 'he' ? 'כתובת מלאה לאיסוף' : 'Full Pickup Address'}
                          </h4>
                          <p className="text-sm font-bold text-[#FAF9F6] mt-0.5">
                            {lang === 'he' ? 'אדמו"ר מבעלזא 7, אשדוד 7730022' : 'Admor MiBelz 7, Ashdod 7730022'}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {lang === 'he' ? 'רובע ג\', אשדוד (מיקוד: 7730022)' : 'Rova Gimmel, Ashdod (Zip: 7730022)'}
                          </p>
                        </div>
                      </div>

                      {/* Card 2: שעות פעילות */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                            {lang === 'he' ? 'שעות פעילות' : 'Operating Hours'}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-[#FF7B1C] mt-0.5">
                            {lang === 'he'
                              ? 'ימי חמישי בלבד: 17:00 עד 01:00 בלילה (ליל שישי)'
                              : 'Thursdays only: 17:00 to 01:00 at night (Friday Eve)'}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {lang === 'he'
                              ? 'הזמנות מראש ובירורים דרך WhatsApp • פתוח בליל שישי בלבד'
                              : 'Advance orders & inquiries via WhatsApp • Open Friday Eve only'}
                          </p>
                        </div>
                      </div>

                      {/* Card 3: טלפון ישיר */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#14171C] border border-[#252A32] flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0B0C0E] border border-[#252A32] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-[#FF7B1C]" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#FAF9F6]">
                            {lang === 'he' ? 'טלפון ישיר' : 'Direct Phone'}
                          </h4>
                          <a
                            href="tel:0542251438"
                            className="text-sm sm:text-base font-bold text-[#FAF9F6] hover:text-[#FF7B1C] mt-0.5 block transition-colors underline"
                          >
                            054-225-1438
                          </a>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {lang === 'he'
                              ? 'מענה בשעות הפעילות ולתיאומי איסוף'
                              : 'Available during active hours for pickup coordination'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: מודל טייק אווי ואיסוף עצמי */}
                    <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#252A32] text-xs flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-[#FF7B1C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#FAF9F6]">
                          {lang === 'he' ? 'מודל טייק אווי ואיסוף עצמי' : 'Takeaway & Self-Pickup Model'}
                        </span>
                        <span className="text-[#94A3B8] mt-0.5 block leading-relaxed">
                          {lang === 'he'
                            ? 'טייק אווי והזמנות בוואטסאפ בלבד • ללא מקומות ישיבה • איסוף עצמי בתיאום מראש'
                            : 'Takeaway & WhatsApp orders only • No dine-in seating • Self-pickup by advance notice'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Google Maps & Navigation */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#14171C] border border-[#252A32] space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-[#FAF9F6] uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#FF7B1C]" />
                          <span>{lang === 'he' ? 'מפת האזור והגעה' : 'Area Map & Directions'}</span>
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#0B0C0E] text-[#94A3B8] border border-[#252A32]">
                          {lang === 'he' ? 'אדמו"ר מבעלזא 7, אשדוד 7730022' : 'Admor MiBelz 7, Ashdod 7730022'}
                        </span>
                      </div>

                      {/* Real Google Maps Embed */}
                      <div className="w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden border border-[#252A32] bg-[#0B0C0E] relative shadow-inner">
                        <iframe
                          title={lang === 'he' ? 'מפת מיקום סניף יהודלס אשדוד' : 'Yehudales Ashdod Location Map'}
                          src="https://maps.google.com/maps?q=%D7%90%D7%93%D7%9E%D7%95%22%D7%A8%20%D7%9E%D7%91%D7%A2%D7%9C%D7%96%D7%90%207%20%D7%90%D7%A9%D7%93%D7%95%D7%93%207730022&t=&z=16&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Navigation Action Buttons (Waze + Google Maps) */}
                    <div className="pt-3 border-t border-[#252A32] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-[#94A3B8] text-center sm:text-start font-medium">
                        {lang === 'he' ? 'בחרו אפליקציית ניווט להגעה מהירה:' : 'Choose navigation app for quick arrival:'}
                      </span>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <a
                          href="https://waze.com/ul?q=%D7%90%D7%93%D7%9E%D7%95%22%D7%A8%20%D7%9E%D7%91%D7%A2%D7%9C%D7%96%D7%90%207%2C%20%D7%90%D7%A9%D7%93%D7%95%D7%93%207730022&navigate=yes"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] text-[#FAF9F6] hover:text-[#FF7B1C] border border-[#252A32] font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Navigation className="w-4 h-4 text-[#FF7B1C]" />
                          <span>{lang === 'he' ? 'ניווט ב-Waze' : 'Navigate Waze'}</span>
                        </a>

                        <a
                          href="https://www.google.com/maps/search/?api=1&query=%D7%90%D7%93%D7%9E%D7%95%22%D7%A8%20%D7%9E%D7%91%D7%A2%D7%9C%D7%96%D7%90%207%2C%20%D7%90%D7%A9%D7%93%D7%95%D7%93%207730022"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A1D22] hover:bg-[#252A32] text-[#FAF9F6] hover:text-[#FF7B1C] border border-[#252A32] font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#FF7B1C]" />
                          <span>Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: ביקורות (Reviews — Intentionally empty clean content area ready for content to be added later) */}
            {activeSection === 'reviews' && (
              <div className="space-y-6 min-h-[260px]">
                {/* Intentionally empty clean content area ready for future reviews */}
                <div className="p-8 sm:p-14 rounded-2xl bg-[#14171C]/40 border border-[#252A32]/60 flex flex-col items-center justify-center min-h-[220px]" />
              </div>
            )}
          </div>

          {/* Minimal Apple-Style Glass Circle Close Button (Bottom Center) */}
          <div className="sticky bottom-3 inset-x-0 flex justify-center pointer-events-none z-30 pt-4 pb-2">
            <button
              onClick={onClose}
              type="button"
              className="group pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-md border border-white/20 hover:border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7B1C]"
              aria-label={lang === 'he' ? 'סגור חלונית' : 'Close panel'}
              title={lang === 'he' ? 'סגור חלונית' : 'Close panel'}
            >
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF9F6] group-hover:text-[#FF7B1C] transition-colors" strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
