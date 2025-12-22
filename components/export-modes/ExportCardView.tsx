import React from 'react';
import { Palette, Translations } from '../../types';

interface ExportCardViewProps {
  imageUrl: string;
  palette: Palette;
  dateStr: string;
  quote: string;
  t: Translations;
  langDir: 'ltr' | 'rtl';
}

export const ExportCardView: React.FC<ExportCardViewProps> = ({
  imageUrl,
  palette,
  dateStr,
  quote,
  t,
  langDir
}) => {
  return (
    <div 
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
  );
};
