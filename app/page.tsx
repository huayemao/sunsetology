'use client';
import React from 'react';
import { extractSunsetPalette } from '../utils/colorService';
import ColorExtractorBase from '../components/ColorExtractorBase';

const Home: React.FC = () => {
  // Sunset theme example images
  const exampleImages = [
    'https://images.pexels.com/photos/157090/pexels-photo-157090.jpeg',
    'https://images.pexels.com/photos/400421/pexels-photo-400421.jpeg'
  ];

  return (
    <ColorExtractorBase
      extractPalette={extractSunsetPalette}
      theme="sunset"
      modeText="General Extractor"
      modeLink="/general"
      altText="Original Sunset"
      exampleImages={exampleImages} // Pass example images
    />
  );
};

export default Home;