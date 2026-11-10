import React, { useId } from 'react';
import styles from './Hud.module.css';

const point = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
};

const arc = ([from, to]: [number, number]) =>
  `M ${point(from, 265)} A 265 265 0 ${to - from > 180 ? 1 : 0} 1 ${point(to, 265)}`;

const circlePath = (r: number, from: number) =>
  `M ${point(from, r)} A ${r} ${r} 0 1 1 ${point(from + 180, r)} A ${r} ${r} 0 1 1 ${point(from, r)}`;

const RING_ARCS: [number, number][] = [
  [121, 257],
  [270, 338],
  [27, 60],
];

export const Hud: React.FC = () => {
  const filterId = useId();
  const clipId = useId();

  // Generate 24 spokes (every 15 degrees from 0 to 345)
  const spokes: { x1: string; y1: string; x2: string; y2: string }[] = [];
  const dots: { cx: string; cy: string }[] = [];

  for (let i = 0; i < 24; i++) {
    const deg = i * 15;
    const a = (deg * Math.PI) / 180;
    const cos = Math.cos(a);
    const sin = Math.sin(a);

    spokes.push({
      x1: (105 * cos).toFixed(2),
      y1: (105 * sin).toFixed(2),
      x2: (190 * cos).toFixed(2),
      y2: (190 * sin).toFixed(2),
    });

    dots.push({
      cx: (150 * cos).toFixed(2),
      cy: (150 * sin).toFixed(2),
    });
    dots.push({
      cx: (190 * cos).toFixed(2),
      cy: (190 * sin).toFixed(2),
    });
  }

  // Generate scan lines from y = -201 to 199 every 8
  const scanLines: number[] = [];
  for (let y = -201; y <= 199; y += 8) {
    scanLines.push(y);
  }

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        viewBox="-320 -320 640 640"
        className={styles.svg}
        data-scene="hud"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="0" cy="0" r="205" />
          </clipPath>

          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blurTight" />
            <feFlood style={{ floodColor: 'var(--hud-glow)' }} floodOpacity="1" result="floodTight" />
            <feComposite in="floodTight" in2="blurTight" operator="in" result="glowTight" />

            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blurWide" />
            <feFlood style={{ floodColor: 'var(--hud-glow)' }} floodOpacity="1" result="floodWide" />
            <feComposite in="floodWide" in2="blurWide" operator="in" result="glowWide" />

            <feMerge>
              <feMergeNode in="glowWide" />
              <feMergeNode in="glowTight" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Scan lines group */}
        <g
          className={styles.scanLines}
          data-scene="hud-scan"
          clipPath={`url(#${clipId})`}
        >
          {scanLines.map((y) => (
            <line
              key={y}
              x1="-205"
              y1={y}
              x2="205"
              y2={y}
              stroke="var(--white)"
              strokeWidth="1"
              strokeOpacity="0.25"
            />
          ))}
        </g>

        {/* Mesh group */}
        <g
          className={styles.mesh}
          data-scene="hud-mesh"
          stroke="var(--white)"
          strokeWidth="0.75"
          strokeOpacity="0.7"
          fill="none"
        >
          <circle cx="0" cy="0" r="150" />
          <circle cx="0" cy="0" r="190" />
          {spokes.map((spoke, i) => (
            <line
              key={i}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
            />
          ))}
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="1.6"
              fill="var(--white)"
              stroke="none"
            />
          ))}
        </g>

        {/* Strokes group with bloom filter */}
        <g className={styles.strokes} filter={`url(#${filterId})`}>
          {/* Outer ring */}
          <g data-scene="hud-ring">
            {RING_ARCS.map((angles, i) => (
              <path
                key={i}
                d={arc(angles)}
                pathLength={1}
                data-draw
              />
            ))}
          </g>

          {/* Horizontal line */}
          <path d="M 0 0 H -300" pathLength={1} data-draw />
          <path d="M 0 0 H 305" pathLength={1} data-draw />

          {/* Circles around pupil */}
          <path
            d={circlePath(80, -90)}
            stroke="var(--white)"
            strokeWidth="1.5"
            pathLength={1}
            data-draw
          />
          <path
            d={circlePath(105, 90)}
            stroke="var(--white)"
            strokeWidth="1.5"
            pathLength={1}
            data-draw
          />
        </g>
      </svg>
    </div>
  );
};
