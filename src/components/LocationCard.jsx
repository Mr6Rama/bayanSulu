import Button from './Button';

function LocationCard({ city, game, hint, onClick }) {
  return (
    <Button className="location-card" variant="secondary" onClick={onClick}>
      <h3 className="location-card__city">{city}</h3>
      <p className="location-card__game">{game}</p>
      <p className="muted">{hint}</p>
    </Button>
  );
}

export default LocationCard;
