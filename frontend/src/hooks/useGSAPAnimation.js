import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGSAPFadeIn = (deps = [], options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(elementRef.current, {
        opacity: 0,
        y: options.y || 24,
        duration: options.duration || 0.8,
        delay: options.delay || 0.1,
        ease: options.ease || 'power3.out',
        stagger: options.stagger || 0
      });
    }, elementRef);

    return () => ctx.revert();
  }, deps);

  return elementRef;
};
