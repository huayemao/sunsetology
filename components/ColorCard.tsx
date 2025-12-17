'use client';
import React, { useState } from 'react';
import { Color, Translations } from '../types';

interface ColorCardProps {
  color: Color;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  t: Translations;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, size = 'md', className = '', t }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const heightClass = size === 'sm' ? 'h-16' : size === 'lg' ? 'h-40' : 'h-24';
  
  return (
    <div 
      className={`group relative flex flex-col items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1 ${className}`}
      onClick={handleCopy}
    >
      <div 
        className={`w-full ${heightClass} rounded-xl shadow-lg border border-white/10 relative overflow-hidden`}
        style={{ backgroundColor: color.hex }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Copy Feedback Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white text-xs font-medium tracking-widest">{t.copied}</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="font-mono text-xs text-white/90 uppercase tracking-wider">{color.hex}</p>
        <p className="font-mono text-[10px] text-white/50">{color.r}, {color.g}, {color.b}</p>
      </div>
    </div>
  );
};
