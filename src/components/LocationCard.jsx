import Button from './Button';

function LocationCard({ city, game, hint, emoji, theme, isCompleted, onClick }) {
  return (
    <Button
      className={`location-card location-card--${theme} ${isCompleted ? 'location-card--done' : ''}`}
      variant="secondary"
      onClick={onClick}
    >
      <span className="location-card__emoji">{emoji}</span>
      <span>
        <span className="location-card__city">
          {city}
          {isCompleted && <span className="location-card__check">✓</span>}
        </span>
        <span className="location-card__game">{game}</span>
        <span className="location-card__hint">{hint}</span>
      </span>
    </Button>
  );
}

export default LocationCard;
