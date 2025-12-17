'use client';
import React, { useRef, useState, useMemo } from 'react';
import { Palette, Translations } from '../types';
import html2canvas from 'html2canvas';


interface ExportViewProps {
  palette: Palette;
  imageUrl: string;
  t: Translations;
  onClose: () => void;
  langDir: 'ltr' | 'rtl';
}

type ExportMode = 'compare' | 'wallpaper' | 'card';

export const ExportView: React.FC<ExportViewProps> = ({ palette, imageUrl, t, onClose, langDir }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ExportMode>('compare');
  const wallpaperRef = useRef<HTMLDivElement>(null);
  const quote = useRef(t.quotes[Math.floor(Math.random() * t.quotes.length)]).current;
  const dateStr = useMemo(() => new Date().toISOString().slice(0,10).replace(/-/g, ''), []);

  // Generate Gradient Data (Sorted by Luminance: Bright -> Dark)
  const gradientData = useMemo(() => {
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

    return {
      colors: sorted,
      stops,
      css: `linear-gradient(to bottom, ${stops.map(s => `${s.color.hex} ${s.pct}%`).join(', ')})`
    };
  }, [palette]);

  const handleDownload = async () => {
    const targetRef = mode === 'wallpaper' ? wallpaperRef : cardRef;
    if (!targetRef.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 3, // Super high res for wallpapers
        backgroundColor: null,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `sunsetology-${mode}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050410]/95 backdrop-blur-md p-4 animate-fade-in">
      
      <div className="relative w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 items-center justify-center p-4">
        
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
        <div className="flex-1 flex items-center justify-center w-full h-full max-h-[85vh]">
            
            {/* COMPARE VIEW */}
            {mode === 'compare' && (
              <div 
                ref={cardRef}
                className="relative shadow-2xl overflow-hidden bg-slate-900 text-white flex flex-col h-full max-h-full "
              >
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

                  {/* Wallpaper (Artistic Output) */}
                  <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16]" style={{ backgroundImage: gradientData.css }}>
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                      {t.artisticWallpaper}
                    </div>
                  </div>
                </div>

                {/* Footer (Data) */}
                <div className="p-8 pb-12 space-y-6">
                   <div className="space-y-1">
                     <p className="text-sm font-mono opacity-60 tracking-widest">{dateStr}</p>
                     <h2 className="text-xl font-bold tracking-tight uppercase font-sans text-shadow-sm">{t.sunsetologyGradient}</h2>
                   </div>

                   <div className="space-y-1">
                     {gradientData.stops.map((stop, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-mono opacity-80">
                          <span className="w-16">[{stop.color.r},{stop.color.g},{stop.color.b}]</span>
                          <span>→</span>
                          <span>{stop.pct}%</span>
                          <div className="h-px flex-1 bg-white/20" />
                       </div>
                     ))}
                   </div>

                   <div className="flex justify-between items-end pt-4 border-t border-white/20">
                      <div className="text-[10px] font-mono opacity-50 max-w-[60%] leading-relaxed">
                        {quote}
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold uppercase tracking-widest">{t.generated}</p>
                         <p className="text-[10px] opacity-50">{t.bySunsetologyApp}</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* WALLPAPER VIEW - Single */}
            {mode === 'wallpaper' && (
              <div 
                ref={wallpaperRef}
                className="relative shadow-2xl overflow-hidden aspect-[9/16] h-full max-h-full bg-slate-900 text-white flex flex-col justify-between"
                style={{ backgroundImage: gradientData.css }}
              >

                {/* Footer (Data) */}
                <div className="p-8 pb-12 space-y-6">
                   <div className="space-y-1">
                     <p className="text-sm font-mono opacity-60 tracking-widest">{dateStr}</p>
                     <h2 className="text-xl font-bold tracking-tight uppercase font-sans text-shadow-sm">Sunsetology 180° Gradient</h2>
                   </div>

                   <div className="space-y-1">
                     {gradientData.stops.map((stop, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-mono opacity-80">
                          <span className="w-16">[{stop.color.r},{stop.color.g},{stop.color.b}]</span>
                          <span>→</span>
                          <span>{stop.pct}%</span>
                          <div className="h-px flex-1 bg-white/20" />
                       </div>
                     ))}
                   </div>

                   <div className="flex justify-between items-end pt-4 border-t border-white/20">
                      <div className="text-[10px] font-mono opacity-50 max-w-[60%] leading-relaxed">
                        {quote}
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold uppercase tracking-widest">Generated</p>
                         <p className="text-[10px] opacity-50">By Sunsetology App</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* POLAROID VIEW */}
            {mode === 'card' && (
              <div 
                ref={cardRef}
                className="bg-[#fffdf8] text-slate-900 w-auto h-auto max-h-full aspect-[4/5] p-6 shadow-2xl flex flex-col gap-4"
                style={{ direction: langDir }}
              >
                <div className="relative w-full flex-1 bg-slate-100 overflow-hidden">
                   <img src={imageUrl} alt="Sunset" className="w-full h-full object-cover" />
                </div>

                <div className="flex w-full h-12 gap-1">
                   {palette.colors.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex-1 h-full" style={{ backgroundColor: c.hex }} />
                   ))}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                    <h3 className="font-serif text-2xl font-bold tracking-tight">{t.shareTitle}</h3>
                    <span className="font-mono text-xs text-slate-400">{dateStr}</span>
                  </div>
                  <p className={`font-serif italic text-sm text-slate-600 leading-relaxed mt-1 ${langDir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    "{quote}"
                  </p>
                  <div className="flex justify-between items-center mt-2">
                     <p className="font-sans text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                        #{palette.primary.hex} • #{palette.secondary.hex}
                     </p>
                     <p className="font-sans text-[10px] text-slate-900 font-bold uppercase tracking-widest">
                       Sunsetology
                     </p>
                  </div>
                </div>
              </div>
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
