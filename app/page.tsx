'use client';
import React from 'react';
import { extractSunsetPalette } from '../utils/colorService';
import ColorExtractorBase from '../components/ColorExtractorBase';

const Home: React.FC = () => {
  return (
    <ColorExtractorBase
      extractPalette={extractSunsetPalette}
      theme="sunset"
      modeText="General Extractor"
      modeLink="/general"
      altText="Original Sunset"
    />
  );
};

export default Home;