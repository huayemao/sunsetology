'use client';
import React from 'react';
import { extractGeneralPalette } from '../../utils/colorService';
import ColorExtractorBase from '../../components/ColorExtractorBase';

const GeneralColorExtractor: React.FC = () => {
  return (
    <ColorExtractorBase
      extractPalette={extractGeneralPalette}
      theme="general"
      modeText="Sunset Mode"
      modeLink="/"
      altText="Original Image"
    />
  );
};

export default GeneralColorExtractor;