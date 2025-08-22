import { useState, useEffect, useCallback } from 'react';

interface UseScrollYReturn {
  scrollY: number;
  isScrolled: boolean;
}

export function useScrollY(): UseScrollYReturn {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY);

    // Add scroll listener with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const isScrolled = scrollY > 50;

  return { scrollY, isScrolled };
}

// Alternative export for simple usage
export function useScrollYSimple(): number {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return scrollY;
}