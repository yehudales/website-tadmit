import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, Language } from '../../types';
import { SAMPLE_MENU_ITEMS } from '../../config/businessConfig';
import { motion } from 'motion/react';
import { getOverlayRoot } from '../../utils/overlayRoot';
import { ProductSheetPanel } from './ProductSheetPanel';

interface ProductSheetModalProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: MenuItem, qty?: number) => void;
  getItemQuantity?: (productId: string) => number;
  onUpdateQuantity?: (productId: string, qty: number) => void;
}

type SheetStage = 'stage1' | 'stage2' | 'complete';
type NavTransition = 'idle' | 'forward_down' | 'forward_up' | 'back_sliding';

interface BackTransitionData {
  current: MenuItem;
  currentQty: number;
  previous: MenuItem;
  previousQty: number;
}

export const ProductSheetModal: React.FC<ProductSheetModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  onAddToCart,
  getItemQuantity,
  onUpdateQuantity,
}) => {
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(product);
  const [history, setHistory] = useState<{ product: MenuItem; quantity: number }[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [stage, setStage] = useState<SheetStage>('stage1');
  const [navTransition, setNavTransition] = useState<NavTransition>('idle');
  const [backTransitionData, setBackTransitionData] = useState<BackTransitionData | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const stageTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !product) {
      setStage('stage1');
      setIsClosing(false);
      setHistory([]);
      setActiveProduct(null);
      setNavTransition('idle');
      setBackTransitionData(null);
      setIsLocked(false);
      setIsScrollLocked(false);
      return;
    }

    // New initial open from main menu: reset navigation history and load initial product
    setActiveProduct(product);
    setHistory([]);
    setStage('stage1');
    setNavTransition('idle');
    setBackTransitionData(null);
    setIsLocked(false);
    setIsScrollLocked(false);
    setIsClosing(false);
    setQuantity(1);

    // Stage 1 initial expansion (~380ms) + exactly 1 second hold (1000ms) = 1380ms
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      setStage('stage2');
    }, 1380);

    return () => {
      if (stageTimerRef.current) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [isOpen, product?.id]);

  const currentDisplayProduct = activeProduct || product;

  if (!isOpen && !isClosing) return null;
  if (!currentDisplayProduct) return null;

  const handleClose = () => {
    if (stageTimerRef.current) {
      window.clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setNavTransition('idle');
    setBackTransitionData(null);
    setIsLocked(false);
    setIsClosing(true);
  };

  // FORWARD NAVIGATION: Product A -> Product B
  // Sequence:
  // Product A (FULL OPEN) -> moves DOWN to MIDDLE -> content switches to Product B -> moves UP to FULL OPEN
  const handleNavigateToProduct = (targetProduct: MenuItem) => {
    if (isLocked || !currentDisplayProduct) return;
    setIsLocked(true);
    setIsScrollLocked(true);

    // STEP 1 — DOWNWARD: Move the existing Product Banner DOWNWARD from FULL OPEN to MID-SCREEN (68vh)
    setNavTransition('forward_down');

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    // STEP 2 — CONTENT SWITCH: Once the banner reaches the middle position (~280ms), switch displayed product
    transitionTimerRef.current = window.setTimeout(() => {
      // Record current in history
      setHistory((prev) => [...prev, { product: currentDisplayProduct, quantity }]);
      // Switch product to target
      setActiveProduct(targetProduct);
      setQuantity(1);
      if (contentBodyRef.current) {
        contentBodyRef.current.scrollTo({ top: 0 });
      }

      // STEP 3 — UPWARD: Animate upward from middle to FULL OPEN (92vh)
      setNavTransition('forward_up');

      transitionTimerRef.current = window.setTimeout(() => {
        setNavTransition('idle');
        setStage('complete');
        setIsLocked(false);
        setIsScrollLocked(false);
      }, 380);
    }, 280);
  };

  // BACK NAVIGATION: Horizontal Push / Slide transition
  // Sequence:
  // [ Current Product ][ Previous Product ]
  // slides LEFT: Current exits left, Previous enters from right. No vertical motion!
  const handleBack = () => {
    if (history.length === 0 || isLocked || !currentDisplayProduct) return;
    setIsLocked(true);
    setIsScrollLocked(true);

    const previousEntry = history[history.length - 1];
    setBackTransitionData({
      current: currentDisplayProduct,
      currentQty: quantity,
      previous: previousEntry.product,
      previousQty: previousEntry.quantity || 1,
    });

    setNavTransition('back_sliding');
  };

  const handleBackSlideComplete = () => {
    if (backTransitionData) {
      setActiveProduct(backTransitionData.previous);
      setQuantity(backTransitionData.previousQty);
      setHistory((prev) => prev.slice(0, -1));
      setBackTransitionData(null);
      setNavTransition('idle');
      setStage('complete');
      setIsLocked(false);
      setIsScrollLocked(false);
      if (contentBodyRef.current) {
        contentBodyRef.current.scrollTo({ top: 0 });
      }
    }
  };

  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsClosing(false);
      setHistory([]);
      onClose();
    } else if (stage === 'stage2') {
      setStage('complete');
    }
  };

  const getRecommendations = (productId: string) => {
    return SAMPLE_MENU_ITEMS.filter((item) => item.id !== productId).slice(0, 2);
  };

  const handleAddMainProduct = () => {
    onAddToCart(currentDisplayProduct, quantity);
    handleClose();
  };

  // Compute container height based on current stage and forward transition
  const getContainerHeight = () => {
    if (navTransition === 'forward_down') return '68vh';
    if (navTransition === 'forward_up' || navTransition === 'back_sliding') return '92vh';
    if (stage === 'stage1') return '68vh';
    return '92vh';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="product-sheet-modal-portal"
      className="fixed inset-0 overflow-hidden select-none pointer-events-auto z-[70] font-shop shop-scope"
      style={{ zIndex: 'var(--z-product-banner, 70)' }}
    >
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Two-Stage Bottom Sheet Modal (Preserves single persistent DOM element to avoid bottom jumping) */}
      <motion.div
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        initial={{
          y: '100%',
          height: '68vh',
        }}
        animate={{
          y: isClosing ? '100%' : 0,
          height: getContainerHeight(),
        }}
        transition={{
          y: { duration: isClosing ? 0.28 : 0.38, ease: [0.16, 1, 0.3, 1] },
          height:
            navTransition === 'forward_down'
              ? { duration: 0.28, ease: [0.32, 0, 0.67, 0] }
              : navTransition === 'forward_up'
              ? { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        }}
        onAnimationComplete={handleAnimationComplete}
        className="fixed inset-x-0 bottom-0 max-w-lg mx-auto bg-[#0B0C0E] border-t border-[#1E232B] rounded-t-[28px] shadow-2xl flex flex-col z-10 overflow-hidden pointer-events-auto"
      >
        {navTransition === 'back_sliding' && backTransitionData ? (
          /* HORIZONTAL SLIDING TRACK: [ Current Product ][ Previous Product ] */
          <motion.div
            dir="ltr"
            className="flex flex-row w-[200%] h-full flex-nowrap"
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={handleBackSlideComplete}
          >
            {/* Panel 1: CURRENT PRODUCT (Slides LEFT out of view) */}
            <div className="w-1/2 h-full flex-shrink-0 overflow-hidden flex flex-col">
              <ProductSheetPanel
                product={backTransitionData.current}
                lang={lang}
                quantity={backTransitionData.currentQty}
                setQuantity={() => {}}
                hasHistory={true}
                isLocked={true}
                onClose={handleClose}
                onBack={() => {}}
                onNavigateToProduct={() => {}}
                recommendations={getRecommendations(backTransitionData.current.id)}
                onAddToCart={onAddToCart}
                getItemQuantity={getItemQuantity}
                onUpdateQuantity={onUpdateQuantity}
                handleAddMainProduct={() => {}}
                isScrollLocked={true}
              />
            </div>

            {/* Panel 2: PREVIOUS PRODUCT (Slides IN from RIGHT into full view) */}
            <div className="w-1/2 h-full flex-shrink-0 overflow-hidden flex flex-col">
              <ProductSheetPanel
                product={backTransitionData.previous}
                lang={lang}
                quantity={backTransitionData.previousQty}
                setQuantity={() => {}}
                hasHistory={history.length > 1}
                isLocked={true}
                onClose={handleClose}
                onBack={() => {}}
                onNavigateToProduct={() => {}}
                recommendations={getRecommendations(backTransitionData.previous.id)}
                onAddToCart={onAddToCart}
                getItemQuantity={getItemQuantity}
                onUpdateQuantity={onUpdateQuantity}
                handleAddMainProduct={() => {}}
                isScrollLocked={true}
              />
            </div>
          </motion.div>
        ) : (
          /* NORMAL SINGLE PRODUCT PANEL (Idle or Forward Transition) */
          <ProductSheetPanel
            product={currentDisplayProduct}
            lang={lang}
            quantity={quantity}
            setQuantity={setQuantity}
            hasHistory={history.length > 0}
            isLocked={isLocked}
            onClose={handleClose}
            onBack={handleBack}
            onNavigateToProduct={handleNavigateToProduct}
            recommendations={getRecommendations(currentDisplayProduct.id)}
            onAddToCart={onAddToCart}
            getItemQuantity={getItemQuantity}
            onUpdateQuantity={onUpdateQuantity}
            handleAddMainProduct={handleAddMainProduct}
            scrollRef={contentBodyRef}
            isScrollLocked={isScrollLocked || stage !== 'complete'}
          />
        )}
      </motion.div>
    </div>,
    getOverlayRoot()
  );
};
