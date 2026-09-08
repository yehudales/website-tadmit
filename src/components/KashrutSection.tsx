import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Language } from '../types';
import { InteractiveDisclosureTrigger } from './InteractiveDisclosureTrigger';
import { KashrutTabContent } from './KashrutBanner';
import { getDrawerAnimationConfig } from '../utils/drawerAnimation';

interface KashrutSectionProps {
  lang: Language;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const KashrutSection: React.FC<KashrutSectionProps> = ({
  lang,
  isOpen,
  onToggle,
  onClose,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const drawerAnim = getDrawerAnimationConfig(shouldReduceMotion);

  return (
    <section
      id="kashrut-section"
      aria-label={lang === 'he' ? 'כשרות למהדרין' : 'Strict Mehadrin Kosher'}
      className="w-full bg-[#0B0C0E] py-2 sm:py-2.5 relative z-30 select-none"
    >
      {/* Centered Standalone Disclosure Trigger (No banner background, no border, no card frame) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <InteractiveDisclosureTrigger
          variant="kashrut-arrow"
          isOpen={isOpen}
          onToggle={onToggle}
          label={lang === 'he' ? 'כשר למהדרין' : 'Strict Mehadrin Kosher'}
          ariaControls="kashrut-drawer-container"
          ariaLabelOpen={lang === 'he' ? 'סגור פירוט כשרות למהדרין' : 'Close strict kosher details'}
          ariaLabelClosed={lang === 'he' ? 'פתח פירוט כשר למהדרין' : 'Open strict kosher details'}
        />
      </div>

      {/* Expandable Drawer Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="kashrut-drawer-container"
            initial={{ opacity: 0, height: 0 }}
            animate={drawerAnim.open}
            exit={drawerAnim.closed}
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'height' }}
            className="w-full overflow-hidden"
          >
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-2">
              <KashrutTabContent lang={lang} onClose={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
