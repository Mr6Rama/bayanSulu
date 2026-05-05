import { rewards } from '../data/rewards';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

function ShopPage({ appState, goToScreen }) {
  const handleSelectReward = (reward) => {
    if (appState.coins < reward.cost) {
      alert('Пока не хватает монет. Попробуй пройти ещё игры.');
      return;
    }

    alert(`${reward.title} будет доступен позже. Это экран-заглушка.`);
  };

  return (
    <section className="screen">
      <Mascot
        mood="main"
        size="medium"
        speech="Обменивай ботакоины на семейные бонусы!"
      />

      <Card className="stack">
        <h2 className="section-title">Магазин наград</h2>
        <p className="muted">Баланс: {appState.coins} ботакоинов.</p>
      </Card>

      <div className="shop-grid">
        {rewards.map((reward) => {
          const missingCoins = reward.cost - appState.coins;
          const isAvailable = missingCoins <= 0;

          return (
            <Card
              key={reward.id}
              className="card shop-card"
              onClick={() => handleSelectReward(reward)}
            >
              <span className="shop-card-icon">{reward.icon}</span>
              <div>
                <h3 className="shop-card-title">{reward.title}</h3>
                <span className="shop-card__cost">{reward.cost} ботакоинов</span>
              </div>
              <p className="muted">{reward.description}</p>
              <span className={`badge ${isAvailable ? 'badge-success' : 'badge-muted'}`}>
                {isAvailable ? 'Доступно' : `Нужно ещё ${missingCoins} ботакоинов`}
              </span>
            </Card>
          );
        })}
      </div>

      <Card className="info-card">
        В MVP это концепт: реальные промокоды и кассовая интеграция не подключены.
      </Card>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default ShopPage;
