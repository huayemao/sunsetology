'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Color, Palette, Language } from '../types';
import { LANGUAGES, I18N } from '../constants';
import { ColorCard } from './ColorCard';
import { ExportView } from './ExportView';
import { ExportProductView } from './export-modes/ExportProductView';

interface ColorExtractorBaseProps {
  extractPalette: (image: HTMLImageElement) => Promise<Palette>;
  theme: 'sunset' | 'general';
  modeText: string;
  modeLink: string;
  altText: string;
  exampleImages?: string[]; // Add example images parameter
}

// Predefine themes
const themes = {
  sunset: {
    primary: 'orange-400',
    secondary: 'red-500',
    tertiary: 'purple-600',
    hover: 'orange-400',
    buttonHover: 'orange-100'
  },
  general: {
    primary: 'blue-400',
    secondary: 'green-500',
    tertiary: 'purple-600',
    hover: 'blue-400',
    buttonHover: 'blue-100'
  }
};

const ColorExtractorBase: React.FC<ColorExtractorBaseProps> = ({
  extractPalette,
  theme,
  modeText,
  modeLink,
  altText,
  exampleImages = [] // Set default empty array for example images
}) => {
  const [lang, setLang] = useState<Language>('en');
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [showLangMenu, setShowLangMenu] = useState(false); // Add state for language menu toggle

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = I18N[lang];
  const currentLangConfig = LANGUAGES.find(l => l.code === lang);
  // Remove unused themeConfig variable

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

  const processImage = useCallback(async (input: File | string) => {
    let url: string;
    let isBlob = false;

    if (input instanceof File) {
      url = URL.createObjectURL(input);
      isBlob = true;
    } else {
      url = input;
    }

    setImage(url);
    setIsAnalyzing(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = async () => {
      try {
        // Artificial delay for dramatic effect
        await new Promise(r => setTimeout(r, 1200));
        const extractedPalette = await extractPalette(img);
        setPalette(extractedPalette);
      } catch (e) {
        console.error("Analysis failed", e);
      } finally {
        setIsAnalyzing(false);
        // Clean up blob URL if it was created from a File object
        if (isBlob) {
          URL.revokeObjectURL(url);
        }
      }
    };
  }, [extractPalette]);

  const handleExampleImageClick = (imageUrl: string) => {
    processImage(imageUrl);
  };

  // Handle paste event for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImage(file);
            break;
          }
        }
      }
    };

    // Add paste event listener to document
    document.addEventListener('paste', handlePaste);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [processImage]);

  // Quote and Date for preview
  const quote = useMemo(() => t.quotes[Math.floor(Math.random() * t.quotes.length)], [lang]);
  const dateStr = useMemo(() => new Date().toISOString().slice(0, 10).replace(/-/g, ''), []);

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
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-12 max-w-7xl">

        {/* Header */}
        <header className="flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${theme == 'sunset' ? `from-orange-400 via-red-500 to-purple-600` : ` from-blue-400 via-green-500 to-purple-600`} animate-pulse-slow shadow-lg ${theme == 'sunset' ? `shadow-orange-400/20` : `shadow-blue-400/20`}`}></div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">{t.title}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <a
              href={modeLink}
              className="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              {modeText}
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2">
            <a
              href={modeLink}
              className="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              {modeText}
            </a>
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 text-white/80 hover:text-white transition-all flex items-center gap-1`}
              >
                {LANGUAGES.find(l => l.code === lang)?.label}
                <svg className={`w-3 h-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl z-20">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left text-xs px-4 py-2 transition-all ${lang === l.code ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/15'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[60vh] flex flex-col items-center justify-center">

          {!image && (
            <div className="w-full max-w-xl">
              <div
                className={`w-full max-w-xl aspect-[16/10] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group
                ${dragOver ? `border-${theme == 'sunset' ? 'orange-400' : 'blue-400'} bg-${theme == 'sunset' ? 'orange-400' : 'blue-400'}/5 scale-[1.02]` : 'border-white/10 hover:border-white/20 bg-white/5'}`}
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
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-t from-${theme == 'sunset' ? 'orange-400' : 'blue-400'} to-transparent opacity-80 flex items-center justify-center`}>
                    <svg className={`w-8 h-8 text-${theme == 'sunset' ? 'orange-100' : 'blue-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif mb-2">{t.uploadText}</h2>
                  <p className="text-white/40 text-sm font-sans">{t.uploadSubtext}</p>
                </div>

                {/* Decorative glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${theme == 'sunset' ? 'orange-400' : 'blue-400'}/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              </div>

              {/* 示例图片选择区域 */}
              {exampleImages && exampleImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.exampleImages}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {exampleImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-105"
                        onClick={() => handleExampleImageClick(imageUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Example ${index + 1}`}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium">
                            {t.useThisImage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {image && isAnalyzing && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative w-24 h-24 mb-8">
                <div className={`absolute inset-0 rounded-full border-t-2 border-r-2 border-${theme == 'sunset' ? 'orange-400' : 'blue-400'} animate-spin`}></div>
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

              {/* Left Column: Product View & Controls */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  {/* Replace original image with ExportProductView */}
                  <ExportProductView
                    imageUrl={image}
                    palette={palette}
                    dateStr={dateStr}
                    quote={quote}
                    t={t}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <button
                      onClick={reset}
                      className="text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {t.reset}
                    </button>
                  </div>

                </div>
                {/* Generate Art Button */}
                <button
                  onClick={() => setShowExport(true)}
                  className={`w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-${theme == 'sunset' ? 'orange-100' : 'blue-100'} transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-white/10`}
                >
                  <span>{t.generateMoreArt}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </button>


              </div>

              {/* Middle Column: Colors & Action */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* Main Palette */}
                <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="font-serif text-3xl mb-1">{t.palette}</h2>
                      <p className="text-white/40 text-sm">{t.detectedDominantTones.replace('{count}', palette.colors.length.toString())}</p>
                    </div>
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

              {/* Right Column: Chromatic DNA */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                  <h2 className="font-serif text-2xl mb-4">{t.atmosphere}</h2>

                  {/* Gradient Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">{t.gradient}</h3>
                    <div className="aspect-square rounded-2xl shadow-2xl border-[3px] border-black/40 relative overflow-hidden" style={{ backgroundImage: gradientData?.css || 'none' }}>
                    </div>
                  </div>

                  {/* Gradient Controls */}
                  <div className="flex gap-2 mb-6">
                    <button onClick={() => setGradientType('linear')} className={`flex-1 py-3 text-xs font-medium rounded-xl border transition-all ${gradientType === 'linear' ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}>{t.linear}</button>
                    <button onClick={() => setGradientType('radial')} className={`flex-1 py-3 text-xs font-medium rounded-xl border transition-all ${gradientType === 'radial' ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}>{t.radial}</button>
                  </div>


                </div>
                {/* Atmosphere Section - Moved here as a new column */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5">
                  <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4">{t.atmosphere}</h3>
                  <p className="italic text-white/80">{quote}</p>
                  <p className="text-xs text-white/40 mt-2">{t.colorStory}</p>
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

export default ColorExtractorBase;