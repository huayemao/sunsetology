'use client';
import React from 'react';
import { extractSunsetPalette } from '../utils/colorService';
import ColorExtractorBase from '../components/ColorExtractorBase';

const Home: React.FC = () => {
  return (
    <ColorExtractorBase
      extractPalette={extractSunsetPalette}
      themeColors={{
        primary: 'orange-400',
        secondary: 'red-500',
        tertiary: 'purple-600',
        hover: 'orange-400'
      }}
      buttonHoverColor="orange-100"
      modeText="General Extractor"
      modeLink="/general"
      altText="Original Sunset"
    />
  );
};

export default Home;