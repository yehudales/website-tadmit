/**
 * Physical Drawer Animation Configuration for Expandable Banners & Tabs
 *
 * Requirements:
 * - Physical drawer pull-down / contract-up feel
 * - Motion profile: FAST → SMOOTH → GENTLE DECELERATION → SOFT FINAL SETTLE
 * - Timing: ~450-650ms (540ms open, 500ms close)
 * - Easing: Refined cubic-bezier [0.22, 1, 0.36, 1] (no bounce, no overshoot, zero abrupt stops)
 * - Respects prefers-reduced-motion
 */

export const DRAWER_EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
        height: { duration: 0.54, ease: DRAWER_EASING },
        opacity: { duration: 0.32, ease: 'easeOut' },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.50, ease: DRAWER_EASING },
        opacity: { duration: 0.36, ease: DRAWER_EASING, delay: 0.1 },
      },
    },
  };
};
