import React from 'react';
import { Translations } from '../../types';
import { GradientData } from './utils';

interface ExportWallpaperViewProps {
  gradientData: GradientData;
  dateStr: string;
  quote: string;
  t: Translations;
}

export const ExportWallpaperView: React.FC<ExportWallpaperViewProps> = ({
  gradientData,
  dateStr,
  quote,
  t
}) => {
  return (
    <div 
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
  );
};
