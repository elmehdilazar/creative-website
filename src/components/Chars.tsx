import React from 'react';
import styles from './Chars.module.css';

interface CharsProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Chars: React.FC<CharsProps> = ({ text, className, style }) => {
  return (
    <span
      className={`${styles.line} ${className || ''}`}
      style={style}
      data-line
      aria-hidden="true"
    >
      {text.split('').map((char, index) => (
        <span key={index} className={styles.char} data-char>
          {char}
        </span>
      ))}
    </span>
  );
};
