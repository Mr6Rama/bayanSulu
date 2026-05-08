import React, { useMemo, useState } from 'react';
import { rewards } from '../data/rewards';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

function getRequestState(appState, rewardId) {
  return appState.rewardRequests.find((request) => request.rewardId === rewardId) || null;
}

function pluralize(count, forms) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
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
          const diff = reward.requiredGames - completedGamesCount;
          missing.push(`Пройди ещё ${diff} ${pluralize(diff, ['игру', 'игры', 'игр'])}`);
        }

        if (openStudioCount < reward.requiredCollectibles) {
          const diff = reward.requiredCollectibles - openStudioCount;
          missing.push(`Открой ещё ${diff} ${pluralize(diff, ['предмет', 'предмета', 'предметов'])}`);
        }

        if (screenTimeMinutes > reward.screenTimeLimit) {
          missing.push('Нужно подтверждение родителя');
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
    <section className="screen shop-screen">
      <Mascot
        mood="main"
        size="medium"
        speech="Семейный бонус открывается за развивающие задания."
      />

      <Card className="stack shop-hero-card">
        <h2 className="section-title">Бонусы для семьи</h2>
        <p className="muted">Ботакоины выдаются только за развивающие задания, а не за время в приложении.</p>
        <div className="shop-trust-block">
          <strong>Ботакоины выдаются только за развивающие задания, а не за время в приложении.</strong>
        </div>
        <p className="muted">Баланс: {appState.coins} ботакоинов.</p>
      </Card>

      {notice && <Card className="info-card warning-card">{notice}</Card>}

      <div className="shop-grid">
        {rewardCards.map(({ reward, request, missing }) => {
          const isPending = request?.status === 'pending';
          const isApproved = request?.status === 'approved';
          const isDeclined = request?.status === 'declined';
          const isLocked = missing.length > 0 && !isPending && !isApproved;
          const buttonState = isApproved
            ? 'approved'
            : isPending
              ? 'pending'
              : isLocked
                ? 'locked'
                : 'available';
          const buttonLabel = {
            available: 'Попросить родителя',
            pending: 'Ожидает решения',
            approved: 'Купон одобрен',
            locked: 'Пока закрыто',
          }[buttonState];

          return (
            <Card
              key={reward.id}
              className={`family-reward-card ${buttonState === 'approved' ? 'family-reward-card--approved' : ''}`}
            >
              <div className="reward-main">
                <span className="shop-card-icon" aria-hidden="true">
                  {reward.icon}
                </span>
                <h3 className="shop-card-title">{reward.title}</h3>
                <span className="shop-card__cost">{reward.cost} ботакоинов</span>
                <p className="muted">{reward.description}</p>
              </div>

              <div className="reward-tags">
                <span className="badge badge-muted">{reward.bonusLabel}</span>
                <span className="shop-card__value">{reward.bonusValue}</span>
              </div>

              <div className="reward-requirements">
                <span className="shop-requirement-row">Стоимость: {reward.cost} ботакоинов</span>
                <span className="shop-requirement-row">Нужно игр: {reward.requiredGames}</span>
                <span className="shop-requirement-row">
                  Нужно предметов: {reward.requiredCollectibles}
                </span>
                <span className="shop-requirement-row">Лимит экрана: {reward.screenTimeLimit} минут</span>
                {missing.length > 0 && !isPending && !isApproved && (
                  <div className="shop-missing-list">
                    {missing.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )}
              </div>

              <span
                className={`badge ${
                  isApproved ? 'badge-success' : isPending ? 'badge-muted' : isLocked ? 'badge-muted' : 'badge-success'
                }`}
              >
                {buttonLabel}
              </span>

              <Button
                className="reward-action"
                type="button"
                variant={buttonState === 'available' ? 'primary' : 'secondary'}
                disabled={buttonState !== 'available'}
                onClick={() => handleRequest(reward)}
              >
                {buttonLabel}
              </Button>

              {isDeclined && <div className="shop-declined-note">Родитель пока не подтвердил этот бонус.</div>}
            </Card>
          );
        })}
      </div>

      <div className="bottom-actions">
        <Button variant="secondary" onClick={() => goToScreen('map')}>
          Назад на карту
        </Button>
        <Button variant="ghost" onClick={() => goToScreen('studio')}>
          Мир Боты
        </Button>
      </div>
    </section>
  );
}

export default ShopPage;
