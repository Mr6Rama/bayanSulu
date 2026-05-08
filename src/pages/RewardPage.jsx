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
  words: 'Қазақский язык',
};

function getNextHint(appState) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const remainingGameId = allGameIds.find((gameId) => !completedGames.includes(gameId));

  if (!remainingGameId) {
    return 'Скоро появятся новые предметы для Мира Боты.';
  }

  const collectible = collectibleByGameId[remainingGameId];

  if (!collectible) {
    return 'Продолжай проходить игры, чтобы открывать новые предметы.';
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
      <Card className={`reward-hero ${isRepeat ? 'reward-hero--repeat' : 'reward-hero--reveal'}`}>
        <div className="reward-hero__top">
          <span className={`badge ${isRepeat ? 'badge-muted' : 'badge-success'}`}>
            {isRepeat ? 'Предмет уже открыт' : 'Новый предмет открыт!'}
          </span>
          <h2 className="reward-title">Жарайсың!</h2>
          <p className="reward-subtitle">Ты открыл новый предмет</p>
        </div>

        <div className="reward-hero__stage">
          <Mascot
            mood="happy"
            size="large"
            speech="Смотри, что ты открыл!"
            className="reward-mascot"
          />

          {isRewardReady ? (
            <div className="reward-hero__body">
              <div className="reward-celebration" aria-hidden="true">
                {!isRepeat && (
                  <div className="reward-particles">
                    <span className="reward-particle reward-particle--1" />
                    <span className="reward-particle reward-particle--2" />
                    <span className="reward-particle reward-particle--3" />
                    <span className="reward-particle reward-particle--4" />
                    <span className="reward-particle reward-particle--5" />
                    <span className="reward-particle reward-particle--6" />
                  </div>
                )}
                {!isRepeat && <span className="reward-glow" aria-hidden="true" />}
                <div className={`reward-visual-shell ${!isRepeat ? 'reward-visual-shell--active' : ''}`}>
                  <CollectibleVisual
                    visualKey={collectible.visualKey}
                    locked={false}
                    size="large"
                    highlighted={!isRepeat}
                  />
                </div>
              </div>

              <div className="reward-hero__body-copy">
                <span className="badge badge-muted">{collectible.category}</span>
                <h3 className="reward-hero__item-title">{collectible.title}</h3>
                <p className="muted">{collectible.learning}</p>
              </div>

              <div className="reward-coin reward-coin--burst">
                <span className="coin-burst" aria-hidden="true">
                  <span className="coin-burst__coin" />
                  <span className="coin-burst__coin" />
                  <span className="coin-burst__coin" />
                </span>
                <strong>{isRepeat ? 'Награда уже получена' : `+${lastReward.coins} ботакоинов`}</strong>
              </div>

              {collectible.placementHint && (
                <div className="learning-unit reward-learning-unit">
                  <strong>Что ты изучил</strong>
                  <p className="muted">{receipt?.learned || collectible.placementHint}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="reward-hero__empty">
              <p className="muted">Пройди первую игру — и предмет откроется.</p>
              <p className="muted">Сейчас: {appState.coins} ботакоинов</p>
            </div>
          )}
        </div>
      </Card>

      {lastReward && receipt && (
        <Card className="stack reward-receipt-card">
          <h3 className="section-title">Что ты изучил</h3>
          <div className="stack">
            <div className="learning-unit">
              <strong>Навык: {skillLabelByGameId[lastReward.gameId]}</strong>
              <p className="muted">{receipt.done}</p>
            </div>
            <div className="learning-unit">
              <strong>Что ты изучил</strong>
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

      <Card className="info-card reward-next-card">
        <h3 className="section-title">Следующее открытие</h3>
        <p className="muted">{nextHint}</p>
      </Card>

      <Button variant="primary" onClick={handleOpenStudio}>
        Добавить в Мир Боты
      </Button>
      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться на карту
      </Button>
    </section>
  );
}

export default RewardPage;
