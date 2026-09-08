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

export const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Compositor-friendly reveal configuration for Toolbar Banners.
 * Uses GPU-accelerated clipPath and opacity instead of height: "auto" in document flow.
 * Preserves the exact 1.54s open / 1.50s close timing with the 1.00s final slow deceleration phase.
 */
export const getBannerRevealConfig = (shouldReduceMotion: boolean | null | undefined) => {
  if (shouldReduceMotion) {
    return {
      initial: {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
      },
      open: {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        transition: { duration: 0 },
      },
      closed: {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        transition: { duration: 0 },
      },
    };
  }

  const isMobile = isMobileViewport();

  if (isMobile) {
    return {
      initial: {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
      },
      open: {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        transition: {
          clipPath: { duration: 1.54, ease: DRAWER_EASING },
          opacity: { duration: 0.28, ease: 'easeOut' },
        },
      },
      closed: {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        transition: {
          clipPath: { duration: 1.50, ease: DRAWER_EASING },
          opacity: { duration: 0.28, ease: 'easeOut', delay: 1.22 },
        },
      },
    };
  }

  return {
    initial: {
      clipPath: 'inset(0 0 100% 0)',
      opacity: 0,
    },
    open: {
      clipPath: 'inset(0 0 0% 0)',
      opacity: 1,
      transition: {
        clipPath: { duration: 1.54, ease: DRAWER_EASING },
        opacity: { duration: 0.32, ease: 'easeOut' },
      },
    },
    closed: {
      clipPath: 'inset(0 0 100% 0)',
      opacity: 0,
      transition: {
        clipPath: { duration: 1.50, ease: DRAWER_EASING },
        opacity: { duration: 1.40, ease: 'easeOut', delay: 0.05 },
      },
    },
  };
};

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

  const isMobile = isMobileViewport();

  if (isMobile) {
    return {
      open: {
        height: 'auto',
        opacity: 1,
        transition: {
          // Exactly 1.54s with DRAWER_EASING: normal traversal + 1.00s deceleration phase
          height: { duration: 1.54, ease: DRAWER_EASING },
          opacity: { duration: 0.28, ease: 'easeOut' },
        },
      },
      closed: {
        height: 0,
        opacity: 0,
        transition: {
          // Exactly 1.50s with DRAWER_EASING for physical collapse with 1.00s final slow phase
          height: { duration: 1.50, ease: DRAWER_EASING },
          // Mobile optimization: avoids 1.4s of continuous offscreen framebuffer alpha blending
          // that causes layout+composite frame drops on mobile GPUs.
          // Fades opacity gently in the final deceleration phase while maintaining smooth 60/120fps.
          opacity: { duration: 0.28, ease: 'easeOut', delay: 1.22 },
        },
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

