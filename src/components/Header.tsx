import React from 'react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header} data-reveal="header">
      <a href="#" className={styles.logoLink} aria-label="Lucent">
        <img
          src="https://assets.uberdesigner.ai/lucent/logo.svg"
          alt="Lucent"
          width="108.867"
          height="20.0006"
          className={styles.logo}
        />
      </a>

      <nav className={styles.nav} aria-label="Main Navigation">
        <a href="#" className={styles.navLink}>Technology</a>
        <a href="#" className={styles.navLink}>Benefits</a>
        <a href="#" className={styles.navLink}>Materials</a>
        <a href="#" className={styles.navLink}>Science</a>
        <a href="#" className={styles.navLink}>Support</a>
      </nav>

      <a href="#" className={styles.actionBtn}>
        Find a Store
      </a>
    </header>
  );
};
