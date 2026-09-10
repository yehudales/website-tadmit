/**
 * Single source of truth for top-level application overlay root.
 * Mounts directly to document.documentElement (root <html>) to guarantee that
 * overlay portals (ProductSheetModal, CartDrawer, etc.) completely escape
 * any body-level scroll lock (e.g. position: fixed, top: -scrollY), overflow clipping,
 * or ancestor stacking contexts.
 */
export const getOverlayRoot = (): HTMLElement => {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLElement;
  }
  let root = document.getElementById('overlay-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'overlay-root';
    document.documentElement.appendChild(root);
  } else if (root.parentElement !== document.documentElement) {
    document.documentElement.appendChild(root);
  }
  return root;
};
