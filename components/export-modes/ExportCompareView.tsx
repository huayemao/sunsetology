import React from 'react';
import { Translations } from '../../types';
import { GradientData } from './utils';

interface ExportCompareViewProps {
  imageUrl: string;
  gradientData: GradientData;
  dateStr: string;
  quote: string;
  t: Translations;
}

export const ExportCompareView: React.FC<ExportCompareViewProps> = ({
  imageUrl,
  gradientData,
  dateStr,
  quote,
  t
}) => {
  return (
    <div className="relative shadow-2xl overflow-hidden bg-slate-900 text-white flex flex-col h-full max-h-full">
      {/* Image Comparison Section - Side by Side */}
      <div className="flex-1 flex gap-6 p-8">
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

        {/* Wallpaper (Artistic Output) */}
        <div className="flex-1 relative overflow-hidden rounded-lg shadow-lg aspect-[9/16] max-w-lg" style={{ backgroundImage: gradientData.css }}>
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
  );
};
