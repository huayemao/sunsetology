'use client';
import React, { useRef, useState, useMemo } from 'react';
import { Palette, Translations } from '../types';
import { toPng } from 'html-to-image';
import { ExportCompareView } from './export-modes/ExportCompareView';
import { ExportWallpaperView } from './export-modes/ExportWallpaperView';
import { ExportCardView } from './export-modes/ExportCardView';
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
  const [mode, setMode] = useState<ExportMode>('compare');
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
      link.download = `sunsetology-${mode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
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
            {mode === 'compare' && (
              <ExportCompareView
                imageUrl={imageUrl}
                gradientData={gradientData}
                dateStr={dateStr}
                quote={quote}
                t={t}
              />
            )}

            {mode === 'wallpaper' && (
              <ExportWallpaperView
                gradientData={gradientData}
                dateStr={dateStr}
                quote={quote}
                t={t}
              />
            )}

            {mode === 'card' && (
              <ExportCardView
                imageUrl={imageUrl}
                palette={palette}
                dateStr={dateStr}
                quote={quote}
                t={t}
                langDir={langDir}
              />
            )}
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
                onClick={() => setMode('compare')}
                className={`py-3 text-sm font-medium rounded-lg transition-all ${mode === 'compare' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {t.compare}
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
           
           {/* Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       {mode === 'compare' ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       ) : mode === 'wallpaper' ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                       ) : (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       )}
                    </svg>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-white">
                     {mode === 'compare' ? t.comparisonView : mode === 'wallpaper' ? t.portraitView : t.socialView}
                   </p>
                   <p className="text-xs text-white/40">
                     {mode === 'compare' ? t.compareDimensions : mode === 'wallpaper' ? t.wallpaperDimensions : t.cardDimensions}
                   </p>
                 </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed border-t border-white/10 pt-3">
                {mode === 'compare' 
                  ? t.compareDescription
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
