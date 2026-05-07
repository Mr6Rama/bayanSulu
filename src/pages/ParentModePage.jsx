import React from 'react';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { collectibleByGameId, collectibles, learningReceiptByGameId } from '../data/collectibles';
import { rewards } from '../data/rewards';
import { locations } from '../data/locations';

const badgeLabels = {
  memory: 'Мастер памяти',
  math: 'Юный математик',
  words: 'Знаток казахских слов',
};

const allGameIds = ['math', 'memory', 'words'];

function ParentModePage({ appState, resetProfile, goToScreen, approveRewardRequest, declineRewardRequest }) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const hasAllGames = allGameIds.every((gameId) => appState.completedGames.includes(gameId));
  const completedReceipts = useMemo(
    () =>
      appState.completedGames.map((gameId) => ({
        gameId,
        skill: learningReceiptByGameId[gameId]?.skill || '',
        done: learningReceiptByGameId[gameId]?.done || '',
        learned: learningReceiptByGameId[gameId]?.learned || '',
        collectible: collectibleByGameId[gameId] || null,
      })),
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
  const coupons = rewards.filter((reward) => approvedCoupons.some((item) => item.rewardId === reward.id));

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
    setStatusMessage('Родитель оставил бонус на потом.');
  };

  if (!isUnlocked) {
    return (
      <section className="screen">
        <Mascot
          mood="parent"
          size="medium"
          speech="Родительский режим защищён PIN-кодом."
        />

        <form className="stack" onSubmit={handleSubmit}>
          <Card className="stack">
            <span className="badge badge-muted">Родительский доступ</span>
            <h2 className="section-title">Введите PIN</h2>
            <input
              className="input pin-input"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              inputMode="numeric"
              maxLength="4"
              placeholder="PIN"
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
    <section className="screen">
      <Card className="stack">
        <h2 className="section-title">Bota Balance</h2>
        <div className="parent-stat-grid">
          <div className="stat">
            <span className="stat__value">{appState.name || '—'}</span>
            <span className="stat__label">имя ребёнка</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.age || '—'}</span>
            <span className="stat__label">возраст</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">ботакоинов</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.completedGames.length}/3</span>
            <span className="stat__label">completedGames</span>
          </div>
          <div className="stat">
            <span className="stat__value">{unlockedCollectibles.length}/8</span>
            <span className="stat__label">предметов Bota Studio</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.screenTimeMinutes}/30</span>
            <span className="stat__label">screen-time сегодня</span>
          </div>
        </div>
        <ProgressBar
          value={appState.completedGames.length}
          max={locations.length}
          label={`Пройдено игр ${appState.completedGames.length} из ${locations.length}`}
        />
      </Card>

      <Card className="stack">
        <h3 className="section-title">Learning proof</h3>
        <div className="stack">
          {completedReceipts.map((receipt) => (
            <div key={receipt.gameId} className="learning-unit">
              <strong>{receipt.skill}</strong>
              <p className="muted">{receipt.done}</p>
              <p className="muted">{receipt.learned}</p>
            </div>
          ))}
          {completedReceipts.length === 0 && <p className="muted">Пока нет завершённых образовательных игр.</p>}
        </div>
      </Card>

      <Card className="stack">
        <h3 className="section-title">Bota Studio</h3>
        <p className="muted">Что ребёнок построил в мире Боты.</p>
        <div className="pill-row">
          {unlockedCollectibles.map((collectible) => (
            <span key={collectible.id} className="pill">
              {collectible.icon} {collectible.title}
            </span>
          ))}
          {unlockedCollectibles.length === 0 && <p className="muted">Пока мир только начинает строиться.</p>}
        </div>
      </Card>

      <Card className="stack">
        <h3 className="section-title">Запросы на семейные бонусы</h3>
        {pendingRequests.length > 0 ? (
          <div className="stack">
            {pendingRequests.map((request) => (
              <div key={request.id} className="learning-unit">
                <strong>{request.title}</strong>
                <p className="muted">✓ игры пройдены: {request.completedGames}/{request.requiredGames}</p>
                <p className="muted">✓ предметы открыты: {request.unlockedCollectibles}/{request.requiredCollectibles}</p>
                <p className="muted">✓ screen-time: {request.screenTimeMinutes}/{request.screenTimeLimit} минут</p>
                <div className="bottom-actions">
                  <Button type="button" onClick={() => handleApprove(request)}>
                    Одобрить
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleDecline(request)}>
                    Оставить на потом
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Пока нет запросов на семейные бонусы.</p>
        )}
      </Card>

      {statusMessage && <Card className="info-card">{statusMessage}</Card>}

      {approvedCoupons.length > 0 && (
        <Card className="stack">
          <h3 className="section-title">Одобренные демо-купоны</h3>
          <div className="stack">
            {approvedCoupons.map((coupon) => (
              <div key={coupon.requestId} className="learning-unit">
                <strong>{coupon.title}</strong>
                <p className="muted">Код: {coupon.couponCode}</p>
                <p className="muted">Статус: approved</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {approvedRequests.length > 0 && (
        <Card className="stack">
          <h3 className="section-title">История одобрений</h3>
          <div className="stack">
            {approvedRequests.map((request) => (
              <div key={request.id} className="learning-unit">
                <strong>{request.title}</strong>
                <p className="muted">Статус: approved</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {declinedRequests.length > 0 && (
        <Card className="stack">
          <h3 className="section-title">Отклонённые запросы</h3>
          <div className="stack">
            {declinedRequests.map((request) => (
              <div key={request.id} className="learning-unit">
                <strong>{request.title}</strong>
                <p className="muted">Родитель оставил бонус на потом.</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="stack">
        <h3 className="section-title">Почему Bota Balance безопасен?</h3>
        <div className="stack">
          <p className="muted">• Ботакоины выдаются только за образовательные задания</p>
          <p className="muted">• Нет наград за время в приложении</p>
          <p className="muted">• Лимит по умолчанию — 30 минут в день</p>
          <p className="muted">• Семейные бонусы активирует только родитель</p>
          <p className="muted">• Ребёнок изучает Казахстан, счёт и казахские слова</p>
        </div>
      </Card>

      <Card className="info-card">
        Ботакоины выдаются только за образовательные задания, а семейный бонус подтверждает родитель.
      </Card>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться к карте
      </Button>
      <Button onClick={resetProfile}>Сбросить профиль</Button>
    </section>
  );
}

export default ParentModePage;
