import { useState } from 'react';
import { rewards } from '../data/rewards';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

function getDemoCode(rewardId) {
  return `BOTA-${rewardId.toUpperCase()}`;
}

function ShopPage({ appState, goToScreen, purchaseReward }) {
  const [receipt, setReceipt] = useState(null);

  const handleExchange = (reward) => {
    const result = purchaseReward(reward);

    setReceipt({
      ...result,
      code: getDemoCode(reward.id),
      spentCoins: result.status === 'purchased' ? reward.cost : 0,
    });
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

      <Card className="info-card">
        Сканируй QR на упаковке «Бота», чтобы открыть новые бонусы.
      </Card>

      <div className="shop-grid">
        {rewards.map((reward) => {
          const isPurchased = appState.purchasedRewards.includes(reward.id);
          const missingCoins = reward.cost - appState.coins;
          const canExchange = !isPurchased && missingCoins <= 0;

          return (
            <Card key={reward.id} className="card shop-card">
              <span className="shop-card-icon">{reward.icon}</span>
              <div>
                <h3 className="shop-card-title">{reward.title}</h3>
                <span className="shop-card__cost">{reward.cost} ботакоинов</span>
              </div>
              <p className="muted">{reward.description}</p>
              <span className={`badge ${isPurchased ? 'badge-success' : canExchange ? 'badge-success' : 'badge-muted'}`}>
                {isPurchased ? 'Уже получено' : canExchange ? 'Доступно' : `Нужно ещё ${missingCoins} ботакоинов`}
              </span>
              <Button
                type="button"
                variant={isPurchased ? 'secondary' : 'primary'}
                disabled={isPurchased}
                onClick={() => handleExchange(reward)}
              >
                {isPurchased ? 'Уже получено' : 'Обменять'}
              </Button>
            </Card>
          );
        })}
      </div>

      {receipt && (
        <Card className="stack">
          <h3 className="section-title">
            {receipt.status === 'purchased'
              ? 'Купон создан'
              : receipt.status === 'already-owned'
                ? 'Уже получено'
                : 'Не хватает ботакоинов'}
          </h3>
          <p className="muted">
            {receipt.status === 'purchased'
              ? `Демо-код: ${receipt.code}`
              : receipt.status === 'already-owned'
                ? `Эта награда уже куплена. Демо-код: ${receipt.code}`
                : `Нужно ещё ${receipt.missingCoins} ботакоинов`}
          </p>
          <p className="muted">Купон активирует родитель.</p>
          <p className="muted">В MVP это демонстрация механики обмена ботакоинов на семейный бонус.</p>
          {receipt.status === 'purchased' && (
            <p className="muted">Списано: {receipt.spentCoins} ботакоинов.</p>
          )}
          {receipt.status === 'already-owned' && (
            <p className="muted">Списание не требуется.</p>
          )}
        </Card>
      )}

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default ShopPage;
