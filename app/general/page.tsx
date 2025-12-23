'use client';
import React from 'react';
import { extractGeneralPalette } from '../../utils/colorService';
import ColorExtractorBase from '../../components/ColorExtractorBase';

const GeneralColorExtractor: React.FC = () => {
  return (
    <ColorExtractorBase
      extractPalette={extractGeneralPalette}
      themeColors={{
        primary: 'blue-400',
        secondary: 'green-500',
        tertiary: 'purple-600',
        hover: 'blue-400'
      }}
      buttonHoverColor="blue-100"
      modeText="Sunset Mode"
      modeLink="/"
      altText="Original Image"
    />
  );
};

export default GeneralColorExtractor;