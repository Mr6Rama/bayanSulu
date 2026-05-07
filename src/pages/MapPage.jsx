import { useState } from 'react';
import { locations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';

function MapPage({ appState, goToScreen }) {
  const availableLocations = locations.filter((location) => location.status !== 'locked');
  const completedCount = availableLocations.filter((location) =>
    appState.completedGames.includes(location.gameId),
  ).length;
  const nextLocation = availableLocations.find(
    (location) => !appState.completedGames.includes(location.gameId),
  ) || locations.find((location) => location.status === 'locked');
  const [routeMessage, setRouteMessage] = useState('');

  const handleLocationClick = (location) => {
    if (location.status === 'locked') {
      setRouteMessage('Локация откроется после новых заданий или QR-кода на упаковке “Бота”.');
      return;
    }

    setRouteMessage('');
    if (location.gameId) {
      goToScreen(location.gameId);
    }
  };

  return (
    <section className="screen">
      <Card className="stack route-card">
        <h2 className="hero-title">Сәлем, {appState.name || 'дос'}!</h2>
        <Mascot
          mood="thinking"
          size="medium"
          speech="Выбери локацию и помоги мне пройти маршрут!"
        />
        <div className="map-summary-grid">
          <div className="stat">
            <span className="stat__value">{completedCount}/3</span>
            <span className="stat__label">пройдено игр</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">ботакоины</span>
          </div>
          <div className="stat">
            <span className="stat__value">{nextLocation?.title || 'Все открыто'}</span>
            <span className="stat__label">следующая локация</span>
          </div>
        </div>
        <ProgressBar
          value={completedCount}
          max={availableLocations.length}
          label={`Пройдено ${completedCount} из ${availableLocations.length} доступных игр`}
        />
        <Card className="info-card">
          Сканируй QR на упаковке «Бота», чтобы открыть новые локации.
        </Card>
      </Card>

      {routeMessage && <Card className="info-card warning-card">{routeMessage}</Card>}

      <div className="route-list">
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

      <div className="bottom-actions">
        <Button variant="secondary" onClick={() => goToScreen('shop')}>
          Магазин
        </Button>
        <Button variant="ghost" onClick={() => goToScreen('parent')}>
          Parent Mode
        </Button>
      </div>
    </section>
  );
}

export default MapPage;
