import React, { useState } from 'react';
import { locations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';

const mapStops = [
  { top: '16%', left: '18%', mascotTop: '7%', mascotLeft: '28%' },
  { top: '32%', left: '44%', mascotTop: '20%', mascotLeft: '55%' },
  { top: '18%', left: '72%', mascotTop: '6%', mascotLeft: '77%' },
  { top: '48%', left: '72%', mascotTop: '38%', mascotLeft: '78%' },
  { top: '72%', left: '44%', mascotTop: '62%', mascotLeft: '50%' },
];

function MapPage({ appState, goToScreen }) {
  const availableLocations = locations.filter((location) => location.status !== 'locked');
  const completedCount = availableLocations.filter((location) =>
    appState.completedGames.includes(location.gameId),
  ).length;
  const isDailyChestOpened = appState.completedGames.length > 0;
  const nextPlayableLocation =
    availableLocations.find((location) => !appState.completedGames.includes(location.gameId)) ||
    null;
  const [routeMessage, setRouteMessage] = useState('');
  const nextLocationIndex = nextPlayableLocation ? locations.indexOf(nextPlayableLocation) : -1;

  const handleLocationClick = (location) => {
    if (location.status === 'locked') {
      setRouteMessage('Эта локация откроется позже.');
      return;
    }

    setRouteMessage('');
    if (location.gameId) {
      goToScreen(location.gameId);
    }
  };

  const handleNextPlay = () => {
    if (nextPlayableLocation?.gameId) {
      goToScreen(nextPlayableLocation.gameId);
    }
  };

  return (
    <section className="screen">
      <Card className="stack route-card adventure-map-card">
        <div className="adventure-map__intro">
          <div className="adventure-map__copy">
            <span className="badge badge-muted">Казахстан</span>
            <h2 className="hero-title">Камбот ведёт по маршруту</h2>
            <p className="muted">Пройди задание — открой новую локацию!</p>
          </div>

          <div className="map-summary-grid">
            <div className="stat">
              <span className="stat__value">{completedCount}/3</span>
              <span className="stat__label">пройдено игр</span>
            </div>
            <div className="stat">
              <span className="stat__value">{appState.coins}</span>
              <span className="stat__label">ботакоинов</span>
            </div>
            <div className="stat">
              <span className="stat__value">{nextPlayableLocation?.title || 'всё открыто'}</span>
              <span className="stat__label">следующая точка</span>
            </div>
          </div>

          <Card className={`daily-chest-card ${isDailyChestOpened ? 'daily-chest-card--open' : ''}`}>
            <div className="daily-chest-card__icon" aria-hidden="true">
              <span className="daily-chest-card__spark daily-chest-card__spark--1" />
              <span className="daily-chest-card__spark daily-chest-card__spark--2" />
              <span className="daily-chest-card__spark daily-chest-card__spark--3" />
              <span className="daily-chest-card__chest">
                <span className="daily-chest-card__lid" />
                <span className="daily-chest-card__band" />
                <span className="daily-chest-card__lock" />
              </span>
            </div>
            <div className="daily-chest-card__body">
              <h3 className="section-title">Ежедневный сундук</h3>
              <p className="muted">Пройди одно задание сегодня — получи бонус</p>
              <span className={`badge ${isDailyChestOpened ? 'badge-success' : 'badge-muted'}`}>
                {isDailyChestOpened ? 'Открыт' : 'Закрыт'}
              </span>
            </div>
          </Card>
        </div>

        <div className="adventure-map">
          <div className="adventure-map__sky" aria-hidden="true" />
          <div className="adventure-map__hills adventure-map__hills--back" aria-hidden="true" />
          <div className="adventure-map__hills adventure-map__hills--front" aria-hidden="true" />
          <div className="adventure-map__steppe" aria-hidden="true" />
          <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points="18,16 44,32 72,18 72,48 44,72"
              fill="none"
              stroke="rgba(255,255,255,0.78)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 8"
            />
            <polyline
              points="18,16 44,32 72,18 72,48 44,72"
              fill="none"
              stroke="rgba(234, 146, 40, 0.85)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 8"
            />
          </svg>

          {nextPlayableLocation && (
            <div
              className="map-mascot"
              style={{
                top: mapStops[nextLocationIndex]?.mascotTop,
                left: mapStops[nextLocationIndex]?.mascotLeft,
              }}
              aria-hidden="true"
            >
              <Mascot mood="thinking" size="small" />
            </div>
          )}

          {locations.map((location, index) => {
            const isCompleted = appState.completedGames.includes(location.gameId);
            const isLocked = location.status === 'locked';
            const isActive = nextPlayableLocation?.id === location.id;

            return (
              <button
                key={location.id}
                type="button"
                className={`map-node ${isActive ? 'map-node--active' : ''} ${isCompleted ? 'map-node--completed' : ''} ${
                  isLocked ? 'map-node--locked' : ''
                }`}
                style={{
                  top: mapStops[index]?.top,
                  left: mapStops[index]?.left,
                }}
                onClick={() => handleLocationClick(location)}
              >
                <span className="map-node__pin">
                  <span className="map-node__icon">{location.icon}</span>
                  <span className="map-node__status" aria-hidden="true">
                    {isLocked ? 'З' : isCompleted ? '✓' : isActive ? '→' : ''}
                  </span>
                </span>
                <span className="map-node__label">{location.title}</span>
              </button>
            );
          })}
        </div>

        <div className="stack">
          <Button
            variant="primary"
            className="map-cta"
            onClick={handleNextPlay}
            disabled={!nextPlayableLocation}
          >
            Играть в следующую локацию
          </Button>
          <Button variant="ghost" onClick={() => goToScreen('studio')}>
            Мой мир Боты
          </Button>
        </div>

        <ProgressBar
          value={completedCount}
          max={availableLocations.length}
          label={`Пройдено ${completedCount} из ${availableLocations.length} доступных игр`}
        />

        {routeMessage && <Card className="info-card warning-card">{routeMessage}</Card>}
      </Card>

      <Card className="stack info-card map-secondary-card">
        <div className="adventure-map__secondary-head">
          <h3 className="section-title">Ещё локации</h3>
          <p className="muted">Открывай, когда будешь готов.</p>
        </div>
        <div className="route-list route-list--secondary">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              title={location.title}
              subtitle={location.subtitle}
              icon={location.icon}
              fact={location.fact}
              reward={location.reward}
              status={
                location.status === 'locked'
                  ? 'locked'
                  : appState.completedGames.includes(location.gameId)
                    ? 'completed'
                    : 'available'
              }
              completed={appState.completedGames.includes(location.gameId)}
              onClick={() => handleLocationClick(location)}
            />
          ))}
        </div>
      </Card>

      <div className="bottom-actions">
        <Button variant="secondary" onClick={() => goToScreen('shop')}>
          Бонусы
        </Button>
        <Button variant="ghost" onClick={() => goToScreen('parent')}>
          Родителю
        </Button>
      </div>
    </section>
  );
}

export default MapPage;
