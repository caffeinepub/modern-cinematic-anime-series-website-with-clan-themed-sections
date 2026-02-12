import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseParallaxOptions {
  speed?: number;
  maxOffset?: number;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, maxOffset = 100 } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Disable parallax if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    let ticking = false;

    const updateParallax = () => {
      if (!element) return;

      const scrollY = window.scrollY;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is in viewport
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        // Calculate offset based on scroll position
        const offset = Math.min(scrollY * speed, maxOffset);
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
      // Reset transform on cleanup
      if (element) {
        element.style.transform = '';
      }
    };
  }, [speed, maxOffset, prefersReducedMotion]);

  return elementRef;
}

