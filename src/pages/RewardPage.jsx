import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import { collectibleByGameId, collectibleGames, learningReceiptByGameId } from '../data/collectibles';

const allGameIds = ['math', 'memory', 'words'];

const skillLabelByGameId = {
  memory: 'память',
  math: 'счёт',
  words: 'казахский язык',
};

function getNextHint(appState) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const remainingGameId = allGameIds.find((gameId) => !completedGames.includes(gameId));

  if (!remainingGameId) {
    return 'Скоро откроются Чарын, Домбра и новые аксессуары КамБота.';
  }

  const collectible = collectibleByGameId[remainingGameId];

  if (!collectible) {
    return 'Продолжай проходить игры, чтобы открывать новые предметы для мира Боты.';
  }

  return `Пройди «${collectibleGames[remainingGameId]}», чтобы открыть ${collectible.title}.`;
}

function RewardPage({ appState, goToScreen }) {
  const lastReward = appState.lastReward;
  const collectible = lastReward?.gameId ? collectibleByGameId[lastReward.gameId] : null;
  const receipt = lastReward?.learningReceipt || learningReceiptByGameId[lastReward?.gameId] || null;
  const isRepeat = Boolean(lastReward?.alreadyReceived);
  const nextHint = getNextHint(appState);

  return (
    <section className="screen reward-screen">
      <Mascot
        mood="happy"
        size="large"
        speech="Жарайсың! Ты отлично справился!"
      />

      <Card className="reward-card">
        <div className="coin-burst" aria-hidden="true">
          <span>🪙</span>
          <span>✨</span>
          <span>🪙</span>
        </div>
        <h2 className="reward-title">
          {isRepeat ? 'Награда уже получена' : 'Предмет открыт'}
        </h2>
        {lastReward ? (
          <>
            <p className="reward-subtitle">
              {isRepeat ? 'Предмет уже в твоём мире' : 'Предмет добавлен в мир Боты'}
            </p>
            {collectible && (
              <div className="reward-collectible">
                <div className="reward-collectible__icon" aria-hidden="true">
                  {collectible.icon}
                </div>
                <div className="reward-collectible__body">
                  <span className="badge badge-success">{collectible.category}</span>
                  <h3 className="reward-collectible__title">{collectible.title}</h3>
                  <p className="muted">{collectible.learning}</p>
                </div>
              </div>
            )}
            <div className="reward-coin">
              {isRepeat ? 'Награда уже получена' : `+${lastReward.coins} ботакоинов`}
            </div>
            <p className="muted">
              {isRepeat
                ? `Этот предмет уже открыт. Всего: ${appState.coins} ботакоинов`
                : `Всего: ${appState.coins} ботакоинов`}
            </p>
          </>
        ) : (
          <>
            <p className="muted">Пройди первую игру, чтобы получить ботакоины и предмет для мира.</p>
            <p className="muted">Всего: {appState.coins} ботакоинов</p>
          </>
        )}
      </Card>

      {lastReward && receipt && (
        <Card className="stack">
          <h3 className="section-title">Learning Receipt</h3>
          <div className="stack">
            <div className="learning-unit">
              <strong>Навык: {skillLabelByGameId[lastReward.gameId]}</strong>
              <p className="muted">{receipt.done}</p>
            </div>
            <div className="learning-unit">
              <strong>Что изучено</strong>
              <p className="muted">{receipt.learned}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="info-card">
        <h3 className="section-title">Следующее открытие</h3>
        <p className="muted">{nextHint}</p>
      </Card>

      <Button variant="primary" onClick={() => goToScreen('studio')}>
        {isRepeat ? 'Открыть Мой мир Боты' : 'Добавить в мой мир'}
      </Button>
      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться на карту
      </Button>
      <Button variant="secondary" onClick={() => goToScreen('shop')}>
        Открыть магазин
      </Button>
    </section>
  );
}

export default RewardPage;
