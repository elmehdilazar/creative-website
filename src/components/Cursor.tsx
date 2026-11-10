import React, { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({
    currX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    currY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });

  useEffect(() => {
    // Only activate for devices with mouse / fine pointer
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!media.matches) return;

    const el = cursorRef.current;
    if (!el) return;

    posRef.current.currX = window.innerWidth / 2;
    posRef.current.currY = window.innerHeight / 2;
    posRef.current.targetX = window.innerWidth / 2;
    posRef.current.targetY = window.innerHeight / 2;

    el.style.transform = `translate3d(${posRef.current.currX}px, ${posRef.current.currY}px, 0) translate(-50%, -50%)`;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    let animFrame: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      animFrame = requestAnimationFrame(loop);
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;

      const { currX, currY, targetX, targetY } = posRef.current;
      // Frame-rate independent easing: k = 1 - 0.7^(dt / 16.67ms)
      const k = 1 - Math.pow(0.7, dt / 16.67);

      const nextX = currX + (targetX - currX) * k;
      const nextY = currY + (targetY - currY) * k;

      posRef.current.currX = nextX;
      posRef.current.currY = nextY;

      if (el) {
        el.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
      }
    };

    animFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isVisible ? styles.visible : ''}`}
      aria-hidden="true"
    />
  );
};
