import React from 'react';
import { Palette, Translations } from '../../types';

interface ExportProductViewProps {
  imageUrl: string;
  palette: Palette;
  dateStr: string;
  quote: string;
  t: Translations;
}

export const ExportProductView: React.FC<ExportProductViewProps> = ({
  imageUrl,
  palette,
  dateStr,
  quote,
  t
}) => {
  // 使用排序后的颜色（从亮到暗）
  const sortedColors = [...palette.colors].sort((a, b) => {
    const lumA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const lumB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return lumB - lumA;
  }).slice(0, 5);

  return (
    <div className="relative shadow-2xl overflow-hidden bg-slate-900 text-white aspect-[9/16] h-full max-h-full">
      {/* 背景图片 */}
      <img 
        src={imageUrl} 
        alt="Original Photo" 
        className="w-full h-full object-cover opacity-90"
      />

      {/* 彩色圆圈覆盖层 */}
      <div className="absolute gap-4 inset-0 flex flex-col items-center justify-around p-16 pointer-events-none bg-black/5">
        {sortedColors.map((color, i) => (
          <div
            key={i}
            className="aspect-square rounded-full flex-1"
            style={{ 
              backgroundColor: color.hex,
              flexShrink: 0
            }}
          />
        ))}
      </div>

      {/* 标题文字 */}
      <div className="absolute top-8 left-8 right-8 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white font-bold">
          Joy<br />
          <span className="text-xl md:text-2xl font-light">to the world.</span>
        </h1>
      </div>

      {/* 底部文字 */}
      <div className="absolute bottom-12 left-8 right-8 text-center">
        <h2 className="text-2xl font-serif text-white">Fernweh</h2>
        <p className="text-sm text-white/90 mt-1">longing for far-off places</p>
      </div>
    </div>
  );
};