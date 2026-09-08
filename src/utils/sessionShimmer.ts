/**
 * Session-level check for the one-time top toolbar text entrance shimmer.
 * 
 * Rules:
 * - Runs ONLY when the page is opened for the first time in the current page session/load.
 * - Does NOT replay on scroll.
 * - Does NOT replay when opening/closing a toolbar item.
 * - Does NOT replay when switching pages/sections.
 * - Does NOT replay on every render.
 * - Does NOT replay when the component remounts during normal interaction.
 * - Respects prefers-reduced-motion: if enabled, skips the animation immediately.
 */

// In-memory guard for the current page session/load
let pageSessionPlayed = false;

export const hasToolbarShimmerPlayed = (): boolean => {
  if (pageSessionPlayed) return true;

  if (typeof window === 'undefined') return false;

  // Respect reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // Clear any legacy stale session keys that might have permanently blocked reloads
  try {
    sessionStorage.removeItem('yehudales_toolbar_text_shimmer_v1');
  } catch {
    // Ignore storage errors
  }

  return false;
};

export const markToolbarShimmerAsPlayed = (): void => {
  pageSessionPlayed = true;
};
