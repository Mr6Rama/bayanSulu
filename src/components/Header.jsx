import CoinBadge from './CoinBadge';
import Button from './Button';

const tabs = [
  { id: 'map', label: 'Карта' },
  { id: 'reward', label: 'Награда' },
  { id: 'shop', label: 'Магазин' },
  { id: 'parent', label: 'Для родителей' },
];

function Header({ currentScreen, onNavigate, appState }) {
  return (
    <header className="header">
      <div className="header__top">
        <div>
          <h1 className="header__title">Bayan Sulu Kids</h1>
          <p className="header__subtitle">
            {appState.name ? `Привет, ${appState.name}!` : 'Тёплое приложение для игр и наград'}
          </p>
        </div>
        <CoinBadge coins={appState.coins} />
      </div>

      <nav className="header__nav" aria-label="Основная навигация">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={currentScreen === tab.id ? 'chip-active' : 'chip'}
            className="button--compact"
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
