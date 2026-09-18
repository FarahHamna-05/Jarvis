import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const pointerRef = useRef(null);
  const trailRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine-pointer devices (mouse/trackpad)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const render = () => {
      // Smooth lerp for trailing 8-bit companion square
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(render);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest(
        'button, a, input, textarea, select, [role="button"], .clickable, [data-clickable]'
      );
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* 1. Trailing 8-Bit Pixel Square Companion */}
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '28px' : isClicked ? '16px' : '20px',
          height: isHovered ? '28px' : isClicked ? '16px' : '20px',
          borderRadius: '4px',
          background: isHovered ? 'rgba(245, 79, 27, 0.18)' : 'rgba(245, 79, 27, 0.08)',
          border: '2px solid rgba(245, 79, 27, 0.75)',
          boxShadow: isHovered
            ? '0 0 16px rgba(245, 79, 27, 0.5), inset 0 0 8px rgba(245, 79, 27, 0.3)'
            : '0 0 10px rgba(245, 79, 27, 0.3)',
          pointerEvents: 'none',
          zIndex: 999998,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border 0.2s ease, opacity 0.2s ease',
          willChange: 'transform'
        }}
      />

      {/* 2. Main 8-Bit Retro Pixel Cursor Pointer */}
      <div
        ref={pointerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999999,
          opacity: isVisible ? 1 : 0,
          transformOrigin: '0 0',
          transition: 'opacity 0.2s ease',
          willChange: 'transform'
        }}
      >
        <div style={{
          transform: isClicked ? 'scale(0.88) translate(2px, 2px)' : isHovered ? 'scale(1.15) translate(-4px, -2px)' : 'scale(1)',
          transition: 'transform 0.14s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.45))'
        }}>
          {isHovered ? (
            /* 8-Bit Pixel Pointing Hand */
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
            >
              {/* Dark Outline */}
              <path
                d="M8 2h3v10h1V8h3v4h1v-2h3v5h-1v2h-1v2h-1v2H9v-2H7v-2H5v-4h2v2h1V2z"
                fill="#1E223D"
              />
              {/* Exotic Orange Primary Fill */}
              <path
                d="M9 3h1v9h2V9h1v4h2v-2h1v2h1v2h-1v2h-1v2h-1v1H10v-2H8v-2H6v-2h1v1h1V3z"
                fill="#F54F1B"
              />
              {/* Crisp White Pixel Highlights */}
              <rect x="9" y="3" width="1" height="6" fill="#ffffff" />
              <rect x="12" y="9" width="1" height="3" fill="#ffffff" />
              <rect x="14" y="11" width="1" height="2" fill="#ffffff" />
            </svg>
          ) : (
            /* 8-Bit Pixel Arrow Pointer */
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
            >
              {/* Outer Dark Pixel Outline for contrast */}
              <path
                d="M2 1v19l5-5 3 6 4-2-3-6h6L2 1z"
                fill="#1E223D"
                stroke="#1E223D"
                strokeWidth="1.5"
                strokeLinejoin="miter"
              />
              {/* Inner Exotic Orange Fill */}
              <path
                d="M3.5 3v14.5l3.8-3.8 3 6 2-1-3-6h4.7L3.5 3z"
                fill="#F54F1B"
              />
              {/* Crisp Pixel Accent Spine */}
              <path
                d="M4 4v10.5l2.6-2.6 2.8 5.6 0.8-0.4-2.8-5.6h3.4L4 4z"
                fill="#ffffff"
                fillOpacity="0.9"
              />
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
