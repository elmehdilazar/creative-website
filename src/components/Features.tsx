import React from 'react';
import styles from './Features.module.css';

interface FeaturesProps {
  active: number | null;
  setActive: (index: number | null) => void;
}

const CARDS_DATA = [
  {
    num: '01',
    title: 'Oxygen Flow',
    copy: 'Micro-channels optimized to maximize oxygen permeability for healthier, whiter eyes throughout the day.',
  },
  {
    num: '02',
    title: 'UV Shield',
    copy: 'Integrated protective layering blocks harmful ultraviolet rays without affecting natural color perception.',
  },
  {
    num: '03',
    title: 'Moisture Matrix',
    copy: 'A moisture-retaining polymer layer that prevents dry-eye fatigue from morning until late at night.',
  },
  {
    num: '04',
    title: 'Precision Optics',
    copy: 'An ultra-thin, smooth surface engineered to direct light precisely into the pupil with minimal aberration.',
  },
];

export const Features: React.FC<FeaturesProps> = ({ active, setActive }) => {
  return (
    <section className={styles.features} aria-label="Features">
      <h2 className={styles.heading}>
        <span className={styles.headingLine1}>Four Layers.</span>
        <span className={styles.headingLine2}>One Invisible Feeling.</span>
      </h2>

      <p className={styles.lead}>
        Every single layer of Lucent contact lenses is<br className={styles.desktopBr} />
        individually designed to function seamlessly in<br className={styles.desktopBr} />
        harmony with your eye&apos;s natural anatomy.
      </p>

      <div className={styles.cardsRow} role="region" aria-label="Feature layers">
        {CARDS_DATA.map((card, i) => {
          const isActive = active === i;
          return (
            <article
              key={card.num}
              tabIndex={0}
              className={styles.card}
              data-active={isActive ? 'true' : 'false'}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') {
                  setActive(i);
                }
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') {
                  setActive(null);
                }
              }}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <span className={styles.cardNumber}>{card.num}</span>
              </div>

              <p className={styles.cardCopy}>{card.copy}</p>

              <div className={styles.arrowRow} aria-hidden={!isActive}>
                <div className={styles.arrowRowInner}>
                  <img
                    src="https://assets.uberdesigner.ai/lucent/arrow-lg.svg"
                    alt=""
                    width="20.8536"
                    height="20.8536"
                    className={styles.arrowLg}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
