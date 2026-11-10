import React, { useEffect, useRef } from 'react';
import styles from './PortraitCanvas.module.css';

interface PortraitCanvasProps {
  imageBitmap: ImageBitmap | null;
  transformRef: React.MutableRefObject<{ zoom: number; extra: number }>;
}

const IRIS = { x: 2248, y: 907, r: 36 }; // source px

export const PortraitCanvas: React.FC<PortraitCanvasProps> = ({
  imageBitmap,
  transformRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const probeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const probe = probeRef.current;
    if (!canvas || !probe) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastZoom = -1;
    let lastExtra = -1;
    let lastWidth = -1;
    let lastHeight = -1;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastWidth = -1; // force redraw
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);
    updateSize();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      if (!imageBitmap) return;

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      if (W === 0 || H === 0) return;

      const { zoom, extra } = transformRef.current;

      if (
        zoom === lastZoom &&
        extra === lastExtra &&
        W === lastWidth &&
        H === lastHeight
      ) {
        return;
      }

      lastZoom = zoom;
      lastExtra = extra;
      lastWidth = W;
      lastHeight = H;

      const probeWidth = probe.getBoundingClientRect().width;
      const unit = probeWidth > 0 ? probeWidth / 100 : 1;
      const mobile = window.innerWidth < 1024;
      const IRIS_ON_SCREEN = mobile ? 150 : 210;

      const s0 = Math.max(W / imageBitmap.width, H / imageBitmap.height);
      const left0 = (W - imageBitmap.width * s0) / 2;
      const top0 = (H - imageBitmap.height * s0) * 0.25;
      const q0 = { x: left0 + IRIS.x * s0, y: top0 + IRIS.y * s0 };

      const s1 = (IRIS_ON_SCREEN * unit) / IRIS.r;
      const s = s0 * Math.pow(s1 / s0, zoom);
      const w = s1 !== s0 ? (s - s0) / (s1 - s0) : 0;
      const qx = q0.x + (W / 2 - q0.x) * w;
      const qy = q0.y + (H / 2 - q0.y) * w;
      const scale = s * (1 + 0.3 * extra);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        imageBitmap,
        IRIS.x - qx / scale,
        IRIS.y - qy / scale,
        W / scale,
        H / scale,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [imageBitmap, transformRef]);

  return (
    <>
      <div ref={probeRef} className={styles.probe} aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-scene="portrait"
        aria-hidden="true"
      />
    </>
  );
};
