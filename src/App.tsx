import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Features } from './components/Features.tsx';
import { PortraitCanvas } from './components/PortraitCanvas.tsx';
import { Hud } from './components/Hud.tsx';
import { LensStack } from './components/LensStack.tsx';
import styles from './App.module.css';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const transformRef = useRef({ zoom: 0, extra: 0 });

  useEffect(() => {
    let isCancelled = false;

    const loadAll = async () => {
      // 1. Wait for fonts
      try {
        await Promise.all([
          document.fonts.load('400 1em "Instrument Sans"'),
          document.fonts.load('500 1em "Instrument Sans"'),
        ]);
      } catch (err) {
        console.warn('Font loading error or unsupported:', err);
      }

      // 2. Fetch and decode portrait into ImageBitmap
      let bitmap: ImageBitmap | null = null;
      try {
        const response = await fetch('https://assets.uberdesigner.ai/lucent/portrait.webp');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        bitmap = await createImageBitmap(blob);
      } catch (err) {
        console.error('Failed to load portrait:', err);
      }

      if (!isCancelled) {
        if (bitmap) {
          setImageBitmap(bitmap);
        }
        setLoaded(true);
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !rootRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef.current);

      // Target scene elements
      const scene = q('[data-scene="scene"]')[0];
      const portraitCanvas = q('[data-scene="portrait"]')[0];
      const wash = q('[data-scene="wash"]')[0];
      const hudSvg = q('[data-scene="hud"]')[0];
      const hudRing = q('[data-scene="hud-ring"]')[0];
      const hudScan = q('[data-scene="hud-scan"]')[0];
      const hudMesh = q('[data-scene="hud-mesh"]')[0];
      const hudStrokes = q('[data-draw]');
      const lensBox = q('[data-scene="lens"]')[0];
      const track = q('[data-scene="track"]')[0];

      // Target reveal elements
      const header = q('[data-reveal="header"]')[0];
      const eyebrow = q('[data-reveal="label"]')[0];
      const headline = q('[data-reveal="headline"]')[0];
      const line1Chars = q('[data-reveal="headline"] [data-line]:first-child [data-char]');
      const line2Chars = q('[data-reveal="headline"] [data-line]:last-child [data-char]');
      const bodyCopy = q('[data-reveal="body"]')[0];
      const buttons = q('[data-reveal="buttons"]')[0];
      const scrollHint = q('[data-reveal="scroll"]')[0];
      const callout = q('[data-reveal="callout"]')[0];

      // M1 · Intro timeline
      const introTl = gsap.timeline();

      if (reducedMotion) {
        if (line1Chars.length) gsap.set(line1Chars, { opacity: 1 });
        if (line2Chars.length) gsap.set(line2Chars, { opacity: 1 });
        if (lensBox) gsap.set(lensBox, { '--spread': 1 });

        const allReveal = [
          portraitCanvas,
          header,
          eyebrow,
          headline,
          bodyCopy,
          buttons,
          scrollHint,
          callout,
        ].filter(Boolean);

        introTl.fromTo(
          allReveal,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power1.out',
            clearProps: 'transform',
          },
          0
        );

        // M2 · Reduced motion scroll scene
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
          defaults: { ease: 'none' },
        });

        if (track) {
          scrollTl.fromTo(
            track,
            { yPercent: 0 },
            { yPercent: -50, duration: 0.7, ease: 'power1.inOut' },
            1.0
          );
        }
        if (wash) {
          scrollTl.fromTo(
            wash,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: 'power1.inOut' },
            1.4
          );
        }
        if (lensBox) {
          scrollTl.fromTo(
            lensBox,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.out' },
            1.5
          );
        }
        scrollTl.set({}, {}, 3.0);
      } else {
        // Standard full motion
        // 0: portrait canvas | opacity 0, blur(40px) -> 1, blur(0) | 0.6
        if (portraitCanvas) {
          introTl.fromTo(
            portraitCanvas,
            { opacity: 0, filter: 'blur(40px)' },
            {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'filter',
            },
            0
          );
        }

        // 0.1: header | opacity 0, y +24, blur(8px) -> 1, 0, 0 | 0.45
        if (header) {
          introTl.fromTo(
            header,
            { opacity: 0, y: 24, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.45,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.1
          );
        }

        // 0.1: eyebrow | opacity 0, y +20, blur(8px) -> normal | 0.45
        if (eyebrow) {
          introTl.fromTo(
            eyebrow,
            { opacity: 0, y: 20, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.45,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.1
          );
        }

        // 0.35: bottom paragraph | opacity 0, y +30, blur(8px) -> normal | 0.5
        if (bodyCopy) {
          introTl.fromTo(
            bodyCopy,
            { opacity: 0, y: 30, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.35
          );
        }

        // 0.35: headline h1 becomes visible
        if (headline) {
          introTl.set(headline, { opacity: 1 }, 0.35);
        }

        // 0.35: headline line 1, per character | stagger 0.02 | 0.4 each
        if (line1Chars.length) {
          introTl.fromTo(
            line1Chars,
            { opacity: 0, yPercent: 35, filter: 'blur(12px)' },
            {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              stagger: 0.02,
              duration: 0.4,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.35
          );
        }

        // 0.47: headline line 2, per character | stagger 0.02 | 0.4 each
        if (line2Chars.length) {
          introTl.fromTo(
            line2Chars,
            { opacity: 0, yPercent: 35, filter: 'blur(12px)' },
            {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              stagger: 0.02,
              duration: 0.4,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.47
          );
        }

        // 0.55: button row | opacity 0, y +20, blur(8px) -> normal | 0.5
        if (buttons) {
          introTl.fromTo(
            buttons,
            { opacity: 0, y: 20, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.55
          );
        }

        // 0.6: scroll hint | opacity 0, y +20, blur(8px) -> normal | 0.5
        if (scrollHint) {
          introTl.fromTo(
            scrollHint,
            { opacity: 0, y: 20, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.6
          );
        }

        // 0.95: callout (card + pager) | opacity 0, y +16, blur(10px) -> normal | 0.4
        if (callout) {
          introTl.fromTo(
            callout,
            { opacity: 0, y: 16, filter: 'blur(10px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.4,
              ease: 'power2.out',
              clearProps: 'filter,transform',
            },
            0.95
          );
        }

        // M2 · Scroll scene timeline
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
          defaults: { ease: 'none' },
        });

        // 0 -> 1: portrait zoom
        scrollTl.fromTo(
          transformRef.current,
          { zoom: 0 },
          { zoom: 1, duration: 1, ease: 'power1.inOut' },
          0
        );

        // 0.65 -> 1.05: scanner svg
        if (hudSvg) {
          scrollTl.fromTo(
            hudSvg,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
            0.65
          );
        }

        // 0.65 -> 1.05: every scanner stroke
        if (hudStrokes.length) {
          scrollTl.fromTo(
            hudStrokes,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' },
            0.65
          );
        }

        // 0.65 -> 1.7: the ring's group (rotation -20 -> 25)
        if (hudRing) {
          scrollTl.fromTo(
            hudRing,
            { rotation: -20, svgOrigin: '0 0' },
            { rotation: 25, svgOrigin: '0 0', duration: 1.05, ease: 'none' },
            0.65
          );
        }

        // 0.75 -> 1.05: scan lines group (opacity 0 -> 1)
        if (hudScan) {
          scrollTl.fromTo(
            hudScan,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'none' },
            0.75
          );
        }

        // 0.95 -> 1.2: mesh group (opacity 0, scale 0.92 -> 1, 1)
        if (hudMesh) {
          scrollTl.fromTo(
            hudMesh,
            { opacity: 0, scale: 0.92, svgOrigin: '0 0' },
            { opacity: 1, scale: 1, svgOrigin: '0 0', duration: 0.25, ease: 'power2.out' },
            0.95
          );
        }

        // 1.0 -> 1.7: track (yPercent 0 -> -50)
        if (track) {
          scrollTl.fromTo(
            track,
            { yPercent: 0 },
            { yPercent: -50, duration: 0.7, ease: 'power1.inOut' },
            1.0
          );
        }

        // 1.4 -> 1.75: portrait extra
        scrollTl.fromTo(
          transformRef.current,
          { extra: 0 },
          { extra: 1, duration: 0.35, ease: 'power1.in' },
          1.4
        );

        // 1.4 -> 1.75: wash (opacity 0 -> 1)
        if (wash) {
          scrollTl.fromTo(
            wash,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: 'power1.inOut' },
            1.4
          );
        }

        // 1.4 -> 1.7: scanner svg (opacity -> 0, scale -> 1.3)
        if (hudSvg) {
          scrollTl.to(
            hudSvg,
            { opacity: 0, scale: 1.3, duration: 0.3, ease: 'power1.in' },
            1.4
          );
        }

        // 1.5 -> 1.9: lens box (opacity 0 -> 1, scale 1.6 -> 1, blur 16px -> 0)
        if (lensBox) {
          scrollTl.fromTo(
            lensBox,
            { opacity: 0, scale: 1.6 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
            1.5
          );

          const blurObj = { px: 16 };
          scrollTl.fromTo(
            blurObj,
            { px: 16 },
            {
              px: 0,
              duration: 0.4,
              ease: 'power2.out',
              onUpdate: () => {
                const el = lensBox as HTMLElement;
                if (blurObj.px > 0.05 && blurObj.px < 15.95) {
                  el.style.filter = `blur(${blurObj.px.toFixed(2)}px)`;
                } else {
                  el.style.filter = '';
                }
              },
            },
            1.5
          );

          // 2.2 -> 2.8: lens box --spread 0 -> 1
          scrollTl.fromTo(
            lensBox,
            { '--spread': 0 },
            { '--spread': 1, duration: 0.6, ease: 'power2.inOut' },
            2.2
          );
        }

        // 2.8 -> 3.0: hold
        scrollTl.set({}, {}, 3.0);
      }
    }, rootRef);

    return () => {
      ctx.revert();
      const lensBox = rootRef.current?.querySelector('[data-scene="lens"]') as HTMLElement | null;
      if (lensBox) {
        lensBox.style.filter = '';
      }
    };
  }, [loaded]);

  return (
    <main ref={rootRef} className={styles.main}>
      <Header />

      <div className={styles.scene} data-scene="scene">
        <div className={styles.pin}>
          <div className={styles.stage}>
            <PortraitCanvas
              imageBitmap={imageBitmap}
              transformRef={transformRef}
            />
            <div className={styles.wash} data-scene="wash" />
            <Hud />
            <LensStack active={activeCard} />
          </div>

          <div className={styles.track} data-scene="track">
            <Hero />
            <Features active={activeCard} setActive={setActiveCard} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
