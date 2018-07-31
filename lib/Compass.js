import React from 'react';

const MARGIN_FOR_ERROR = 1.5;

function Compass({ heading = 0, bearing = 0 }) {
  const rotation = heading - bearing;
  const headingMatches = rotation >= -MARGIN_FOR_ERROR && rotation <= MARGIN_FOR_ERROR;

  return (
    <div>
      <svg className="compass" preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 500">
        <g className="compass-cardinal">
          <circle className="outline" cx="250" cy="250" r="205" />
          <polygon points="250,105 215,250 250,395 285,250" />
          <circle className="pin" cx="250" cy="250" r="10" />
          <text x="242" y="80">N</text>
          <text x="420" y="250">E</text>
          <text x="243" y="435">S</text>
          <text x="60" y="250">W</text>
        </g>
        <g
          className={['compass-target', headingMatches ? 'heading-matches' : ''].join(' ')}
          transform={`rotate(${rotation} 250 250)`}>
          <rect x="250" y="5" width="18" height="18" transform="rotate(45 250 5)" />
        </g>
      </svg>
    </div>
  );
} export default Compass;
