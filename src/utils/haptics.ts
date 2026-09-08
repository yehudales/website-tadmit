/**
 * Mobile-Only Light Short Haptic Feedback Utility
 * 
 * Rules:
 * - Triggered ONLY on mobile / touch-capable environments (no vibration on desktop mouse clicks).
 * - Very light and short single vibration (~15ms).
 * - Safe fail-through when navigator.vibrate is unsupported or restricted.
 */
export const triggerMobileHaptic = (durationMs: number = 15): void => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }

  // Detect touch / mobile capabilities to avoid firing on desktop mouse clicks
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

  if (!isTouchDevice) {
    return;
  }

  if (typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Silently catch if Vibration API is blocked or throws
    }
  }
};
