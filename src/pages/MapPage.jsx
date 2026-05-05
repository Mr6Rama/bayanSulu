import { locations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';

function MapPage({ appState, goToScreen }) {
  const handleLocationClick = (location) => {
    goToScreen(location.gameScreen);
  };
  const completedCount = appState.completedGames.length;

  return (
    <section className="screen">
      <Card className="stack route-card">
        <h2 className="hero-title">Сәлем, {appState.name || 'дос'}!</h2>
        <Mascot
          mood="thinking"
          size="medium"
          speech="Выбери локацию и помоги мне пройти маршрут!"
        />
        <ProgressBar
          value={completedCount}
          max={locations.length}
          label={`Пройдено ${completedCount} из ${locations.length} игр`}
        />
      </Card>

      <div className="route-list">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            title={location.title}
            subtitle={location.subtitle}
            icon={location.icon}
            completed={appState.completedGames.includes(location.id)}
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
