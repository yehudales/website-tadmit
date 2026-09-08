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
 * - Uses native sessionStorage combined with an in-memory session flag.
 */

const SHIMMER_SESSION_KEY = 'yehudales_toolbar_text_shimmer_v1';
let memoryShimmerPlayed = false;

export const hasToolbarShimmerPlayed = (): boolean => {
  if (memoryShimmerPlayed) return true;

  if (typeof window === 'undefined') return false;

  // Reduced motion preference check
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  try {
    if (sessionStorage.getItem(SHIMMER_SESSION_KEY) === 'true') {
      memoryShimmerPlayed = true;
      return true;
    }
  } catch {
    // sessionStorage might be restricted (e.g. strict private mode)
  }

  return false;
};

export const markToolbarShimmerAsPlayed = (): void => {
  memoryShimmerPlayed = true;

  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SHIMMER_SESSION_KEY, 'true');
  } catch {
    // Fallback safely if sessionStorage write is prevented
  }
};
