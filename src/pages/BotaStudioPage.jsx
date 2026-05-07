import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import { collectibleGames, collectibles } from '../data/collectibles';

function isUnlocked(collectible, appState) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const unlockedCollectibles = Array.isArray(appState.unlockedCollectibles)
    ? appState.unlockedCollectibles
    : [];

  return (
    unlockedCollectibles.includes(collectible.id) ||
    (collectible.unlockGameId && completedGames.includes(collectible.unlockGameId))
  );
}

function BotaStudioPage({ appState, goToScreen }) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const unlockedCount = collectibles.filter((collectible) => isUnlocked(collectible, appState)).length;
  const nextCollectible = collectibles.find((collectible) => !isUnlocked(collectible, appState));
  const hasAllGames = ['math', 'memory', 'words'].every((gameId) => completedGames.includes(gameId));

  return (
    <section className="screen">
      <Card className="stack bota-studio-hero">
        <div className="bota-studio-hero__copy">
          <h2 className="hero-title">Мой мир Боты</h2>
          <p className="muted">Собирай Казахстан вместе с КамБотом</p>
        </div>
        <Mascot
          mood="happy"
          size="medium"
          speech="Каждый предмет делает мой мир красивее!"
        />
        <div className="stat">
          <span className="stat__value">{unlockedCount} / {collectibles.length}</span>
          <span className="stat__label">открыто предметов</span>
        </div>
      </Card>

      <div className="collectibles-grid">
        {collectibles.map((collectible) => {
          const unlocked = isUnlocked(collectible, appState);

          return (
            <Card
              key={collectible.id}
              className={`collectible-card ${unlocked ? 'open' : 'locked'}`}
            >
              <div className="collectible-card__icon" aria-hidden="true">
                {unlocked ? collectible.icon : '◌'}
              </div>
              <div className="collectible-card__body">
                <span className="badge badge-muted">{collectible.category}</span>
                <h3 className="collectible-card__title">{collectible.title}</h3>
                <p className="collectible-card__text">
                  {unlocked ? collectible.learning : collectible.lockedReason}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="info-card">
        <h3 className="section-title">Следующее открытие</h3>
        <p className="muted">
          {hasAllGames
            ? 'Скоро откроются Чарын, Домбра и новые аксессуары КамБота.'
            : nextCollectible?.unlockGameId
            ? `Пройди игру '${collectibleGames[nextCollectible.unlockGameId]}' чтобы открыть ${nextCollectible.title}.`
            : nextCollectible
              ? nextCollectible.lockedReason
              : 'Все предметы открыты. Продолжай собирать мир Боты.'}
        </p>
      </Card>

      <Card className="info-card">
        <h3 className="section-title">Задание дня от КамБота</h3>
        <p className="muted">Выучи одно казахское слово и открой новый декор для мира завтра.</p>
      </Card>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться на карту
      </Button>
    </section>
  );
}

export default BotaStudioPage;
