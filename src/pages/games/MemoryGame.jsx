import React, { useMemo, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';

const pairItems = [
  { key: 'kambot', title: 'КамБот', symbol: 'КБ', accent: 'teal' },
  { key: 'candy', title: 'конфета Бота', symbol: 'БО', accent: 'pink' },
  { key: 'baiterek', title: 'Байтерек', symbol: 'БТ', accent: 'gold' },
  { key: 'yurt', title: 'юрта', symbol: 'ЮР', accent: 'sand' },
  { key: 'mountains', title: 'горы', symbol: 'ГР', accent: 'sky' },
  { key: 'dombra', title: 'домбра', symbol: 'ДМ', accent: 'orange' },
];

function createDeck() {
  return pairItems
    .flatMap((item) => [
      { id: `${item.key}-1`, ...item },
      { id: `${item.key}-2`, ...item },
    ])
    .sort(() => Math.random() - 0.5);
}

function MemoryGame({ finishGame, goToScreen }) {
  const deck = useMemo(() => createDeck(), []);
  const [openCards, setOpenCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const isComplete = matchedCards.length === deck.length;
  const matchedPairs = matchedCards.length / 2;
  const totalPairs = deck.length / 2;

  const handleCardClick = (card) => {
    if (
      openCards.length === 2 ||
      openCards.includes(card.id) ||
      matchedCards.includes(card.id)
    ) {
      return;
    }

    const nextOpenCards = [...openCards, card.id];
    setOpenCards(nextOpenCards);

    if (nextOpenCards.length !== 2) return;

    const [firstId, secondId] = nextOpenCards;
    const firstCard = deck.find((item) => item.id === firstId);
    const secondCard = deck.find((item) => item.id === secondId);

    if (firstCard.key === secondCard.key) {
      setMatchedCards((prev) => [...prev, firstId, secondId]);
      setOpenCards([]);
      return;
    }

    window.setTimeout(() => {
      setOpenCards([]);
    }, 700);
  };

  return (
    <section className="screen">
      <Mascot
        mood="thinking"
        size="small"
        speech="Найди пары и открой предмет для Мира Боты!"
      />

      <Card className="stack memory-intro-card">
        <span className="badge badge-muted">Алматы • Память</span>
        <p className="game-question">Найди одинаковые пары.</p>
        <p className="memory-progress">Найдено пар: {matchedPairs} / {totalPairs}</p>
      </Card>

      <div className="memory-grid">
        {deck.map((card) => {
          const isOpen = openCards.includes(card.id) || matchedCards.includes(card.id);

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${isOpen ? 'open' : ''} memory-card--${card.accent}`}
              onClick={() => handleCardClick(card)}
              aria-label={isOpen ? card.title : 'Закрытая карточка'}
            >
              <span className="memory-card__inner">
                <span className="memory-card__face memory-card__face--back" aria-hidden="true">
                  <span className="memory-card__ornament" />
                  <span className="memory-card__ornament memory-card__ornament--alt" />
                  <span className="memory-card__brand">Бота</span>
                </span>
                <span className="memory-card__face memory-card__face--front" aria-hidden="true">
                  <span className="memory-card__glow" />
                  <span className="memory-card__symbol">{card.symbol}</span>
                  <span className="memory-card__title">{card.title}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {isComplete && (
        <Card className="success-card memory-success-card">
          <h3>Все пары найдены!</h3>
          <p>Ты отлично запомнил карточки.</p>
        </Card>
      )}

      {isComplete && (
        <Button onClick={() => finishGame('memory', 10)}>Получить 10 ботакоинов</Button>
      )}

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default MemoryGame;
