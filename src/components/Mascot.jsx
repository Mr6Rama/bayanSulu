import { useState } from 'react';

const imageMap = {
  main: '/assets/kambot/kambot-main.png',
  happy: '/assets/kambot/kambot-happy.png',
  thinking: '/assets/kambot/kambot-thinking.png',
  parent: '/assets/kambot/kambot-parent.png',
};

function Mascot({ mood = 'main', size = 'medium', speech, className = '' }) {
  const [hasImageError, setHasImageError] = useState(false);
  const src = imageMap[mood] || imageMap.main;

  return (
    <div className={`mascot mascot-${size} ${className}`.trim()}>
      <div className="mascot-figure" aria-hidden="true">
        {hasImageError ? (
          <span className="mascot-fallback">🐪</span>
        ) : (
          <img src={src} alt="" onError={() => setHasImageError(true)} />
        )}
      </div>
      {speech && <div className="speech-bubble">{speech}</div>}
    </div>
  );
}

export default Mascot;
