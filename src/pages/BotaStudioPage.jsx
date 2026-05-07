import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { CollectibleVisual } from '../components/world/WorldItems';
import { collectibles } from '../data/collectibles';

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
  const worldLevel = unlockedCount <= 1 ? 1 : unlockedCount <= 3 ? 2 : 3;
  const worldLevelLabel =
    worldLevel === 1
      ? 'Уровень 1 — Пустая степь'
      : worldLevel === 2
        ? 'Уровень 2 — Первые открытия'
        : 'Уровень 3 — Маленький Казахстан';
  const worldProgress = Math.round((unlockedCount / collectibles.length) * 100);
  const mascotSpeech =
    unlockedCount === 0
      ? 'Начнём строить наш Казахстан?'
      : unlockedCount === 1
        ? 'Первый предмет уже в мире!'
        : hasAllGames
          ? 'Ты собрал первые места Казахстана. Скоро откроем новые!'
          : 'Твой мир становится больше!';
  const calloutText = activeHighlightId
    ? `${collectibles.find((collectible) => collectible.id === activeHighlightId)?.title || 'Новый предмет'} добавлен в твой мир!`
    : '';

  return (
    <section className="screen bota-studio-screen">
      <Card className="stack bota-studio-hero">
        <div className="bota-studio-hero__copy">
          <h2 className="hero-title">Мой мир Боты</h2>
          <p className="muted">Собирай Казахстан вместе с КамБотом</p>
        </div>
        <Mascot
          mood="happy"
          size="medium"
          speech={mascotSpeech}
        />
        <div className="stat">
          <span className="stat__value">
            {unlockedCount} / {collectibles.length}
          </span>
          <span className="stat__label">открыто предметов</span>
        </div>
        <div className="world-level-chip">
          <strong>{worldLevelLabel}</strong>
          <span className="muted">Мир собран на {worldProgress}%</span>
        </div>
      </Card>

      <Card className="world-scene-card">
        <div className="world-scene-head">
          <div>
            <h3 className="section-title">Bota World Scene</h3>
            <p className="muted">Тёплый мир Казахстана, где предметы открываются после обучения.</p>
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

        <div className="world-scene" aria-label="Bota World Scene">
          <div className="world-scene__sky" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--1" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--2" aria-hidden="true" />
          <div className="world-scene__cloud world-scene__cloud--3" aria-hidden="true" />
          <div className="world-scene__hills world-scene__hills--back" aria-hidden="true" />
          <div className="world-scene__hills world-scene__hills--front" aria-hidden="true" />
          <div className="world-scene__island" aria-hidden="true" />
          <div className="world-scene__path" aria-hidden="true" />
          <div className="world-scene__mascot" aria-hidden="true">
            <Mascot mood="main" size="medium" />
          </div>

          {orderedCollectibles.map((collectible) => {
            const unlocked = isUnlocked(collectible, appState);

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
              {selectedIsUnlocked ? 'Открыто в Bota Studio' : 'Откроется после задания'}
            </span>
          </div>

          <p className="muted">
            {selectedIsUnlocked ? selectedCollectible.learning : selectedCollectible.lockedReason}
          </p>

          <div className="learning-unit">
            <strong>{selectedCollectible.title}</strong>
            <p className="muted">
              {selectedIsUnlocked
                ? `Открыто через игру: ${selectedCollectible.unlockGameId ? selectedCollectible.unlockGameId : 'специальное задание'}`
                : selectedCollectible.lockedReason}
            </p>
          </div>
        </Card>
      )}

      <Card className="stack world-legend">
        <div className="world-legend__row">
          <span className="section-title">Открыто {unlockedCount} / {collectibles.length}</span>
          <span className="muted">Осталось собрать мир Боты по частям</span>
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
            ? 'Скоро откроются Чарын, Домбра и новые аксессуары КамБота.'
            : nextCollectible?.unlockGameId
              ? `Пройди игру «${nextCollectible.unlockGameId === 'memory'
                ? 'Казахские пары'
                : nextCollectible.unlockGameId === 'math'
                  ? 'Счёт с КамБотом'
                  : 'Казахские слова'}», чтобы открыть ${nextCollectible.title}.`
              : nextCollectible?.lockedReason || 'Продолжай собирать мир Боты.'}
        </p>
      </Card>

      <Card className="info-card">
        <h3 className="section-title">Задание дня от КамБота</h3>
        <p className="muted">Выучи одно казахское слово и открой новый декор для мира завтра.</p>
      </Card>
    </section>
  );
}

export default BotaStudioPage;
