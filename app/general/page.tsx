'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Color, Palette, Language } from '../../types';
import { extractGeneralPalette } from '../../utils/colorService';
import { LANGUAGES, I18N } from '../../constants';
import { ColorCard } from '../../components/ColorCard';
import { ExportView } from '../../components/ExportView';

const GeneralColorExtractor: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = I18N[lang];
  const currentLangConfig = LANGUAGES.find(l => l.code === lang);
  
  // Quote and Date for preview
  const quote = useMemo(() => t.quotes[Math.floor(Math.random() * t.quotes.length)], [lang]);
  const dateStr = useMemo(() => new Date().toISOString().slice(0,10).replace(/-/g, ''), []);
  
  // Generate Gradient Data (Sorted by Luminance: Bright -> Dark)
  const gradientData = useMemo(() => {
    if (!palette) return null;
    
    // Sort by luminance descending (Lightest first)
    const sorted = [...palette.colors].sort((a, b) => {
      const lumA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
      const lumB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
      return lumB - lumA;
    }).slice(0, 5); // Take top 5 distinct colors for the gradient

    const stops = sorted.map((color, i) => ({
      color,
      pct: Math.round((i / (sorted.length - 1)) * 100)
    }));

    const direction = gradientType === 'radial' ? 'circle at center' : 'to bottom';
    const css = `${gradientType}-gradient(${direction}, ${stops.map(s => `${s.color.hex} ${s.pct}%`).join(', ')})`;

    return {
      colors: sorted,
      stops,
      css
    };
  }, [palette, gradientType]);

  const processImage = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsAnalyzing(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    
    img.onload = async () => {
      try {
        // Artificial delay for dramatic effect
        await new Promise(r => setTimeout(r, 1200)); 
        const extractedPalette = await extractGeneralPalette(img);
        setPalette(extractedPalette);
      } catch (e) {
        console.error("Analysis failed", e);
      } finally {
        setIsAnalyzing(false);
      }
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processImage(e.target.files[0]);
    }
  };

  const reset = () => {
    setImage(null);
    setPalette(null);
    setShowExport(false);
  };

  return (
    <div className="min-h-screen bg-sunset-900 text-white selection:bg-sunset-500 selection:text-white font-sans" dir={currentLangConfig?.dir || 'ltr'}>
      
      {/* Background Ambient Light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-12 max-w-6xl">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 via-green-500 to-purple-600 animate-pulse-slow shadow-lg shadow-blue-500/20"></div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">{t.title || 'Image Color Extractor'}</h1>
          </div>
          
          <div className="flex gap-2">
            <a 
              href="/" 
              className="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              {t.sunsetMode || 'Sunset Mode'}
            </a>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${lang === l.code ? 'bg-white/10 border-white/40 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[60vh] flex flex-col items-center justify-center">
          
          {!image && (
             <div 
               className={`w-full max-w-xl aspect-[16/10] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group
               ${dragOver ? 'border-blue-400 bg-blue-500/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
               onDragLeave={() => setDragOver(false)}
               onDrop={handleDrop}
             >
               <input 
                 type="file" 
                 accept="image/*" 
                 className="absolute inset-0 opacity-0 cursor-pointer z-20"
                 ref={fileInputRef}
                 onChange={handleFileChange}
               />
               
               <div className="text-center p-8 pointer-events-none z-10 transform transition-transform group-hover:scale-105">
                 <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-t from-blue-300 to-transparent opacity-80 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                 </div>
                 <h2 className="text-2xl font-serif mb-2">{t.uploadText}</h2>
                 <p className="text-white/40 text-sm font-sans">{t.uploadSubtext}</p>
               </div>
               
               {/* Decorative glow on hover */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
             </div>
          )}

          {image && isAnalyzing && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xl font-serif tracking-wide animate-pulse">{t.analyzing}</p>
            </div>
          )}

          {image && !isAnalyzing && palette && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up pb-20">
              
              {/* Left Column: Image & Controls */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                   <img src={image} alt="Original Image" className="w-full h-auto object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                     <button 
                       onClick={reset}
                       className="text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                     >
                       {t.reset}
                     </button>
                   </div>
                 </div>

                 <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5">
                    <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6 flex items-center justify-between">
                      {t.gradient}
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">{t.preview}</span>
                    </h3>
                    
                    {/* Phone Preview Container */}
                    <div className="flex justify-center mb-6">
                      <div 
                        className="aspect-[9/16] w-1/2 rounded-[2rem] shadow-2xl border-[6px] border-black/40 relative overflow-hidden transition-all duration-500 flex flex-col justify-between"
                        style={{ backgroundImage: gradientData?.css || 'none' }}
                      >
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <button onClick={() => setGradientType('linear')} className={`flex-1 py-3 text-xs font-medium rounded-xl border transition-all ${gradientType === 'linear' ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}>{t.linear}</button>
                       <button onClick={() => setGradientType('radial')} className={`flex-1 py-3 text-xs font-medium rounded-xl border transition-all ${gradientType === 'radial' ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}>{t.radial}</button>
                    </div>
                 </div>
              </div>

              {/* Right Column: Colors & Action */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Main Palette */}
                <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                  <div className="flex justify-between items-end mb-6">
                     <div>
                       <h2 className="font-serif text-3xl mb-1">{t.palette}</h2>
                       <p className="text-white/40 text-sm">{t.detectedDominantTones.replace('{count}', palette.colors.length.toString())}</p>
                     </div>
                     <button 
                       onClick={() => setShowExport(true)}
                       className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-blue-100 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-white/10"
                     >
                       <span>{t.generateArt}</span>
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                       </svg>
                     </button>
                  </div>

                  {/* Primary Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <ColorCard color={palette.primary} size="lg" className="md:col-span-2" t={t} />
                     <ColorCard color={palette.secondary} size="lg" t={t} />
                     <ColorCard color={palette.accent} size="lg" t={t} />
                  </div>

                  {/* Secondary Strip */}
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {palette.colors.map((c, i) => (
                      <ColorCard key={i} color={c} size="sm" t={t} />
                    ))}
                  </div>
                </div>

                {/* Color Details Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-xs text-white/40 uppercase mb-3">{t.primaryHexRgb}</h4>
                      <p className="font-mono text-lg">{palette.primary.hex}</p>
                      <p className="font-mono text-sm text-white/60">rgb({palette.primary.r}, {palette.primary.g}, {palette.primary.b})</p>
                   </div>
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-xs text-white/40 uppercase mb-3">{t.primaryHslCmyk}</h4>
                      <p className="font-mono text-lg">hsl({palette.primary.hsl})</p>
                      <p className="font-mono text-sm text-white/60">cmyk({palette.primary.cmyk})</p>
                   </div>
                </div>

              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-auto py-8 text-center border-t border-white/5">
          <p className="font-serif text-white/30 text-sm italic">"{t.footerQuote}"</p>
          <p className="text-white/10 text-xs mt-4 uppercase tracking-widest">{t.copyright}</p>
        </footer>

      </div>

      {/* Export Modal */}
      {showExport && palette && image && (
        <ExportView 
          palette={palette} 
          imageUrl={image} 
          t={t} 
          onClose={() => setShowExport(false)} 
          langDir={currentLangConfig?.dir || 'ltr'}
        />
      )}

    </div>
  );
};

export default GeneralColorExtractor;