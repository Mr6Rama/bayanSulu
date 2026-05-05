import { locations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';

function MapPage({ appState, goToScreen }) {
  const handleLocationClick = (location) => {
    alert(`${location.city}: игра "${location.game}" будет добавлена позже.`);
  };

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill-row">
          <span className="pill">👧 {appState.name || 'Ребёнок'}</span>
          <span className="pill">🎂 {appState.age || '—'} лет</span>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat__value">{appState.completedGames}</span>
            <span className="stat__label">игр завершено</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">монет</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">Карта городов</h2>
        <div className="grid">
          {locations.map((location) => (
            <LocationCard
              key={location.city}
              {...location}
              onClick={() => handleLocationClick(location)}
            />
          ))}
        </div>
      </div>

      <Button variant="secondary" onClick={() => goToScreen('reward')}>
        Смотреть награду
      </Button>
    </section>
  );
}

export default MapPage;
