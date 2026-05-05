import { rewards } from '../data/rewards';
import Button from '../components/Button';

function ShopPage({ appState, setLastReward, goToScreen }) {
  const handleSelectReward = (reward) => {
    if (appState.coins < reward.cost) {
      alert('Пока не хватает монет. Попробуй пройти ещё игры.');
      return;
    }

    setLastReward(reward.title);
    alert(`${reward.title} будет доступен позже. Это экран-заглушка.`);
  };

  return (
    <section className="stack">
      <div className="card">
        <h2 className="section-title">Магазин наград</h2>
        <p className="muted">Пока это базовый каркас. Покупки появятся позже.</p>
      </div>

      <div className="grid">
        {rewards.map((reward) => (
          <button
            key={reward.id}
            type="button"
            className="card location-card"
            onClick={() => handleSelectReward(reward)}
          >
            <h3 className="location-card__city">{reward.title}</h3>
            <p className="location-card__game">{reward.cost} монет</p>
            <p className="muted">{reward.description}</p>
          </button>
        ))}
      </div>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default ShopPage;
