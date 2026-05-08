import React from 'react';
import CoinBadge from './CoinBadge';
import Button from './Button';

const titleMap = {
  onboarding: 'Bayan Sulu Kids',
  map: 'Карта путешествия',
  reward: 'Награда',
  studio: 'Мир Боты',
  shop: 'Бонусы для семьи',
  parent: 'Родителю',
  math: 'Счёт с КамБотом',
  memory: 'Найди пару',
  words: 'Қазақша сөздер',
};

const backTargets = {
  reward: 'map',
  studio: 'map',
  shop: 'map',
  parent: 'map',
  math: 'map',
  memory: 'map',
  words: 'map',
};

function Header({ currentScreen, onNavigate, appState }) {
  const title = titleMap[currentScreen] || 'Bayan Sulu Kids';
  const backTarget = backTargets[currentScreen];

  return (
    <header className="header">
      {backTarget && (
        <Button variant="ghost" className="header-back" onClick={() => onNavigate(backTarget)}>
          ←
        </Button>
      )}
      <div className="header-title-group">
        <span className="header-kicker">Бота</span>
        <h1 className="header__title">{title}</h1>
      </div>
      <CoinBadge coins={appState.coins} />
    </header>
  );
}

export default Header;
