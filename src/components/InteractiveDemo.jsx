import React, { useState } from 'react';
import { Sparkles, Wand2, Eye, Code2, RefreshCw, ShoppingBag } from 'lucide-react';

export default function InteractiveDemo({ initialPrompt, onShowToast }) {
  const [demoPromptInput, setDemoPromptInput] = useState(initialPrompt || 'Create a modern bakery website');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(3);
  const [demoActiveTab, setDemoActiveTab] = useState('preview');
  const [bakeryCartCount, setBakeryCartCount] = useState(0);

  // Sync if parent updates initialPrompt
  React.useEffect(() => {
    if (initialPrompt) {
      setDemoPromptInput(initialPrompt);
      triggerGeneration(initialPrompt);
    }
  }, [initialPrompt]);

  const triggerGeneration = (text) => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => {
      setGenerationStep(2);
    }, 700);

    setTimeout(() => {
      setGenerationStep(3);
      setIsGenerating(false);
      if (onShowToast) onShowToast('Generated live experience successfully!');
    }, 1700);
  };

  return (
    <section id="demo" style={{ padding: '110px 0', position: 'relative', background: '#fbfbfd' }}>
      <div className="content-container">
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: '#fff7ed',
            border: '1px solid rgba(255, 98, 0, 0.25)',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} color="#ea580c" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Simulation
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            color: '#09090b'
          }}>
            Experience the <span className="glow-text">AI Synthesis Engine</span>
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Watch prompt instructions transform live into an interactive website interface with micro-interactions and clean code.
          </p>
        </div>

        {/* Interactive Generator Container */}
        <div style={{
          maxWidth: '1040px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06), 0 0 30px rgba(255, 98, 0, 0.06)'
        }}>
          
          {/* Top Prompt Input & Presets */}
          <div style={{
            background: '#ffffff',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Quick Presets:
              </span>
              {[
                'Create a modern bakery website',
                'Glassmorphic Crypto Trading Terminal',
                'Mindful Meditation Sanctuary',
                'SaaS Analytics Dashboard'
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => { setDemoPromptInput(preset); triggerGeneration(preset); }}
                  style={{
                    background: demoPromptInput === preset ? '#fff7ed' : '#f8fafc',
                    border: demoPromptInput === preset ? '1px solid #ea580c' : '1px solid rgba(0, 0, 0, 0.08)',
                    color: demoPromptInput === preset ? '#ea580c' : '#64748b',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Main Input Field */}
            <div style={{
              display: 'flex',
              gap: '12px',
              background: '#f8fafc',
              border: '1.5px solid rgba(255, 98, 0, 0.35)',
              borderRadius: '16px',
              padding: '10px 16px',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(255, 98, 0, 0.08)'
            }}>
              <Wand2 size={20} color="#ea580c" />
              <input
                type="text"
                value={demoPromptInput}
                onChange={(e) => setDemoPromptInput(e.target.value)}
                placeholder="Enter prompt description (e.g. Create a modern bakery website)..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#09090b',
                  fontSize: '15.5px',
                  fontWeight: 600,
                  width: '100%'
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') triggerGeneration(demoPromptInput); }}
              />
              <button
                onClick={() => triggerGeneration(demoPromptInput)}
                disabled={isGenerating}
                className="btn-primary"
                style={{
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  whiteSpace: 'nowrap',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Reasoning Progress Bar */}
          {isGenerating && (
            <div style={{
              background: '#fff7ed',
              borderBottom: '1px solid rgba(255, 98, 0, 0.2)',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              color: '#ea580c',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ea580c', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
              <span>
                {generationStep === 1 && 'Step 1/3: Parsing visual taxonomy & color temperature tokens...'}
                {generationStep === 2 && 'Step 2/3: Compiling responsive layout graph & glassmorphism shaders...'}
                {generationStep === 3 && 'Step 3/3: Finalizing production-ready interactive view!'}
              </span>
            </div>
          )}

          {/* Live Result Header Controls */}
          <div style={{
            background: '#ffffff',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setDemoActiveTab('preview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: demoActiveTab === 'preview' ? '#fff7ed' : 'transparent',
                  border: demoActiveTab === 'preview' ? '1px solid #ea580c' : '1px solid transparent',
                  color: demoActiveTab === 'preview' ? '#ea580c' : '#64748b',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Eye size={14} />
                <span>Visual Preview</span>
              </button>
              <button
                onClick={() => setDemoActiveTab('code')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: demoActiveTab === 'code' ? '#fff7ed' : 'transparent',
                  border: demoActiveTab === 'code' ? '1px solid #ea580c' : '1px solid transparent',
                  color: demoActiveTab === 'code' ? '#ea580c' : '#64748b',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Code2 size={14} />
                <span>Generated React Code</span>
              </button>
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              <span>Fullstack Responsive</span>
            </div>
          </div>

          {/* Preview Canvas */}
          <div style={{ minHeight: '420px', background: '#f8fafc', padding: '24px' }}>
            {demoActiveTab === 'preview' ? (
              <div style={{
                background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}>
                {/* Bakery Navbar */}
                <div style={{
                  padding: '14px 24px',
                  background: 'rgba(28, 25, 23, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🥐</span>
                    <span style={{ fontWeight: 900, letterSpacing: '1px', color: '#ffedd5', fontSize: '14px' }}>
                      LA MAISON ARTISAN
                    </span>
                  </div>

                  <div style={{
                    background: 'rgba(249, 115, 22, 0.2)',
                    border: '1px solid #f97316',
                    color: '#fed7aa',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <ShoppingBag size={13} />
                    <span>Cart ({bakeryCartCount})</span>
                  </div>
                </div>

                {/* Hero Banner */}
                <div style={{ padding: '36px 24px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.25) 0%, transparent 70%)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(249, 115, 22, 0.2)', color: '#fdba74', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
                    FRENCH BOULANGERIE HIGHLIGHT
                  </span>
                  <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginTop: '12px', marginBottom: '8px' }}>
                    Naturally Fermented Sourdough & Croissants
                  </h3>
                  <p style={{ color: '#d6d3d1', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                    Baked fresh every morning at 5:00 AM using Normandy cultured butter and 36-hour wild yeast fermentation.
                  </p>

                  {/* Product Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginTop: '20px' }}>
                    
                    {/* Item 1 */}
                    <div style={{
                      background: 'rgba(41, 37, 36, 0.85)',
                      border: '1px solid rgba(251, 146, 60, 0.25)',
                      borderRadius: '16px',
                      padding: '18px',
                      textAlign: 'left'
                    }}>
                      <div style={{ height: '100px', background: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '14px' }}>
                        🥐
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Classic Butter Croissant</span>
                        <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 'bold' }}>100% Veg</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#fb923c'
                        }}>
                          ₹ 140 / piece
                        </div>
                        <button
                          onClick={() => setBakeryCartCount(c => c + 1)}
                          style={{
                            background: '#ea580c',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div style={{
                      background: 'rgba(41, 37, 36, 0.85)',
                      border: '1px solid rgba(251, 146, 60, 0.25)',
                      borderRadius: '16px',
                      padding: '18px',
                      textAlign: 'left'
                    }}>
                      <div style={{ height: '100px', background: 'linear-gradient(135deg, #9a3412 0%, #431407 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '14px' }}>
                        🥖
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>Artisan French Baguette</span>
                        <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 'bold' }}>100% Veg</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#fb923c'
                        }}>
                          ₹ 190 / loaf
                        </div>
                        <button
                          onClick={() => setBakeryCartCount(c => c + 1)}
                          style={{
                            background: '#ea580c',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* Code Tab */
              <div style={{
                background: '#09090b',
                borderRadius: '16px',
                padding: '24px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: '#e2e8f0',
                lineHeight: 1.6,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0 }}>
{`// Production React Component synthesized from Prompt
import React, { useState } from 'react';

export default function ArtisanBakeryStorefront() {
  const [cart, setCart] = useState([]);
  
  const products = [
    { id: 1, name: 'Classic Butter Croissant', price: 140, unit: 'piece', tag: '100% Veg' },
    { id: 2, name: 'Artisan French Baguette', price: 190, unit: 'loaf', tag: '100% Veg' }
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-white font-sans">
      <header className="flex justify-between items-center p-6 border-b border-stone-800">
        <h1 className="text-xl font-bold tracking-wider text-orange-400">LA MAISON ARTISAN</h1>
        <button className="bg-orange-600 px-4 py-2 rounded-full font-semibold">
          Cart ({cart.length})
        </button>
      </header>
      {/* Dynamic Product Grid */}
    </div>
  );
}`}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
