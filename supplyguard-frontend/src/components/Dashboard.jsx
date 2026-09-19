'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Utensils,
  Smartphone,
  Shirt,
  Pill,
  Car,
  Factory,
  ShoppingCart,
  Armchair,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkle
} from 'lucide-react';


/* Spec Categories */
export const CATEGORIES = [
  {
    id: 'electronics',
    label: 'Electronics',
    icon: Cpu,
    emoji: '💻',
    description: 'Semiconductors, consumer tech & hardware'
  },
  {
    id: 'food_beverage',
    label: 'Food & Beverage',
    icon: Utensils,
    emoji: '🍕',
    description: 'Packaged foods, beverages & perishables'
  },
  {
    id: 'phone_cases_accessories',
    label: 'Phone Cases / Mobile Accessories',
    icon: Smartphone,
    emoji: '📱',
    description: 'Covers, chargers, screen guards & gadgets'
  },
  {
    id: 'apparel_textiles',
    label: 'Apparel & Textiles',
    icon: Shirt,
    emoji: '👕',
    description: 'Garments, fabrics, footwear & fashion'
  },
  {
    id: 'pharmaceuticals',
    label: 'Pharmaceuticals',
    icon: Pill,
    emoji: '💊',
    description: 'Medicines, APIs, healthcare & medical supplies'
  },
  {
    id: 'automotive_parts',
    label: 'Automotive Parts',
    icon: Car,
    emoji: '🚗',
    description: 'OEM spares, batteries, electronics & components'
  },
  {
    id: 'industrial_raw_materials',
    label: 'Industrial / Raw Materials',
    icon: Factory,
    emoji: '🏭',
    description: 'Metals, polymers, chemicals & industrial inputs'
  },
  {
    id: 'fmcg',
    label: 'FMCG',
    icon: ShoppingCart,
    emoji: '🛒',
    description: 'Fast-moving consumer goods & daily retail'
  },
  {
    id: 'furniture',
    label: 'Furniture',
    icon: Armchair,
    emoji: '🛋️',
    description: 'Home & office furniture, fixtures & decor'
  },
  {
    id: 'other',
    label: 'Other',
    icon: Sparkles,
    emoji: '✨',
    description: 'Custom industry or specialized domain'
  },
];

/* Spec Business Scales */
export const BUSINESS_SCALES = [
  {
    id: 'Micro',
    label: 'Micro',
    range: '< ₹1 Cr turnover',
    employees: '1 – 10 employees'
  },
  {
    id: 'Small',
    label: 'Small',
    range: '₹1 Cr – ₹10 Cr',
    employees: '11 – 50 employees'
  },
  {
    id: 'Medium',
    label: 'Medium',
    range: '₹10 Cr – ₹50 Cr',
    employees: '51 – 250 employees'
  },
  {
    id: 'Large',
    label: 'Large',
    range: '> ₹50 Cr enterprise',
    employees: '250+ employees'
  },
];

/* Apple-Style Skeuomorphic Glass Toggle Button (No black background container) */
export function SkeuomorphicGlassToggle({ on, onToggle, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle?.(!on);
      }}
      title={disabled ? label : (on ? `Click to activate ${label}` : `Click to toggle ${label}`)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '46px',
        height: '26px',
        padding: '2px',
        borderRadius: '9999px',
        border: 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: on
          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'
          : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        boxShadow: on
          ? 'inset 0 1px 1.5px rgba(255, 255, 255, 0.75), inset 0 -1px 2px rgba(0, 0, 0, 0.25), 0 3px 8px rgba(37, 99, 235, 0.35)'
          : 'inset 0 1px 1.5px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.08)',
        transition: 'background 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        flexShrink: 0,
        opacity: disabled ? 0.6 : 1
      }}
    >
      {/* Specular gloss reflection strip on top half */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '5px',
        right: '5px',
        height: '42%',
        borderRadius: '9999px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0) 100%)',
        pointerEvents: 'none'
      }} />

      {/* 3D Glass Sphere Knob with spring sliding motion */}
      <motion.div
        animate={{
          x: on ? 20 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f8fafc 55%, #cbd5e1 100%)',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25), inset 0 1px 1px #ffffff, inset 0 -1px 1px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Subtle inner core indicator dot */}
        <div style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: on ? '#2563eb' : '#94a3b8',
          opacity: 0.85,
          transition: 'background 0.22s ease'
        }} />
      </motion.div>
    </button>
  );
}

export default function Dashboard({ onLogout, onShowToast, onContinue }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [otherText, setOtherText] = useState('');

  const [selectedScale, setSelectedScale] = useState(null);
  const [isScaleExpanded, setIsScaleExpanded] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load existing profile from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ripple_business_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categories && parsed.categories.length > 0) {
          const rawCat = parsed.categories[0];
          const matched = CATEGORIES.find(
            (c) => c.id === rawCat || c.id.toLowerCase() === String(rawCat).toLowerCase() || c.label.toLowerCase() === String(rawCat).toLowerCase()
          );
          if (matched) {
            setSelectedCategory(matched.id);
            setIsCategoryExpanded(false);
          }
        }
        if (parsed.business_scale) {
          const rawScale = parsed.business_scale;
          const matchedScale = BUSINESS_SCALES.find(
            (s) => s.id === rawScale || s.id.toLowerCase() === String(rawScale).toLowerCase() || s.label.toLowerCase() === String(rawScale).toLowerCase()
          );
          if (matchedScale) {
            setSelectedScale(matchedScale.id);
            setIsScaleExpanded(false);
          }
        }
        if (parsed.other_category) {
          setOtherText(parsed.other_category);
        }
      }
    } catch (e) {
      console.warn('Failed to load profile', e);
    }
  }, []);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setIsCategoryExpanded(false);
    setIsSubmitted(false);
  };

  const handleExpandCategories = (e) => {
    if (e) e.stopPropagation();
    setIsCategoryExpanded(true);
  };

  const handleSelectScale = (scaleId) => {
    setSelectedScale(scaleId);
    setIsScaleExpanded(false);
    setIsSubmitted(false);
  };

  const handleExpandScales = (e) => {
    if (e) e.stopPropagation();
    setIsScaleExpanded(true);
  };

  const selectedCategoryObj = CATEGORIES.find(
    (c) =>
      c.id === selectedCategory ||
      c.id.toLowerCase() === String(selectedCategory).toLowerCase() ||
      c.label.toLowerCase() === String(selectedCategory).toLowerCase()
  );

  const selectedScaleObj = BUSINESS_SCALES.find(
    (s) =>
      s.id === selectedScale ||
      s.id.toLowerCase() === String(selectedScale).toLowerCase() ||
      s.label.toLowerCase() === String(selectedScale).toLowerCase()
  );

  // Spec: Continue button is disabled until category + scale chosen
  const isOtherSelected = selectedCategoryObj?.id === 'other';
  const hasValidOther = !isOtherSelected || (isOtherSelected && otherText.trim().length > 0);
  const isValid = Boolean(selectedCategoryObj) && Boolean(selectedScaleObj) && hasValidOther;

  const handleContinue = () => {
    if (!isValid || !selectedCategoryObj || !selectedScaleObj) return;

    const payload = {
      categories: [selectedCategoryObj.id],
      other_category: isOtherSelected ? otherText.trim() : null,
      business_scale: selectedScaleObj.id,
      onboarding_step: 2,
      onboarding_completed: false,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('ripple_business_profile', JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }

    setIsSubmitted(true);
    if (onShowToast) {
      onShowToast(`Saved! Category: ${selectedCategoryObj.label} • Scale: ${selectedScaleObj.label}`);
    }

    if (onContinue) {
      onContinue();
    } else if (onLogout) {
      onLogout();
    }
  };

  const visibleCategories = isCategoryExpanded || !selectedCategoryObj
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === selectedCategoryObj.id);

  const visibleScales = isScaleExpanded || !selectedScaleObj
    ? BUSINESS_SCALES
    : BUSINESS_SCALES.filter((s) => s.id === selectedScaleObj.id);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
      background: '#ffffff',
      color: '#09090b',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    }}>
      {/* Top Bar Navigation */}
      {onLogout && (
        <div style={{
          padding: '16px 36px',
          borderBottom: '1px solid #f0f0f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <button
            onClick={onLogout}
            style={{
              background: '#f4f4f5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: '#09090b',
              fontSize: '13.5px',
              fontWeight: 750,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#09090b';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f4f4f5';
              e.currentTarget.style.color = '#09090b';
            }}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Main Flow Content */}
      <div style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '36px 24px 130px 24px',
        boxSizing: 'border-box'
      }}>
        {/* Header Title Section */}
        <div style={{ marginBottom: '34px' }}>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 10px 0',
            color: '#09090b'
          }}>
            Business Category Selection
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#71717a',
            margin: 0,
            lineHeight: '1.5',
            maxWidth: '680px'
          }}>
            Select your industry category and operating scale. When selected, options focus automatically; click "Change" anytime to revisit previous choices.
          </p>
        </div>

        {/* Section 1: Categories Grid with Animated Hide & Revert */}
        <div style={{ marginBottom: '44px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  fontSize: '17px',
                  fontWeight: 750,
                  color: '#09090b',
                  margin: 0
                }}>
                  1. Business Category
                </h2>
                {selectedCategory && !isCategoryExpanded && (
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    background: '#f4f4f5',
                    color: '#09090b',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check size={11} color="#16a34a" strokeWidth={3} /> Selected
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
                {isCategoryExpanded || !selectedCategory
                  ? 'Select your sector — other categories will collapse into focus'
                  : 'Sector locked • Click "Change Category" if you want to pick another'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: selectedCategoryObj ? '#09090b' : '#a1a1aa',
                background: selectedCategoryObj ? '#f4f4f5' : 'transparent',
                padding: '5px 12px',
                borderRadius: '9999px',
                border: '1px solid #e4e4e7'
              }}>
                {selectedCategoryObj ? '1 selected' : 'Choose 1 sector'}
              </span>
            </div>
          </div>

          {/* Animated Category Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isCategoryExpanded || !selectedCategory
              ? 'repeat(auto-fill, minmax(210px, 1fr))'
              : 'minmax(280px, 420px)',
            gap: '14px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <AnimatePresence mode="popLayout">
              {visibleCategories.map((cat) => {
                const isSelected = selectedCategoryObj?.id === cat.id;
                const isSingleFocused = !isCategoryExpanded && isSelected;
                const IconComponent = cat.icon;

                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      y: -8,
                      filter: 'blur(3px)',
                      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                    }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isSingleFocused) {
                        handleExpandCategories();
                      } else {
                        handleSelectCategory(cat.id);
                      }
                    }}
                    style={{
                      position: 'relative',
                      padding: '18px 20px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #09090b' : '1px solid #e4e4e7',
                      background: isSelected ? '#09090b' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#09090b',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 12px 28px rgba(0, 0, 0, 0.16)'
                        : '0 2px 6px rgba(0, 0, 0, 0.02)',
                      transition: 'background 0.18s ease, color 0.18s ease, border 0.18s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: isSingleFocused ? '125px' : '110px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '11px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.16)' : '#f4f4f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        <IconComponent
                          size={21}
                          color={isSelected ? '#ffffff' : '#09090b'}
                        />
                      </div>

                      {/* Right Indicator or Change Badge */}
                      {isSingleFocused ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandCategories();
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.16)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            fontSize: '11.5px',
                            fontWeight: 750,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.18s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.color = '#09090b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                        >
                          <RotateCcw size={11} />
                          <span>Change</span>
                        </button>
                      ) : (
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #ffffff' : '1.5px solid #d4d4d8',
                          background: isSelected ? '#ffffff' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isSelected && <Check size={12} color="#09090b" strokeWidth={3} />}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '14px' }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 750,
                        letterSpacing: '-0.01em',
                        lineHeight: '1.25'
                      }}>
                        {cat.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: isSelected ? '#d4d4d8' : '#71717a',
                        marginTop: '4px',
                        lineHeight: '1.3'
                      }}>
                        {cat.description}
                      </div>
                    </div>

                    {isSingleFocused && (
                      <div style={{
                        fontSize: '11px',
                        color: '#a1a1aa',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <RotateCcw size={11} />
                        <span>Click card or "Change" to re-expand all categories</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Free Text Input for Custom "Other" Category */}
          <AnimatePresence>
            {isOtherSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{
                  background: '#fafafa',
                  border: '1px dashed #d4d4d8',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  maxWidth: isCategoryExpanded ? '100%' : '420px'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#09090b',
                    marginBottom: '6px'
                  }}>
                    Specify Custom Category / Domain:
                  </label>
                  <input
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="e.g. Aerospace, Renewable Energy, Defense, Semiconductor Foundry..."
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      fontSize: '14px',
                      borderRadius: '10px',
                      border: '1px solid #d4d4d8',
                      background: '#ffffff',
                      color: '#09090b',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 2: Business Scale Selector (Appears after category selected with matching animation) */}
        <AnimatePresence>
          {selectedCategory ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '40px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{
                      fontSize: '17px',
                      fontWeight: 750,
                      color: '#09090b',
                      margin: 0
                    }}>
                      2. Business Scale
                    </h2>
                    {selectedScale && !isScaleExpanded && (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: '#f4f4f5',
                        color: '#09090b',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Check size={11} color="#16a34a" strokeWidth={3} /> Selected
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
                    {isScaleExpanded || !selectedScale
                      ? 'Select operating tier — used to calibrate inventory thresholds'
                      : 'Scale chosen • Click "Change Scale" if you need to adjust'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: selectedScaleObj ? '#09090b' : '#a1a1aa',
                    background: selectedScaleObj ? '#f4f4f5' : 'transparent',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #e4e4e7'
                  }}>
                    {selectedScaleObj ? 'Scale chosen' : 'Choose 1 scale'}
                  </span>
                </div>
              </div>

              {/* Animated Business Scale Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isScaleExpanded || !selectedScale
                  ? 'repeat(auto-fit, minmax(190px, 1fr))'
                  : 'minmax(260px, 380px)',
                gap: '12px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <AnimatePresence mode="popLayout">
                  {visibleScales.map((scale) => {
                    const isSelected = selectedScaleObj?.id === scale.id;
                    const isSingleFocused = !isScaleExpanded && isSelected;

                    return (
                      <motion.div
                        key={scale.id}
                        layout
                        initial={{ opacity: 0, scale: 0.94, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          y: -8,
                          filter: 'blur(3px)',
                          transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                        }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isSingleFocused) {
                            handleExpandScales();
                          } else {
                            handleSelectScale(scale.id);
                          }
                        }}
                        style={{
                          padding: '18px 20px',
                          borderRadius: '16px',
                          border: isSelected ? '2px solid #09090b' : '1px solid #e4e4e7',
                          background: isSelected ? '#09090b' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#09090b',
                          cursor: 'pointer',
                          boxShadow: isSelected
                            ? '0 12px 28px rgba(0, 0, 0, 0.16)'
                            : '0 2px 6px rgba(0, 0, 0, 0.02)',
                          boxSizing: 'border-box',
                          transition: 'background 0.18s ease, color 0.18s ease, border 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            fontSize: '16.5px',
                            fontWeight: 800,
                            letterSpacing: '-0.01em'
                          }}>
                            {scale.label}
                          </div>

                          {isSingleFocused ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExpandScales();
                              }}
                              style={{
                                background: 'rgba(255, 255, 255, 0.16)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                padding: '4px 12px',
                                fontSize: '11.5px',
                                fontWeight: 750,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.18s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#09090b';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                            >
                              <RotateCcw size={11} />
                              <span>Change</span>
                            </button>
                          ) : (
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? '5px solid #ffffff' : '1.5px solid #d4d4d8',
                              background: isSelected ? '#09090b' : '#ffffff',
                              boxSizing: 'border-box'
                            }} />
                          )}
                        </div>

                        <div style={{
                          fontSize: '13.5px',
                          fontWeight: 650,
                          color: isSelected ? '#f4f4f5' : '#09090b',
                          marginTop: '8px'
                        }}>
                          {scale.range}
                        </div>

                        <div style={{
                          fontSize: '11.5px',
                          color: isSelected ? '#a1a1aa' : '#71717a',
                          marginTop: '3px'
                        }}>
                          {scale.employees}
                        </div>

                        {isSingleFocused && (
                          <div style={{
                            fontSize: '11px',
                            color: '#a1a1aa',
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <RotateCcw size={11} />
                            <span>Click card or "Change" to select different scale</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <div style={{
              marginBottom: '40px',
              padding: '24px 28px',
              borderRadius: '16px',
              border: '1px dashed #e4e4e7',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              color: '#a1a1aa'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 800,
                color: '#71717a',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 750, color: '#71717a' }}>
                  2. Business Scale
                </div>
                <div style={{ fontSize: '12.5px', color: '#a1a1aa', marginTop: '2px' }}>
                  Select a category above to unlock scale calibration.
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Fixed Sticky Footer / Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #e4e4e7',
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 50,
        boxSizing: 'border-box'
      }}>
        {/* Normal Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isValid}
          style={{
            background: isValid ? '#09090b' : '#e4e4e7',
            color: isValid ? '#ffffff' : '#a1a1aa',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: 750,
            cursor: isValid ? 'pointer' : 'not-allowed',
            padding: '12px 28px',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isValid ? '0 8px 20px rgba(0, 0, 0, 0.15)' : 'none',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            if (isValid) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (isValid) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
            }
          }}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
