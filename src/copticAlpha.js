import React, { useState } from 'react';
import opentype from 'opentype.js';

const FontGlyphMapper = ({ title }) => {
  const [glyphMapping, setGlyphMapping] = useState([]);
  const [fileError, setFileError] = useState('');

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'font/ttf') {
      setFileError('Please upload a valid TTF font file.');
      return;
    }

    // Clear previous errors
    setFileError('');

    // Read the file as a binary string
    const reader = new FileReader();
    reader.onload = (e) => {
      const fontData = e.target.result;
      try {
        // Parse the font file using opentype.js
        const font = opentype.parse(fontData);

        // Create a mapping of glyph indices to letters from the title string
        const mapping = [];

        title.split('').forEach((letter) => {
          const glyph = font.charToGlyph(letter);
          if (glyph) {
            mapping.push({ letter, glyphIndex: glyph.index });
          }
        });

        setGlyphMapping(mapping);
      } catch (error) {
        setFileError('Error parsing the font file.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Map TTF Glyphs for: {title}</h1>

      <input type="file" accept=".ttf" onChange={handleFileUpload} />
      {fileError && <p style={{ color: 'red' }}>{fileError}</p>}

      {glyphMapping.length > 0 && (
        <div>
          <h2>Glyph to Letter Mapping:</h2>
          <ul>
            {glyphMapping.map((item, index) => (
              <li key={index}>
                Letter: {item.letter} - Glyph Index: {item.glyphIndex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FontGlyphMapper;