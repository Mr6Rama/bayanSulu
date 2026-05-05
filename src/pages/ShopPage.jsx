import { rewards } from '../data/rewards';
import Button from '../components/Button';

function ShopPage({ appState, goToScreen }) {
  const handleSelectReward = (reward) => {
    if (appState.coins < reward.cost) {
      alert('Пока не хватает монет. Попробуй пройти ещё игры.');
      return;
    }

    alert(`${reward.title} будет доступен позже. Это экран-заглушка.`);
  };

  return (
    <section className="stack">
      <div className="card">
        <h2 className="section-title">Магазин наград</h2>
        <p className="muted">Баланс: {appState.coins} ботакоинов.</p>
      </div>

      <div className="grid">
        {rewards.map((reward) => {
          const missingCoins = reward.cost - appState.coins;
          const isAvailable = missingCoins <= 0;

          return (
            <button
              key={reward.id}
              type="button"
              className="card shop-card"
              onClick={() => handleSelectReward(reward)}
            >
              <span className="shop-card__cost">{reward.cost} ботакоинов</span>
              <h3 className="location-card__city">{reward.title}</h3>
              <p className="muted">{reward.description}</p>
              <span className={`shop-card__status ${isAvailable ? 'shop-card__status--ok' : ''}`}>
                {isAvailable ? 'Доступно' : `Нужно ещё ${missingCoins} ботакоинов`}
              </span>
            </button>
          );
        })}
      </div>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default ShopPage;
