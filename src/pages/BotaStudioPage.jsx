import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { CollectibleVisual } from '../components/world/WorldItems';
import { collectibles } from '../data/collectibles';

const levelByCount = [
  { max: 1, label: 'Начало путешествия' },
  { max: 3, label: 'Первые открытия' },
  { max: Infinity, label: 'Маленький Казахстан' },
];

const unlockLabelByGameId = {
  math: 'Счёт с КамБотом',
  memory: 'Казахские пары',
  words: 'Казахские слова',
};

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

function getLevelLabel(unlockedCount) {
  return levelByCount.find((level) => unlockedCount <= level.max)?.label || 'Начало путешествия';
}

function BotaStudioPage({ appState, goToScreen, newlyUnlockedId }) {
  const completedGames = Array.isArray(appState.completedGames) ? appState.completedGames : [];
  const orderedCollectibles = useMemo(
    () => [...collectibles].sort((left, right) => left.layer - right.layer || left.sceneY - right.sceneY),
    [],
  );
  const unlockedCount = orderedCollectibles.filter((collectible) => isUnlocked(collectible, appState)).length;
  const nextCollectible = orderedCollectibles.find((collectible) => !isUnlocked(collectible, appState));
  const initialSelectedId =
    orderedCollectibles.find((collectible) => isUnlocked(collectible, appState))?.id ||
    orderedCollectibles[0]?.id ||
    null;
  const [selectedCollectibleId, setSelectedCollectibleId] = useState(initialSelectedId);
  const [activeHighlightId, setActiveHighlightId] = useState(newlyUnlockedId || null);

  useEffect(() => {
    if (newlyUnlockedId) {
      setSelectedCollectibleId(newlyUnlockedId);
      setActiveHighlightId(newlyUnlockedId);
    }
  }, [newlyUnlockedId]);

  useEffect(() => {
    if (!activeHighlightId) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveHighlightId(null);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [activeHighlightId]);

  const selectedCollectible =
    orderedCollectibles.find((collectible) => collectible.id === selectedCollectibleId) || nextCollectible || null;
  const selectedIsUnlocked = selectedCollectible ? isUnlocked(selectedCollectible, appState) : false;
  const categories = useMemo(
    () => [...new Set(collectibles.map((collectible) => collectible.category))],
    [],
  );
  const hasAllGames = ['math', 'memory', 'words'].every((gameId) => completedGames.includes(gameId));
  const worldLevelLabel = getLevelLabel(unlockedCount);
  const worldProgress = Math.round((unlockedCount / collectibles.length) * 100);
  const mascotSpeech =
    unlockedCount === 0
      ? 'Проходи игры, чтобы наполнять Мир Боты новыми местами Казахстана.'
      : unlockedCount === 1
        ? 'Первый предмет уже появился в Мире Боты.'
        : hasAllGames
          ? 'Мир Боты почти собран. Остались последние детали Казахстана.'
          : 'Проходи игры, чтобы наполнять Мир Боты новыми местами Казахстана.';
  const calloutText = activeHighlightId
    ? `${collectibles.find((collectible) => collectible.id === activeHighlightId)?.title || 'Новый предмет'} добавлен в Мир Боты!`
    : '';

  return (
    <section className="screen bota-studio-screen">
      <Card className="stack bota-studio-hero">
        <div className="bota-studio-hero__copy">
          <h2 className="hero-title">Мир Боты</h2>
          <p className="muted">Проходи игры, чтобы наполнять Мир Боты новыми местами Казахстана.</p>
        </div>
        <Mascot mood="happy" size="medium" speech={mascotSpeech} />
        <div className="stat">
          <span className="stat__value">
            {unlockedCount} / {collectibles.length}
          </span>
          <span className="stat__label">Открыто предметов</span>
        </div>
        <div className="world-level-chip">
          <strong>{worldLevelLabel}</strong>
          <span className="muted">Мир собран на {worldProgress}%</span>
        </div>
      </Card>

      <Card className="world-scene-card">
        <div className="world-scene-head">
          <div>
            <h3 className="section-title">Мир Боты</h3>
            <p className="muted">Предметы появляются там, где ребёнок проходит задания и открывает новые знания.</p>
          </div>
          <Button variant="secondary" onClick={() => goToScreen('map')}>
            Назад на карту
          </Button>
        </div>

        {calloutText && (
          <div className="world-callout" role="status" aria-live="polite">
            {calloutText}
          </div>
        )}

        <div className="world-scene" aria-label="Мир Боты">
          <div className="world-scene__sky" aria-hidden="true" />
          <div className="world-scene__sun" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--1" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--2" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--3" aria-hidden="true" />
          <div className="world-scene__hills world-scene__hills--back" aria-hidden="true" />
          <div className="world-scene__hills world-scene__hills--front" aria-hidden="true" />
          <div className="world-scene__steppe" aria-hidden="true" />
          <div className="world-scene__path" aria-hidden="true" />
          <div className="world-scene__mascot" aria-hidden="true">
            <Mascot mood="main" size="medium" />
          </div>

          {orderedCollectibles.map((collectible) => {
            const unlocked = isUnlocked(collectible, appState);
            const unlockHint = collectible.unlockGameId ? unlockLabelByGameId[collectible.unlockGameId] : '';

            return (
              <button
                key={collectible.id}
                type="button"
                className={`world-item world-item--${collectible.size} ${unlocked ? 'is-open' : 'is-locked'}`}
                style={{
                  left: `${collectible.sceneX}%`,
                  top: `${collectible.sceneY}%`,
                  zIndex: collectible.layer,
                }}
                onClick={() => setSelectedCollectibleId(collectible.id)}
                aria-label={`${collectible.title} ${unlocked ? 'открыт' : 'закрыт'}`}
              >
                <CollectibleVisual
                  visualKey={collectible.visualKey}
                  locked={!unlocked}
                  size={collectible.size}
                  highlighted={collectible.id === activeHighlightId}
                  unlockHint={!unlocked ? unlockHint : ''}
                />
              </button>
            );
          })}
        </div>
      </Card>

      {selectedCollectible && (
        <Card className={`stack world-inspector ${selectedIsUnlocked ? 'world-inspector--open' : 'world-inspector--locked'}`}>
          <div className="world-inspector__head">
            <div>
              <span className="badge badge-muted">{selectedCollectible.category}</span>
              <h3 className="section-title">{selectedCollectible.title}</h3>
            </div>
            <span className={`badge ${selectedIsUnlocked ? 'badge-success' : 'badge-muted'}`}>
              {selectedIsUnlocked ? 'Открыто в Мире Боты' : 'Откроется после игры'}
            </span>
          </div>

          <p className="muted">
            {selectedIsUnlocked ? selectedCollectible.learning : selectedCollectible.lockedReason}
          </p>

          <div className="learning-unit">
            <strong>{selectedCollectible.title}</strong>
            <p className="muted">
              {selectedIsUnlocked
                ? `Открыто через игру: ${selectedCollectible.unlockGameId ? unlockLabelByGameId[selectedCollectible.unlockGameId] : 'специальное задание'}`
                : selectedCollectible.lockedReason}
            </p>
          </div>
        </Card>
      )}

      <Card className="stack world-legend">
        <div className="world-legend__row">
          <span className="section-title">Открыто {unlockedCount} / {collectibles.length}</span>
          <span className="muted">Мир Боты растёт по мере обучения</span>
        </div>
        <ProgressBar value={unlockedCount} max={collectibles.length} label={`Мир собран на ${worldProgress}%`} />
        <div className="pill-row">
          {categories.map((category) => (
            <span key={category} className="pill">
              {category}
            </span>
          ))}
        </div>
      </Card>

      <Card className="info-card">
        <h3 className="section-title">Следующее открытие</h3>
        <p className="muted">
          {hasAllGames
            ? 'Скоро появятся новые предметы для Мира Боты.'
            : nextCollectible?.unlockGameId
              ? `Пройди игру «${unlockLabelByGameId[nextCollectible.unlockGameId] || nextCollectible.unlockGameId}», чтобы открыть ${nextCollectible.title}.`
              : nextCollectible?.lockedReason || 'Продолжай собирать Мир Боты.'}
        </p>
      </Card>

      <Card className="info-card">
        <h3 className="section-title">Задание дня от КамБота</h3>
        <p className="muted">Проходи игры, чтобы наполнять Мир Боты новыми местами Казахстана.</p>
      </Card>
    </section>
  );
}

export default BotaStudioPage;
