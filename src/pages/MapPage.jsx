import { locations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';

function MapPage({ appState, goToScreen }) {
  const handleLocationClick = (location) => {
    goToScreen(location.screen);
  };
  const completedCount = appState.completedGames.length;

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill-row">
          <span className="pill">👧 {appState.name || 'Ребёнок'}</span>
          <span className="pill">🎂 {appState.age || '—'} лет</span>
        </div>

        <div>
          <h2 className="section-title">Карта приключений</h2>
          <p className="muted">
            {appState.name || 'Игрок'}, пройдено {completedCount} из {locations.length} игр.
          </p>
        </div>

        <div className="progress-track" aria-label={`Пройдено ${completedCount} из ${locations.length}`}>
          <span style={{ width: `${(completedCount / locations.length) * 100}%` }} />
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat__value">{completedCount}/3</span>
            <span className="stat__label">игр пройдено</span>
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
              isCompleted={appState.completedGames.includes(location.id)}
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
