function LocationCard({
  title,
  subtitle,
  icon,
  completed = false,
  locked = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`location-card ${completed ? 'completed' : ''}`}
      disabled={locked}
      onClick={onClick}
    >
      <span className="location-card-icon">{icon}</span>
      <span className="location-card-body">
        <span className="location-card-title">{title}</span>
        <span className="location-card-subtitle">{subtitle}</span>
        {completed && <span className="badge badge-success">✓ Пройдено</span>}
        {locked && <span className="badge badge-muted">Скоро</span>}
      </span>
    </button>
  );
}

export default LocationCard;
