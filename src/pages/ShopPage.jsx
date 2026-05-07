import React from 'react';
import { useMemo, useState } from 'react';
import { rewards } from '../data/rewards';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

function getRequestState(appState, rewardId) {
  return appState.rewardRequests.find((request) => request.rewardId === rewardId) || null;
}

function ShopPage({ appState, goToScreen, requestFamilyBonus }) {
  const [notice, setNotice] = useState('');

  const openStudioCount = Array.isArray(appState.unlockedCollectibles) ? appState.unlockedCollectibles.length : 0;
  const completedGamesCount = Array.isArray(appState.completedGames) ? appState.completedGames.length : 0;
  const screenTimeMinutes = appState.screenTimeMinutes ?? 18;

  const rewardCards = useMemo(
    () =>
      rewards.map((reward) => {
        const request = getRequestState(appState, reward.id);
        const missing = [];

        if (appState.coins < reward.cost) {
          missing.push(`Нужно ещё ${reward.cost - appState.coins} ботакоинов`);
        }

        if (completedGamesCount < reward.requiredGames) {
          missing.push(`Осталось пройти ${reward.requiredGames - completedGamesCount} образовательную игру`);
        }

        if (openStudioCount < reward.requiredCollectibles) {
          missing.push(`Открой ещё ${reward.requiredCollectibles - openStudioCount} предмет в Bota Studio`);
        }

        if (screenTimeMinutes > reward.screenTimeLimit) {
          missing.push(`Экранное время: ${screenTimeMinutes}/${reward.screenTimeLimit} минут`);
        }

        return { reward, request, missing };
      }),
    [appState.coins, appState.rewardRequests, completedGamesCount, openStudioCount, screenTimeMinutes],
  );

  const handleRequest = (reward) => {
    const result = requestFamilyBonus(reward);

    if (result.status === 'blocked') {
      setNotice(result.missing[0] || 'Не хватает условий для семейного бонуса.');
      return;
    }

    setNotice(result.message || 'Запрос отправлен родителю');
  };

  return (
    <section className="screen">
      <Mascot
        mood="main"
        size="medium"
        speech="Запроси семейный бонус у родителя, когда образовательный прогресс готов."
      />

      <Card className="stack">
        <h2 className="section-title">Семейные бонусы</h2>
        <p className="muted">Ботакоины выдаются только за образовательные задания.</p>
        <p className="muted">Баланс: {appState.coins} ботакоинов.</p>
      </Card>

      <Card className="info-card">
        Не играй дольше - учись коротко и получай семейный бонус с разрешения родителя.
      </Card>

      {notice && <Card className="info-card warning-card">{notice}</Card>}

      <div className="shop-grid">
        {rewardCards.map(({ reward, request, missing }) => {
          const isPending = request?.status === 'pending';
          const isApproved = request?.status === 'approved';
          const isDeclined = request?.status === 'declined';
          const canRequest = missing.length === 0 && !isPending && !isApproved;

          return (
            <Card key={reward.id} className="stack shop-card">
              <span className="shop-card-icon">{reward.icon}</span>
              <div>
                <h3 className="shop-card-title">{reward.title}</h3>
                <span className="shop-card__cost">{reward.cost} ботакоинов</span>
              </div>
              <p className="muted">{reward.description}</p>

              <div className="stack">
                <span className="badge badge-muted">{reward.bonusLabel}</span>
                <div className="shop-conditions">
                  <span>✓ {reward.cost} ботакоинов</span>
                  <span>✓ {reward.requiredGames} образовательные игры</span>
                  <span>✓ {reward.requiredCollectibles} предмета в Bota Studio</span>
                  <span>✓ экранное время: {screenTimeMinutes}/{reward.screenTimeLimit} минут</span>
                  <span>✓ подтверждение родителя</span>
                </div>
              </div>

              <span className={`badge ${isApproved ? 'badge-success' : isPending ? 'badge-muted' : isDeclined ? 'badge-muted' : canRequest ? 'badge-success' : 'badge-muted'}`}>
                {isApproved
                  ? 'Одобрено родителем'
                  : isPending
                    ? 'Запрос отправлен родителю'
                    : isDeclined
                      ? 'Родитель оставил на потом'
                      : missing.length > 0
                        ? missing[0]
                        : 'Готово к запросу'}
              </span>

              <Button
                type="button"
                variant={isPending || isApproved ? 'secondary' : 'primary'}
                disabled={isPending || isApproved}
                onClick={() => handleRequest(reward)}
              >
                {isApproved ? 'Запрос одобрен' : isPending ? 'Запрос отправлен родителю' : 'Запросить у родителя'}
              </Button>

              {missing.length > 0 && !isPending && !isApproved && (
                <div className="shop-missing-list">
                  {missing.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </Card>
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
