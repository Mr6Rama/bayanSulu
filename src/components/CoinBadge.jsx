import React from 'react';
function CoinBadge({ coins }) {
  return (
    <div className="coin-badge" aria-label={`${coins} ботакоинов`}>
      <span>🪙</span>
      <strong>{coins}</strong>
    </div>
  );
}

export default CoinBadge;
