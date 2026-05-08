import React, { useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { collectibleByGameId, collectibles, learningReceiptByGameId } from '../data/collectibles';
import { rewards } from '../data/rewards';

const allGameIds = ['math', 'memory', 'words'];

function ParentModePage({ appState, resetProfile, goToScreen, approveRewardRequest, declineRewardRequest }) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const completedGamesCount = appState.completedGames.length;
  const hasAllGames = allGameIds.every((gameId) => appState.completedGames.includes(gameId));
  const completedReceipts = useMemo(
    () =>
      appState.completedGames
        .map((gameId) => ({
          gameId,
          skill: learningReceiptByGameId[gameId]?.skill || '',
          done: learningReceiptByGameId[gameId]?.done || '',
          learned: learningReceiptByGameId[gameId]?.learned || '',
          collectible: collectibleByGameId[gameId] || null,
        }))
        .filter((receipt) => receipt.done || receipt.learned),
    [appState.completedGames],
  );
  const unlockedCollectibles = collectibles.filter(
    (collectible) =>
      appState.unlockedCollectibles.includes(collectible.id) ||
      (collectible.unlockGameId && appState.completedGames.includes(collectible.unlockGameId)),
  );
  const pendingRequests = appState.rewardRequests.filter((request) => request.status === 'pending');
  const approvedRequests = appState.rewardRequests.filter((request) => request.status === 'approved');
  const declinedRequests = appState.rewardRequests.filter((request) => request.status === 'declined');
  const approvedCoupons = appState.approvedCoupons || [];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin === '1234') {
      setIsUnlocked(true);
      setError('');
      return;
    }

    setError('Неверный PIN');
  };

  const handleApprove = (request) => {
    const result = approveRewardRequest(request.id);
    if (result?.couponCode) {
      setStatusMessage(`Бонус одобрен. Демо-купон: ${result.couponCode}`);
    }
  };

  const handleDecline = (request) => {
    declineRewardRequest(request.id);
    setStatusMessage('Запрос оставлен на потом.');
  };

  if (!isUnlocked) {
    return (
      <section className="screen parent-screen parent-screen--gate">
        <Mascot mood="parent" size="medium" speech="Родительский режим защищён PIN-кодом." />

        <form className="stack" onSubmit={handleSubmit}>
          <Card className="stack parent-card parent-card--gate">
            <span className="badge badge-muted">Доступ для родителя</span>
            <h2 className="section-title">Введите PIN</h2>
            <input
              className="input pin-input"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              inputMode="numeric"
              maxLength="4"
              placeholder="PIN"
              aria-label="PIN"
            />
            {error && <div className="soft-error">{error}</div>}
          </Card>
          <Button type="submit">Войти</Button>
        </form>

        <Button variant="secondary" onClick={() => goToScreen('map')}>
          Вернуться к карте
        </Button>
      </section>
    );
  }

  return (
    <section className="screen parent-screen">
      <Card className="stack parent-summary-card">
        <div className="parent-summary-head">
          <div className="parent-summary-copy">
            <span className="badge badge-muted">Родителю</span>
            <h2 className="section-title">Спокойный обзор прогресса</h2>
            <p className="muted">Здесь видно, что ребёнок изучает, сколько уже пройдено и какие бонусы ждут решения.</p>
          </div>
          <Mascot mood="parent" size="small" />
        </div>

        <div className="parent-stat-grid">
          <div className="stat parent-stat">
            <span className="stat__value">{appState.screenTimeMinutes}/30</span>
            <span className="stat__label">Сегодня: {appState.screenTimeMinutes} / 30 минут</span>
          </div>
          <div className="stat parent-stat">
            <span className="stat__value">{completedGamesCount}/3</span>
            <span className="stat__label">Пройдено игр</span>
          </div>
          <div className="stat parent-stat">
            <span className="stat__value">{unlockedCollectibles.length}</span>
            <span className="stat__label">Открыто предметов</span>
          </div>
          <div className="stat parent-stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">Ботакоины</span>
          </div>
        </div>

        <ProgressBar
          value={completedGamesCount}
          max={allGameIds.length}
          label={`Пройдено игр: ${completedGamesCount} / ${allGameIds.length}`}
        />
      </Card>

      <Card className="stack parent-card">
        <h3 className="section-title">Что ребёнок изучил</h3>
        <div className="stack">
          {completedReceipts.length > 0 ? (
            completedReceipts.map((receipt) => (
              <div key={receipt.gameId} className="learning-unit parent-learning-unit">
                <strong>{receipt.skill}</strong>
                <p className="muted">{receipt.done}</p>
                <p className="muted">{receipt.learned}</p>
                {receipt.collectible && <p className="muted">Предмет: {receipt.collectible.title}</p>}
              </div>
            ))
          ) : (
            <p className="muted">Пока нет завершённых образовательных игр.</p>
          )}
        </div>
      </Card>

      <Card className="stack parent-card">
        <h3 className="section-title">Почему это безопасно</h3>
        <p className="muted">
          Бонусы выдаются за образовательные задания, а не за время в приложении. Лимит по умолчанию
          — 30 минут в день.
        </p>
        <div className="parent-safety-note">
          Родитель подтверждает бонусы вручную. Ребёнок видит только понятные задания и награды.
        </div>
      </Card>

      <Card className="stack parent-card">
        <h3 className="section-title">Запросы на бонусы</h3>
        {pendingRequests.length > 0 ? (
          <div className="stack">
            {pendingRequests.map((request) => (
              <div key={request.id} className="learning-unit parent-request-card">
                <div className="parent-request-card__head">
                  <strong>{request.title}</strong>
                  <span className="badge badge-muted">Ожидает решения</span>
                </div>
                <p className="muted">Игры: {request.completedGames}/{request.requiredGames}</p>
                <p className="muted">Предметы: {request.unlockedCollectibles}/{request.requiredCollectibles}</p>
                <p className="muted">Экранное время: {request.screenTimeMinutes}/{request.screenTimeLimit} минут</p>
                <div className="bottom-actions parent-actions">
                  <Button type="button" onClick={() => handleApprove(request)}>
                    Одобрить
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleDecline(request)}>
                    Отклонить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Пока нет запросов на бонусы.</p>
        )}
      </Card>

      {statusMessage && <Card className="info-card parent-status-card">{statusMessage}</Card>}

      {approvedCoupons.length > 0 && (
        <Card className="stack parent-card">
          <h3 className="section-title">Одобренные бонусы</h3>
          <div className="stack">
            {approvedCoupons.map((coupon) => {
              const reward = rewards.find((item) => item.id === coupon.rewardId);
              return (
                <div key={coupon.requestId} className="learning-unit parent-coupon-card">
                  <strong>{coupon.title}</strong>
                  <p className="muted">{reward?.title || 'Бонус семьи'}</p>
                  <p className="muted">Статус: Одобрено</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {approvedRequests.length > 0 && (
        <Card className="stack parent-card">
          <h3 className="section-title">История решений</h3>
          <div className="stack">
            {approvedRequests.map((request) => (
              <div key={request.id} className="learning-unit">
                <strong>{request.title}</strong>
                <p className="muted">Статус: Одобрено</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {declinedRequests.length > 0 && (
        <Card className="stack parent-card">
          <h3 className="section-title">Отклонённые запросы</h3>
          <div className="stack">
            {declinedRequests.map((request) => (
              <div key={request.id} className="learning-unit">
                <strong>{request.title}</strong>
                <p className="muted">Запрос был отложен.</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="stack parent-card">
        <h3 className="section-title">Безопасность и доверие</h3>
        <div className="stack">
          <p className="muted">Ботакоины выдаются только за образовательные задания, а не за время в приложении.</p>
          <p className="muted">Лимит по умолчанию — 30 минут в день.</p>
          <p className="muted">Семейные бонусы активируются только после подтверждения родителя.</p>
          <p className="muted">Ребёнок изучает Казахстан, счёт и казахские слова.</p>
        </div>
      </Card>

      {hasAllGames && (
        <Card className="info-card parent-complete-note">
          Все образовательные игры уже пройдены.
        </Card>
      )}

      <div className="bottom-actions">
        <Button variant="secondary" onClick={() => goToScreen('map')}>
          Вернуться к карте
        </Button>
        <Button onClick={resetProfile}>Сбросить профиль</Button>
      </div>
    </section>
  );
}

export default ParentModePage;
