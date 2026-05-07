import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import { CollectibleVisual } from '../components/world/WorldItems';
import { collectibleByGameId, learningReceiptByGameId } from '../data/collectibles';

const allGameIds = ['math', 'memory', 'words'];

const skillLabelByGameId = {
  memory: 'Память',
  math: 'Счёт',
  words: 'Казахский язык',
};

function getNextHint(appState) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const remainingGameId = allGameIds.find((gameId) => !completedGames.includes(gameId));

  if (!remainingGameId) {
    return 'Скоро появятся Чарын, Домбра и аксессуары КамБота.';
  }

  const collectible = collectibleByGameId[remainingGameId];

  if (!collectible) {
    return 'Продолжай проходить игры, чтобы открывать новые предметы для мира Боты.';
  }

  if (remainingGameId === 'memory') {
    return `Пройди игру на память, чтобы открыть ${collectible.title}.`;
  }

  if (remainingGameId === 'math') {
    return `Реши задания, чтобы открыть ${collectible.title}.`;
  }

  return `Выучи казахские слова, чтобы открыть ${collectible.title}.`;
}

function RewardPage({ appState, goToScreen }) {
  const lastReward = appState.lastReward;
  const collectible = lastReward?.gameId ? collectibleByGameId[lastReward.gameId] : null;
  const receipt = lastReward?.learningReceipt || learningReceiptByGameId[lastReward?.gameId] || null;
  const isRepeat = Boolean(lastReward?.alreadyReceived);
  const nextHint = getNextHint(appState);
  const isRewardReady = Boolean(collectible);

  const handleOpenStudio = () => {
    if (collectible?.id && !isRepeat) {
      goToScreen('studio', { newlyUnlocked: collectible.id });
      return;
    }

    goToScreen('studio');
  };

  return (
    <section className="screen reward-screen">
      <Mascot
        mood="happy"
        size="large"
        speech="Смотри, что ты открыл для своего мира!"
      />

      <Card className={`reward-hero ${isRepeat ? 'reward-hero--repeat' : 'reward-hero--reveal'}`}>
        <div className="reward-hero__top">
          <span className={`badge ${isRepeat ? 'badge-muted' : 'badge-success'}`}>
            {isRepeat ? 'Предмет уже в твоём мире' : 'Новый предмет открыт!'}
          </span>
          <h2 className="reward-hero__title">
            {isRepeat ? 'Этот предмет уже в твоём мире' : 'Новый предмет открыт!'}
          </h2>
          <p className="reward-hero__subtitle">
            {isRepeat ? 'Награда уже получена' : 'Мир Боты стал богаче'}
          </p>
        </div>

        {isRewardReady ? (
          <div className="reward-hero__stage">
            {!isRepeat && (
              <div className="reward-particles" aria-hidden="true">
                <span className="reward-particle reward-particle--1" />
                <span className="reward-particle reward-particle--2" />
                <span className="reward-particle reward-particle--3" />
                <span className="reward-particle reward-particle--4" />
              </div>
            )}
            {!isRepeat && <span className="reward-glow" aria-hidden="true" />}
            <div className="reward-visual-shell">
              <CollectibleVisual
                visualKey={collectible.visualKey}
                locked={false}
                size="large"
                highlighted={!isRepeat}
              />
            </div>
            <div className="reward-hero__body">
              <span className="badge badge-muted">{collectible.category}</span>
              <h3 className="reward-hero__item-title">{collectible.title}</h3>
              <p className="muted">{collectible.learning}</p>
              {collectible.placementHint && (
                <div className="learning-unit">
                  <strong>Что изменится в мире</strong>
                  <p className="muted">{collectible.placementHint}</p>
                </div>
              )}
              <div className="reward-coin">
                {isRepeat ? 'Награда уже получена' : `+${lastReward.coins} ботакоинов`}
              </div>
              <p className="muted">
                {isRepeat
                  ? `Этот предмет уже в твоём мире. Всего: ${appState.coins} ботакоинов`
                  : `Всего: ${appState.coins} ботакоинов`}
              </p>
            </div>
          </div>
        ) : (
          <div className="reward-hero__empty">
            <p className="muted">Пройди первую игру, чтобы открыть предмет для Мира Боты.</p>
            <p className="muted">Всего: {appState.coins} ботакоинов</p>
          </div>
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
            {collectible && (
              <div className="learning-unit">
                <strong>Предмет открыт</strong>
                <p className="muted">{collectible.title}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="info-card">
        <h3 className="section-title">Следующее открытие</h3>
        <p className="muted">{nextHint}</p>
      </Card>

      <Button variant="primary" onClick={handleOpenStudio}>
        {isRepeat ? 'Открыть Мой мир Боты' : 'Добавить в Мой мир Боты'}
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
