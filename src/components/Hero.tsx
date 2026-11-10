import React from 'react';
import { Chars } from './Chars';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Top block */}
      <div className={styles.topBlock}>
        <div className={styles.eyebrow} data-reveal="label">
          Next-Generation Contact Lenses
        </div>
        <h1
          className={styles.headline}
          aria-label="See everything. Feel nothing."
          data-reveal="headline"
        >
          <Chars text="See everything." className={styles.headlineLine1} />
          <Chars text="Feel nothing." className={styles.headlineLine2} />
        </h1>
      </div>

      {/* Callout Card & Pager */}
      <div className={styles.calloutWrapper} data-reveal="callout">
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardInfo}>
              <span className={styles.cardTitle}>16 hours</span>
              <span className={styles.cardSub}>All-Day Comfort</span>
            </div>
            <a href="#" className={styles.moreLink}>
              <span>More</span>
              <img
                src="https://assets.uberdesigner.ai/lucent/arrow-sm.svg"
                alt=""
                width="10.8536"
                height="10.8536"
                className={styles.arrowSm}
              />
            </a>
          </div>
          <img
            src="https://assets.uberdesigner.ai/lucent/eye-card.webp"
            alt="Close-up of a blue eye"
            width="940"
            height="788"
            className={styles.cardImage}
          />
        </div>

        <div className={styles.pager} aria-hidden="true">
          <div className={styles.pagerDotActive} />
          <div className={styles.pagerDot} />
          <div className={styles.pagerDot} />
          <div className={styles.pagerDot} />
        </div>
      </div>

      {/* Bottom block */}
      <div className={styles.bottomBlock}>
        <p className={styles.bodyCopy} data-reveal="body">
          A new class of daily silicone hydrogel lenses engineered<br className={styles.desktopBr} />
          for exceptional oxygen flow, moisture retention, and zero-<br className={styles.desktopBr} />
          gravity comfort all day long.
        </p>

        <div className={styles.buttonRow} data-reveal="buttons">
          <a href="#" className={styles.primaryBtn}>
            Explore Technology
          </a>
          <a href="#" className={styles.secondaryBtn}>
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} data-reveal="scroll">
        <span>Scroll down</span>
        <div className={styles.scrollCircle} aria-hidden="true">
          ↓
        </div>
      </div>
    </section>
  );
};
