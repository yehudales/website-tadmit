/**
 * Physical Drawer Animation Configuration for Expandable Banners & Tabs
 *
 * Requirements:
 * - Normal speed during the main traversal
 * - A few pixels before reaching final destination (open or closed), enters a smooth deceleration phase
 * - The final slow phase takes EXACTLY 1 second to complete
 * - Progressive deceleration: continuous movement without freeze, bounce, overshoot, or abrupt stop
 * - Respects prefers-reduced-motion
 */

export const DRAWER_EASING: [number, number, number, number] = [0.03, 0.94, 0.16, 0.985];

export const getDrawerAnimationConfig = (shouldReduceMotion: boolean | null | undefined) => {
  if (shouldReduceMotion) {
    return {
      open: {
        height: 'auto',
        opacity: 1,
        transition: { duration: 0 },
      },
      closed: {
        height: 0,
        opacity: 0,
        transition: { duration: 0 },
      },
    };
  }

  return {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        // Base normal speed traversal (~0.54s) + exactly 1.00s final slow deceleration = 1.54s
        height: { duration: 1.54, ease: DRAWER_EASING },
        opacity: { duration: 0.32, ease: 'easeOut' },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        // Base normal speed traversal (~0.50s) + exactly 1.00s final slow deceleration = 1.50s
        height: { duration: 1.50, ease: DRAWER_EASING },
        opacity: { duration: 1.40, ease: 'easeOut', delay: 0.05 },
      },
    },
  };
};

