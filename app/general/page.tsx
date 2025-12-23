'use client';
import React from 'react';
import { extractGeneralPalette } from '../../utils/colorService';
import ColorExtractorBase from '../../components/ColorExtractorBase';

const GeneralColorExtractor: React.FC = () => {
  // General theme example images
  const exampleImages = [
    'https://images.unsplash.com/photo-1505321907188-29d31afa7ae8?q=80&w=687&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508699245250-606fca51a8f1?q=80'
  ];

  return (
    <ColorExtractorBase
      extractPalette={extractGeneralPalette}
      theme="general"
      modeText="Sunset Mode"
      modeLink="/"
      altText="Original Image"
      exampleImages={exampleImages} // Pass example images
    />
  );
};

export default GeneralColorExtractor;