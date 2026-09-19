import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

// Quintic smootherstep (C2 continuous: smooth zero-acceleration endpoints)
const smootherstep = (edge0, edge1, x) => {
  const v = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return v * v * v * (v * (v * 6 - 15) + 10);
};

export default function CinematicViewer({ onOpenAuth, goToTeamTrigger, goToFrontTrigger, goToFaqTrigger }) {
  const getInitialProgress = () => {
    try {
      const p = new URLSearchParams(window.location.search).get('progress');
      if (p !== null) return parseFloat(p);
      const page = new URLSearchParams(window.location.search).get('page');
      if (page === 'team') return 1.0;
      if (page === 'faq') return 2.0;
    } catch {
      // ignore
    }
    return 0;
  };

  // Continuous progress from 0.0 (Front Container) to 1.0 (3D Card Deck) to 2.0 (6-Card Showcase)
  const [targetProgress, setTargetProgress] = useState(getInitialProgress);
  const [currentProgress, setCurrentProgress] = useState(getInitialProgress);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Trigger scroll to Front Page stage when goToFrontTrigger updates
  useEffect(() => {
    if (goToFrontTrigger > 0) {
      setTargetProgress(0);
    }
  }, [goToFrontTrigger]);

  // Trigger scroll to 3D Team Card Deck stage when goToTeamTrigger updates
  useEffect(() => {
    if (goToTeamTrigger > 0) {
      setTargetProgress(1);
    }
  }, [goToTeamTrigger]);

  // Trigger scroll to 6-Card Creative Showcase (FAQ) stage when goToFaqTrigger updates
  useEffect(() => {
    if (goToFaqTrigger > 0) {
      setTargetProgress(2.0);
    }
  }, [goToFaqTrigger]);

  const currentProgressRef = useRef(currentProgress);
  currentProgressRef.current = currentProgress;

  // Silky-smooth frame-rate independent fluid interpolation physics (sleeps when idle)
  useEffect(() => {
    let animId;
    let isRunning = true;
    lastTimeRef.current = null;

    const updateInterpolation = (now) => {
      if (!isRunning) return;
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.04);
      lastTimeRef.current = now;

      const current = currentProgressRef.current;
      const diff = targetProgress - current;

      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = targetProgress;
        setCurrentProgress(targetProgress);
        return; // Settle and stop RAF loop until targetProgress changes!
      }

      // Optimal damping rate for buttery smooth responsiveness
      const factor = 1 - Math.exp(-7.5 * dt);
      const next = current + diff * factor;
      currentProgressRef.current = next;
      setCurrentProgress(next);

      animId = requestAnimationFrame(updateInterpolation);
    };

    if (Math.abs(targetProgress - currentProgressRef.current) >= 0.0001) {
      animId = requestAnimationFrame(updateInterpolation);
    }

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [targetProgress]);

  // Window-level smooth wheel scroll listener with proportional inertia
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (document.body.style.overflow === 'hidden') return;
      e.preventDefault();
      // Normalized delta for both mouse wheel steps and precision trackpads
      const scrollStep = e.deltaY * 0.00085;
      setTargetProgress((prev) => Math.min(Math.max(prev + scrollStep, 0), 2.0));
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, []);

  // Smooth touch / pointer drag scrubbing
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartProgressRef = useRef(0);

  const handlePointerDown = (e) => {
    if (e.target.closest('button, a, input, select, textarea, [role="button"], .clickable')) return;
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartProgressRef.current = targetProgress;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaY = dragStartYRef.current - e.clientY;
    const progressDelta = deltaY / 450;
    setTargetProgress(Math.min(Math.max(dragStartProgressRef.current + progressDelta, 0), 2.0));
  };

  const handlePointerUp = () => {
    if (isDragging) setIsDragging(false);
  };

  const t = currentProgress; // 0.0 to 2.0

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Perfectly Aligned & Balanced 3D Transformation Math:
  // t=0.0: Flat Front Container
  // t=0.5: Dynamic organic 3D tilt during scroll
  // t=1.0: Perfectly upright, centered 3D card deck & text
  // t=1.0 -> 2.0: Transition into 6-Card Creative Showcase
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Smooth rotation angles: peak mid-scroll, return to 0deg upright at end (t=1.0)
  const rotX = 18 * smootherstep(0.0, 0.5, t) * (1 - smootherstep(0.5, 1.0, t));
  const rotY = 12 * smootherstep(0.1, 0.5, t) * (1 - smootherstep(0.5, 1.0, t));
  const rotZ = -14 * smootherstep(0.15, 0.6, t) * (1 - smootherstep(0.6, 1.0, t));

  // Smooth scaling
  const scale = 1.0 - 0.12 * smootherstep(0.1, 0.5, t) + 0.08 * smootherstep(0.5, 1.0, t);

  // Opacities & Content visibility transitions
  const heroContentOpacity = 1 - smootherstep(0.05, 0.35, t);
  const heroContentY = -smootherstep(0.0, 0.35, t) * 30;

  const heroBgOpacity = 1 - smootherstep(0.35, 0.55, t);
  const deckOpacity = smootherstep(0.38, 0.58, t);

  // Side cards fan-out spread
  const deckSpread = smootherstep(0.55, 0.98, t);

  // Stage 4 Deck Exit Transition when moving into Showcase (t > 1.02)
  const deckExit = smootherstep(1.02, 1.25, t);
  const deckContainerOpacity = (1 - deckExit);
  const deckContainerY = -deckExit * 120;
  const deckContainerScale = scale * (1 - deckExit * 0.15);

  // Background text gliding - ONLY appears between Stage 3 & Stage 4, fades out upon entering Showcase
  const bgTextProgress = smootherstep(0.35, 0.95, t);
  const bgTextOpacity = smootherstep(0.40, 0.85, t) * (1 - smootherstep(1.02, 1.18, t));
  const line1X = -(1 - bgTextProgress) * 700;
  const line2X = (1 - bgTextProgress) * 700;
  const line3X = -(1 - bgTextProgress) * 700;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Stage 5: 6-Card Creative Showcase Math (t = 1.08 to 2.0)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const darkBgOpacity = smootherstep(1.04, 1.22, t);
  const showcaseOpacity = smootherstep(1.15, 1.30, t);
  const showcaseProgress = smootherstep(1.20, 1.95, t); // 0.0 to 1.0 settling at t=2.0
  const showcaseScrollY = (1 - showcaseProgress) * 45;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
        perspectiveOrigin: 'center center',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'default',
        touchAction: 'none'
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STATIONARY CANVAS WITH SOFT CHAMPAGNE AMBIENT WARMTH
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 85% 70% at 50% 35%, rgba(249, 231, 201, 0.45) 0%, rgba(255, 252, 248, 0.92) 55%, #ffffff 100%),
          #ffffff
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BACKGROUND PLAIN BOLD BIG TYPOGRAPHY (Solid Root Beer + Generous Vertical Spacing)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: bgTextOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '85px 20px 95px 20px'
        }}
      >
        {/* Line 1: Left -> Right */}
        <h2
          style={{
            fontSize: 'clamp(3.8rem, 8.8vw, 11.0rem)',
            fontWeight: 900,
            color: 'rgba(40, 11, 11, 0.12)',
            letterSpacing: '0.04em',
            lineHeight: 0.88,
            margin: 0,
            fontFamily: "'Bebas Neue', 'Anton', 'Barlow Condensed', 'Oswald', sans-serif",
            whiteSpace: 'nowrap',
            textAlign: 'center',
            textShadow: 'none',
            transform: `translateX(${line1X}px)`,
            willChange: 'transform'
          }}
        >
          BEFORE YOU'RE OUT OF STOCK
        </h2>

        {/* Line 2: Right -> Left */}
        <h2
          style={{
            fontSize: 'clamp(3.4rem, 7.8vw, 9.8rem)',
            fontWeight: 900,
            color: 'rgba(40, 11, 11, 0.12)',
            letterSpacing: '0.04em',
            lineHeight: 0.88,
            margin: 0,
            fontFamily: "'Bebas Neue', 'Anton', 'Barlow Condensed', 'Oswald', sans-serif",
            whiteSpace: 'nowrap',
            textAlign: 'center',
            textShadow: 'none',
            transform: `translateX(${line2X}px)`,
            willChange: 'transform'
          }}
        >
          AI INVENTORY & STOCKOUT PREDICTION
        </h2>

        {/* Line 3: Left -> Right */}
        <h2
          style={{
            fontSize: 'clamp(3.8rem, 8.8vw, 11.0rem)',
            fontWeight: 900,
            color: 'rgba(40, 11, 11, 0.12)',
            letterSpacing: '0.04em',
            lineHeight: 0.88,
            margin: 0,
            fontFamily: "'Bebas Neue', 'Anton', 'Barlow Condensed', 'Oswald', sans-serif",
            whiteSpace: 'nowrap',
            textAlign: 'center',
            textShadow: 'none',
            transform: `translateX(${line3X}px)`,
            willChange: 'transform'
          }}
        >
          NEVER MISS A SALE WITH BEFORESTOCK
        </h2>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN 3D CONTAINER & CARD DECK
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          position: 'relative',
          width: '94vw',
          maxWidth: '1300px',
          height: '680px',
          borderRadius: '40px',
          transform: `
            translateY(${deckContainerY}px)
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
            rotateZ(${rotZ}deg)
            scale(${deckContainerScale})
          `,
          transformStyle: 'preserve-3d',
          zIndex: 5,
          opacity: deckContainerOpacity,
          pointerEvents: deckContainerOpacity > 0.4 ? 'auto' : 'none',
          willChange: 'transform, opacity'
        }}
      >
        {/* Layer A: Stage 1 - Main Front Page Container (Champagne #F9E7C9 -> Fire Engine Red #C92924 -> Root Beer #280B0B) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: heroBgOpacity,
            pointerEvents: heroBgOpacity > 0.6 ? 'auto' : 'none',
            borderRadius: '40px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #F9E7C9 0%, #F9E7C9 12%, #EFA391 26%, #C92924 50%, #781816 76%, #280B0B 92%, #280B0B 100%)',
            border: '4px solid rgba(255, 255, 255, 0.95)',
            padding: '52px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 38px 95px rgba(40, 11, 11, 0.5), 0 16px 45px rgba(201, 41, 36, 0.32), 0 0 0 1.5px rgba(249, 231, 201, 0.28), inset 0 2px 6px rgba(255, 255, 255, 0.85), inset 0 -4px 10px rgba(40, 11, 11, 0.6)'
          }}
        >
          {/* Film Grain / Noise Texture Overlay (matching reference aesthetic) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* Deep Root Beer Ambient Base Vignette */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '320px',
            background: 'radial-gradient(ellipse 95% 85% at 50% 100%, rgba(40, 11, 11, 0.75) 0%, rgba(201, 41, 36, 0.2) 55%, transparent 88%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* Subtle Root Beer Bottom Edge Accent Bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, rgba(249, 231, 201, 0.1) 0%, rgba(249, 231, 201, 0.5) 50%, rgba(249, 231, 201, 0.1) 100%)',
            boxShadow: '0 -2px 10px rgba(201, 41, 36, 0.4)',
            zIndex: 2
          }} />

          {/* Hero Content inside Container */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            maxWidth: '860px',
            margin: '0 auto',
            opacity: heroContentOpacity,
            transform: `translateY(${heroContentY}px)`
          }}>
            {/* Main Headline in Luminous Pure White & Champagne */}
            <h1 style={{
              textAlign: 'center',
              margin: '0 0 20px 0',
              lineHeight: 1.05,
              textShadow: '0 4px 24px rgba(40, 11, 11, 0.65)'
            }}>
              <span style={{
                display: 'block',
                fontSize: 'clamp(3.2rem, 5.5vw, 4.8rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.035em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                BeforeStock.
              </span>
              <span style={{
                display: 'block',
                fontSize: 'clamp(3.0rem, 5.2vw, 4.6rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#F9E7C9',
                letterSpacing: '-0.01em',
                fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif",
                marginTop: '6px'
              }}>
                Before you're out of stock.
              </span>
            </h1>

            {/* Paragraph Subtitle in Soft Champagne */}
            <p style={{
              textAlign: 'center',
              fontSize: 'clamp(16px, 1.6vw, 18.5px)',
              color: 'rgba(249, 231, 201, 0.95)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: 0,
              fontWeight: 400,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              textShadow: '0 2px 12px rgba(40, 11, 11, 0.55)'
            }}>
              AI-driven stockout prediction, real-time demand forecasting, and automated supplier reordering. Catch inventory shortages before your customers do.
            </p>
          </div>
        </div>

        {/* Layer B: 3D Card Deck (Perfectly aligned & symmetrical) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: deckOpacity,
            pointerEvents: deckOpacity > 0.6 ? 'auto' : 'none',
            overflow: 'visible',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              height: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1300px'
            }}
          >
            {/* Card 1 (Far Left / First Container): Midnight Shadow with Flameburst Accent */}
            <div
              style={{
                position: 'absolute',
                width: '280px',
                height: '400px',
                borderRadius: '26px',
                padding: '28px 24px',
                background: 'linear-gradient(145deg, #220b02 0%, #0e0401 60%, #050505 100%)',
                color: '#ffffff',
                transform: `translateX(${-340 * deckSpread}px) scale(${0.86 + 0.14 * deckSpread}) rotateY(${14 * deckSpread}deg) translateZ(-60px)`,
                opacity: 1,
                border: '3.5px solid rgba(228, 228, 228, 0.65)',
                boxShadow: '0 30px 65px rgba(5, 5, 5, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C92924', letterSpacing: '0.08em', fontFamily: "'Silkscreen', monospace" }}>STOCK ALERT</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1.2, color: '#E4E4E4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Predictive Stockouts</h3>
              <span style={{ fontSize: '13px', opacity: 0.9, color: 'rgba(228, 228, 228, 0.8)' }}>Zero Revenue Loss</span>
            </div>

            {/* Card 2 (Mid Left): Deep Midnight Shadow & Flameburst Glow */}
            <div
              style={{
                position: 'absolute',
                width: '280px',
                height: '400px',
                borderRadius: '26px',
                padding: '28px 24px',
                background: 'linear-gradient(145deg, #180601 0%, #0a0300 50%, #050505 100%)',
                color: '#E4E4E4',
                transform: `translateX(${-170 * deckSpread}px) scale(${0.92 + 0.08 * deckSpread}) rotateY(${7 * deckSpread}deg) translateZ(-30px)`,
                opacity: 1,
                border: '3.5px solid rgba(228, 228, 228, 0.65)',
                boxShadow: '0 30px 65px rgba(5, 5, 5, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C92924', letterSpacing: '0.08em', opacity: 0.95, fontFamily: "'Silkscreen', monospace" }}>AI ENGINE</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1.2, color: '#E4E4E4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Demand Forecasting</h3>
              <span style={{ fontSize: '13px', opacity: 0.85, color: 'rgba(228, 228, 228, 0.8)' }}>Real-time Velocity</span>
            </div>

            {/* Card 3 (Center Front): Fire Engine Red & Root Beer (#C92924 -> #280B0B) */}
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '400px',
                borderRadius: '26px',
                padding: '28px 24px',
                background: 'linear-gradient(145deg, #E63833 0%, #C92924 45%, #280B0B 100%)',
                color: '#ffffff',
                zIndex: 10,
                opacity: 1,
                border: '4.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 35px 85px rgba(201, 41, 36, 0.5), 0 15px 35px rgba(40, 11, 11, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.9), inset 0 -4px 8px rgba(40, 11, 11, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}
            >
              {/* Organic contour blob shadow */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-15px',
                width: '190px',
                height: '230px',
                borderRadius: '45% 55% 60% 40%',
                background: 'rgba(40, 11, 11, 0.35)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: 0
              }} />

              {/* Top Tag: BEFORESTOCK AI */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(40, 11, 11, 0.45)',
                  color: '#F9E7C9',
                  fontFamily: "'Silkscreen', monospace"
                }}>
                  BEFORESTOCK AI
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#280B0B', background: '#F9E7C9', padding: '3px 8px', borderRadius: '6px' }}>
                  FEATURED
                </span>
              </div>

              {/* Center Content Title */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontSize: '25px',
                  fontWeight: 800,
                  margin: 0,
                  lineHeight: 1.2,
                  color: '#ffffff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  Never run out of inventory
                </h3>
              </div>

              {/* Footer info inside card */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#F9E7C9', opacity: 0.95 }}>Shopify & ERP Sync</span>
                <Sparkles size={19} color="#F9E7C9" />
              </div>
            </div>

            {/* Card 4 (Right Side Last Container): Midnight Shadow with Flameburst Accent */}
            <div
              style={{
                position: 'absolute',
                width: '280px',
                height: '400px',
                borderRadius: '26px',
                padding: '28px 24px',
                background: 'linear-gradient(145deg, #220b02 0%, #120501 55%, #050505 100%)',
                color: '#ffffff',
                transform: `translateX(${195 * deckSpread}px) scale(${0.92 + 0.08 * deckSpread}) rotateY(${-7 * deckSpread}deg) translateZ(-30px)`,
                opacity: 1,
                border: '3.5px solid rgba(228, 228, 228, 0.65)',
                boxShadow: '0 30px 65px rgba(5, 5, 5, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C92924', letterSpacing: '0.08em', fontFamily: "'Silkscreen', monospace" }}>AUTOMATION</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1.2, color: '#E4E4E4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Supplier Reordering</h3>
              <span style={{ fontSize: '13px', opacity: 0.9, color: 'rgba(228, 228, 228, 0.8)' }}>99.8% Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 5: 6-CARD CREATIVE SHOWCASE (t = 1.08 to 2.4)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Background Dark Space & Ambient Flares */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          opacity: darkBgOpacity,
          pointerEvents: darkBgOpacity > 0.5 ? 'auto' : 'none',
          background: 'radial-gradient(ellipse at 50% 50%, #1a0802 0%, #0d0401 55%, #050505 100%)',
          transition: 'opacity 0.2s ease',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Flare 1 (Top Right behind Card 02) */}
        <div style={{
          position: 'absolute',
          top: '6%',
          right: '8%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 41, 36, 0.55) 0%, rgba(201, 41, 36, 0.18) 45%, transparent 70%)',
          filter: 'blur(65px)',
          pointerEvents: 'none'
        }} />

        {/* Ambient Flare 2 (Middle Left behind Card 03) */}
        <div style={{
          position: 'absolute',
          top: '36%',
          left: '5%',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 41, 36, 0.5) 0%, rgba(201, 41, 36, 0.15) 45%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        {/* Ambient Flare 3 (Bottom Right behind Card 06) */}
        <div style={{
          position: 'absolute',
          bottom: '4%',
          right: '15%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 41, 36, 0.45) 0%, rgba(201, 41, 36, 0.12) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* Fine Grain Texture Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }} />

        {/* Background Typography behind cards */}
        {/* Top Right: "TIME" & "LOGISTICS" */}
        <div style={{
          position: 'absolute',
          top: '26%',
          right: '4%',
          pointerEvents: 'none',
          textAlign: 'right',
          userSelect: 'none',
          lineHeight: 0.88,
          zIndex: 0
        }}>
          <div style={{
            fontSize: 'clamp(5rem, 8.8vw, 8.8rem)',
            fontWeight: 900,
            color: 'rgba(201, 41, 36, 0.32)',
            fontFamily: "'Bebas Neue', 'Anton', sans-serif",
            letterSpacing: '0.03em',
            transform: `translateX(${(1 - showcaseProgress) * 35}px)`
          }}>
            TIME
          </div>
          <div style={{
            fontSize: 'clamp(5rem, 8.8vw, 8.8rem)',
            fontWeight: 900,
            color: 'rgba(201, 41, 36, 0.45)',
            fontFamily: "'Bebas Neue', 'Anton', sans-serif",
            letterSpacing: '0.03em',
            transform: `translateX(${(1 - showcaseProgress) * -25}px)`
          }}>
            LOGISTICS
          </div>
        </div>

        {/* Middle/Bottom Left: "OT" & "AUTOMATE & USER FRIENDLY" */}
        <div style={{
          position: 'absolute',
          bottom: '22%',
          left: '3%',
          pointerEvents: 'none',
          textAlign: 'left',
          userSelect: 'none',
          lineHeight: 0.92,
          zIndex: 0,
          whiteSpace: 'nowrap'
        }}>
          <div style={{
            fontSize: 'clamp(4.5rem, 8.2vw, 8.2rem)',
            fontWeight: 900,
            color: 'rgba(228, 228, 228, 0.32)',
            fontFamily: "'Bebas Neue', 'Anton', sans-serif",
            letterSpacing: '0.03em',
            transform: `translateX(${(1 - showcaseProgress) * -35}px)`
          }}>
            OT
          </div>
          <div style={{
            fontSize: 'clamp(2.8rem, 5.2vw, 5.5rem)',
            fontWeight: 900,
            color: 'rgba(201, 41, 36, 0.42)',
            fontFamily: "'Bebas Neue', 'Anton', sans-serif",
            letterSpacing: '0.03em',
            transform: `translateX(${(1 - showcaseProgress) * 25}px)`
          }}>
            AUTOMATE & USER FRIENDLY
          </div>
        </div>
      </div>

      {/* 6-Card Interactive Grid Showcase */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 7,
          opacity: showcaseOpacity,
          pointerEvents: showcaseOpacity > 0.5 ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          transform: `translateY(${showcaseScrollY}px)`,
          willChange: 'transform, opacity'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1060px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px'
          }}
        >
          {/* ── ROW 1 (Cards 01 & 02) ── */}
          <div style={{
            display: 'flex',
            gap: '22px',
            alignItems: 'stretch',
            transform: `translateY(${(1 - Math.min(1, showcaseProgress * 1.5)) * 40}px)`,
            opacity: Math.min(1, 0.2 + showcaseProgress * 1.8),
            transition: 'transform 0.15s ease-out'
          }}>
            {/* Card 01: Black compact card */}
            <div
              style={{
                width: '34%',
                minWidth: '270px',
                height: '190px',
                background: 'linear-gradient(150deg, #140501 0%, #050505 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(228, 228, 228, 0.18)',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 28px 60px rgba(5, 5, 5, 0.95), 0 0 24px rgba(201, 41, 36, 0.35), inset 0 1px 1px rgba(228, 228, 228, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)';
              }}
            >
              <span style={{
                fontSize: '38px',
                fontWeight: 700,
                color: '#E4E4E4',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                01.
              </span>
              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                Creative Vision<br />and Concept<br />Development
              </h3>
            </div>

            {/* Card 02: Fire Engine Red wide glowing card */}
            <div
              style={{
                flex: 1,
                height: '190px',
                background: 'radial-gradient(ellipse 95% 95% at 30% 20%, #E51A24 0%, #C92924 48%, #280B0B 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(255, 255, 255, 0.28)',
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 32px 75px rgba(201, 41, 36, 0.65), 0 12px 30px rgba(40, 11, 11, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)';
              }}
            >
              <p style={{
                margin: 0,
                alignSelf: 'flex-end',
                maxWidth: '400px',
                textAlign: 'right',
                fontSize: '12.5px',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'rgba(228, 228, 228, 0.95)',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                At Kverse, every project begins with a strong creative vision. We focus on developing unique concepts that combine aesthetics, storytelling, and innovation to create meaningful visual experiences that stand out and leave a lasting impression.
              </p>
              <span style={{
                fontSize: '38px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                02.
              </span>
            </div>
          </div>

          {/* ── ROW 2 (Cards 03 & 04) ── */}
          <div style={{
            display: 'flex',
            gap: '22px',
            alignItems: 'stretch',
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (showcaseProgress - 0.2) * 1.5))) * 40}px)`,
            opacity: Math.min(1, 0.1 + showcaseProgress * 1.9),
            transition: 'transform 0.15s ease-out'
          }}>
            {/* Card 03: Fire Engine Red wide glowing card */}
            <div
              style={{
                flex: 1,
                height: '190px',
                background: 'radial-gradient(ellipse 95% 95% at 30% 20%, #E51A24 0%, #C92924 48%, #280B0B 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(255, 255, 255, 0.28)',
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 32px 75px rgba(201, 41, 36, 0.65), 0 12px 30px rgba(40, 11, 11, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)';
              }}
            >
              <span style={{
                fontSize: '38px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                03.
              </span>
              <p style={{
                margin: 0,
                alignSelf: 'flex-end',
                maxWidth: '400px',
                textAlign: 'right',
                fontSize: '12.5px',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'rgba(228, 228, 228, 0.95)',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                We design immersive digital environments that merge modern design, dynamic visuals, and intuitive interaction. Our goal is to create digital experiences that feel powerful, engaging, and visually unforgettable.
              </p>
            </div>

            {/* Card 04: Black compact card */}
            <div
              style={{
                width: '34%',
                minWidth: '270px',
                height: '190px',
                background: 'linear-gradient(150deg, #140501 0%, #050505 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(228, 228, 228, 0.18)',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 28px 60px rgba(5, 5, 5, 0.95), 0 0 24px rgba(201, 41, 36, 0.35), inset 0 1px 1px rgba(228, 228, 228, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <span style={{
                  fontSize: '38px',
                  fontWeight: 700,
                  color: '#E4E4E4',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
                }}>
                  04.
                </span>
              </div>
              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                Digital Design<br />and Visual<br />Experiences
              </h3>
            </div>
          </div>

          {/* ── ROW 3 (Cards 05 & 06) ── */}
          <div style={{
            display: 'flex',
            gap: '22px',
            alignItems: 'stretch',
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (showcaseProgress - 0.4) * 1.5))) * 40}px)`,
            opacity: Math.min(1, showcaseProgress * 2.0),
            transition: 'transform 0.15s ease-out'
          }}>
            {/* Card 05: Black compact card */}
            <div
              style={{
                width: '34%',
                minWidth: '270px',
                height: '190px',
                background: 'linear-gradient(150deg, #140501 0%, #050505 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(228, 228, 228, 0.18)',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 28px 60px rgba(5, 5, 5, 0.95), 0 0 24px rgba(201, 41, 36, 0.35), inset 0 1px 1px rgba(228, 228, 228, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 24px 50px rgba(5, 5, 5, 0.75), inset 0 1px 1px rgba(228, 228, 228, 0.15)';
              }}
            >
              <span style={{
                fontSize: '38px',
                fontWeight: 700,
                color: '#E4E4E4',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                05.
              </span>
              <h3 style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                Brand Identity<br />and Visual<br />Systems
              </h3>
            </div>

            {/* Card 06: Fire Engine Red wide glowing card */}
            <div
              style={{
                flex: 1,
                height: '190px',
                background: 'radial-gradient(ellipse 95% 95% at 30% 20%, #E51A24 0%, #C92924 48%, #280B0B 100%)',
                borderRadius: '24px',
                border: '1.2px solid rgba(255, 255, 255, 0.28)',
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 32px 75px rgba(201, 41, 36, 0.65), 0 12px 30px rgba(40, 11, 11, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 28px 65px rgba(201, 41, 36, 0.45), 0 10px 25px rgba(40, 11, 11, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(40, 11, 11, 0.5)';
              }}
            >
              <p style={{
                margin: 0,
                alignSelf: 'flex-end',
                maxWidth: '400px',
                textAlign: 'right',
                fontSize: '12.5px',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'rgba(228, 228, 228, 0.95)',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                Kverse helps brands build identities that are bold, recognizable, and timeless. From logos and typography to complete visual systems, we create cohesive designs that communicate personality, purpose, and impact.
              </p>
              <span style={{
                fontSize: '38px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}>
                06.
              </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

