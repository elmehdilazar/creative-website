import React from 'react';
import styles from './LensStack.module.css';

interface LensStackProps {
  active: number | null;
}

const LENS_LAYERS = [
  {
    src: 'https://assets.uberdesigner.ai/lucent/lens-1.webp',
    width: 631,
    height: 1100,
    alt: 'Lens layer 1, textured',
    i: -1.5,
  },
  {
    src: 'https://assets.uberdesigner.ai/lucent/lens-2.webp',
    width: 587,
    height: 1100,
    alt: 'Lens layer 2, blue',
    i: -0.5,
  },
  {
    src: 'https://assets.uberdesigner.ai/lucent/lens-3.webp',
    width: 581,
    height: 1100,
    alt: 'Lens layer 3, clear',
    i: 0.5,
  },
  {
    src: 'https://assets.uberdesigner.ai/lucent/lens-4.webp',
    width: 569,
    height: 1100,
    alt: 'Lens layer 4, rim',
    i: 1.5,
  },
];

export const LensStack: React.FC<LensStackProps> = ({ active }) => {
  return (
    <div className={styles.lensBox} data-scene="lens" aria-hidden="true">
      {LENS_LAYERS.map((layer, index) => {
        const isDotActive = active === index;
        return (
          <div
            key={index}
            className={styles.layer}
            style={{ '--i': layer.i } as React.CSSProperties}
          >
            <img
              src={layer.src}
              width={layer.width}
              height={layer.height}
              alt={layer.alt}
              className={styles.lensImg}
            />
            <div
              className={`${styles.glowDot} ${
                isDotActive ? styles.glowDotActive : ''
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
