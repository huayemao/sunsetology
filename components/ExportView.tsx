'use client';
import React, { useRef, useState, useMemo } from 'react';
import { Palette, Translations } from '../types';
import { toPng } from 'html-to-image';
import { ExportCompareView } from './export-modes/ExportCompareView';
import { ExportWallpaperView } from './export-modes/ExportWallpaperView';
import { ExportCardView } from './export-modes/ExportCardView';
import { ExportProductView } from './export-modes/ExportProductView';
import { ExportMode, generateGradientData, getDateStr } from './export-modes/utils';


interface ExportViewProps {
  palette: Palette;
  imageUrl: string;
  t: Translations;
  onClose: () => void;
  langDir: 'ltr' | 'rtl';
}

export const ExportView: React.FC<ExportViewProps> = ({ palette, imageUrl, t, onClose, langDir }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ExportMode>('product');
  const [showOriginal, setShowOriginal] = useState(false);
  const quote = useRef(t.quotes[Math.floor(Math.random() * t.quotes.length)]).current;
  const dateStr = useMemo(() => getDateStr(), []);

  // Disable body scroll when modal is open
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Generate Gradient Data (Sorted by Luminance: Bright -> Dark)
  const gradientData = useMemo(() => generateGradientData(palette), [palette]);

  const handleDownload = async () => {
    const targetRef = cardRef;
    if (!targetRef.current) return;
    try {
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: 3, // Super high res for wallpapers
        backgroundColor: 'transparent',
        skipAutoScale: false
      });
      const link = document.createElement('a');
      link.download = `sunsetology-${mode}-${showOriginal ? 'with-original' : ''}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  // Render Product with Optional Original Comparison
  const renderProductWithOptionalComparison = () => {
    if (showOriginal) {
      return (
        <div className="relative shadow-2xl overflow-hidden bg-slate-900 text-white flex flex-col h-full max-h-full">
          {/* Image Comparison Section - Side by Side */}
          <div className="flex-1 flex gap-6 p-8 ">
            {/* Original Image */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16] max-w-lg">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.original}
              </div>
              <img 
                src={imageUrl} 
                alt="Original Photo" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Product */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16] max-w-lg">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.product}
              </div>
              <ExportProductView 
                imageUrl={imageUrl}
                palette={palette}
                dateStr={dateStr}
                quote={quote}
                t={t}
              />
            </div>
          </div>

          {/* Footer (Data) */}
          <div className="p-8 pb-12 space-y-6">
             <div className="space-y-1">
               <p className="text-sm font-mono opacity-60 tracking-widest">{dateStr}</p>
               <h2 className="text-xl font-bold tracking-tight uppercase font-sans text-shadow-sm">Sunsetology Product</h2>
             </div>
          </div>
        </div>
      );
    }
    return (
      <ExportProductView 
        imageUrl={imageUrl}
        palette={palette}
        dateStr={dateStr}
        quote={quote}
        t={t}
      />
    );
  };

  // Render Wallpaper with Optional Original Comparison
  const renderWallpaperWithOptionalComparison = () => {
    if (showOriginal) {
      return (
        <div className="relative shadow-2xl overflow-hidden bg-slate-900 text-white flex flex-col h-full max-h-full">
          {/* Image Comparison Section - Side by Side */}
          <div className="flex-1 flex gap-6 p-8 max-w-lg">
            {/* Original Image */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16]">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.original}
              </div>
              <img 
                src={imageUrl} 
                alt="Original Photo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Wallpaper */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16]">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.wallpaper}
              </div>
              <ExportWallpaperView 
                gradientData={gradientData}
                dateStr={dateStr}
                quote={quote}
                t={t}
              />
            </div>
          </div>

          {/* Footer (Data) */}
          <div className="p-8 pb-12 space-y-6">
             <div className="space-y-1">
               <p className="text-sm font-mono opacity-60 tracking-widest">{dateStr}</p>
               <h2 className="text-xl font-bold tracking-tight uppercase font-sans text-shadow-sm">Sunsetology Wallpaper</h2>
             </div>
          </div>
        </div>
      );
    }
    return (
      <ExportWallpaperView 
        gradientData={gradientData}
        dateStr={dateStr}
        quote={quote}
        t={t}
      />
    );
  };

  // Render Card with Optional Original Comparison
  const renderCardWithOptionalComparison = () => {
    if (showOriginal) {
      return (
        <div className="relative shadow-2xl overflow-hidden bg-slate-900 text-white flex flex-col h-full max-h-full">
          {/* Image Comparison Section - Side by Side */}
          <div className="flex-1 flex gap-6 p-8">
            {/* Original Image */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[4/5] max-w-lg">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.original}
              </div>
              <img 
                src={imageUrl} 
                alt="Original Photo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card */}
            <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[4/5] max-w-lg">
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                {t.card}
              </div>
              <ExportCardView 
                imageUrl={imageUrl}
                palette={palette}
                dateStr={dateStr}
                quote={quote}
                t={t}
                langDir={langDir}
              />
            </div>
          </div>

          {/* Footer (Data) */}
          <div className="p-8 pb-12 space-y-6">
             <div className="space-y-1">
               <p className="text-sm font-mono opacity-60 tracking-widest">{dateStr}</p>
               <h2 className="text-xl font-bold tracking-tight uppercase font-sans text-shadow-sm">Sunsetology Card</h2>
             </div>
          </div>
        </div>
      );
    }
    return (
      <ExportCardView 
        imageUrl={imageUrl}
        palette={palette}
        dateStr={dateStr}
        quote={quote}
        t={t}
        langDir={langDir}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050410]/95 backdrop-blur-md p-4 animate-fade-in">
      
      <div className="relative w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 items-center md:justify-center p-4 overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-0 md:right-0 z-50 text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Editor / Preview Area */}
        <div ref={cardRef} className="flex-1 flex items-center justify-center w-full h-full max-h-[85vh]">
            {mode === 'product' && renderProductWithOptionalComparison()}
            {mode === 'wallpaper' && renderWallpaperWithOptionalComparison()}
            {mode === 'card' && renderCardWithOptionalComparison()}
        </div>

        {/* Controls Column */}
        <div className="flex flex-col gap-8 w-full md:w-64 shrink-0 animate-slide-up text-center md:text-left">
           <div>
             <h2 className="text-3xl font-serif mb-2 text-white">{t.download}</h2>
             <p className="text-white/50 text-sm">Select a format to save your artwork.</p>
           </div>

           {/* Format Toggles */}
           <div className="grid grid-cols-3 p-1 bg-white/10 rounded-xl backdrop-blur-sm">
              <button 
                onClick={() => setMode('product')}
                className={`py-3 text-sm font-medium rounded-lg transition-all ${mode === 'product' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Product
              </button>
              <button 
                onClick={() => setMode('wallpaper')}
                className={`py-3 text-sm font-medium rounded-lg transition-all ${mode === 'wallpaper' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {t.wallpaper}
              </button>
              <button 
                onClick={() => setMode('card')}
                className={`py-3 text-sm font-medium rounded-lg transition-all ${mode === 'card' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {t.card}
              </button>
           </div>
           
           {/* Original Comparison Toggle */}
           <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl backdrop-blur-sm">
             <div>
               <p className="text-sm font-medium text-white">{t.includeOriginal}</p>
               <p className="text-xs text-white/40">Show original image alongside product</p>
             </div>
             <button 
               onClick={() => setShowOriginal(!showOriginal)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showOriginal ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
             >
               <svg className={`w-5 h-5 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </button>
           </div>

           {/* Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       {mode === 'product' ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                       ) : mode === 'wallpaper' ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                       ) : (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       )}
                    </svg>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-white">
                     {mode === 'product' ? 'Product' : mode === 'wallpaper' ? t.portraitView : t.socialView}
                   </p>
                   <p className="text-xs text-white/40">
                     {mode === 'product' ? 'Artistic circles overlay' : mode === 'wallpaper' ? t.wallpaperDimensions : t.cardDimensions}
                   </p>
                 </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed border-t border-white/10 pt-3">
                {mode === 'product' 
                  ? 'Artistic representation with colored circles overlaying the original image.'
                  : mode === 'wallpaper' 
                  ? t.wallpaperDescription
                  : t.cardDescription}
              </p>
           </div>

           <button 
            onClick={handleDownload}
            className="group relative w-full py-4 bg-white text-black font-bold tracking-wide rounded-full overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
           >
             <span className="relative z-10 flex items-center justify-center gap-2">
                 {t.saveImage}
                 <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
               </span>
           </button>
        </div>

      </div>
    </div>
  );
};