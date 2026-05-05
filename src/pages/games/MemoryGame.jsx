import { useMemo, useState } from 'react';
import Button from '../../components/Button';

const pairItems = ['🍬', '🐪', '🏔️'];

function createDeck() {
  return pairItems
    .flatMap((emoji) => [
      { id: `${emoji}-1`, emoji },
      { id: `${emoji}-2`, emoji },
    ])
    .sort(() => Math.random() - 0.5);
}

function MemoryGame({ finishGame, goToScreen }) {
  const deck = useMemo(() => createDeck(), []);
  const [openCards, setOpenCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const isComplete = matchedCards.length === deck.length;

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

    if (firstCard.emoji === secondCard.emoji) {
      setMatchedCards((prev) => [...prev, firstId, secondId]);
      setOpenCards([]);
      return;
    }

    window.setTimeout(() => {
      setOpenCards([]);
    }, 700);
  };

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill">Алматы</div>
        <h2 className="section-title">Найди пару</h2>
        <p className="game-question">Открой карточки и найди три одинаковые пары.</p>
      </div>

      <div className="memory-grid">
        {deck.map((card) => {
          const isOpen = openCards.includes(card.id) || matchedCards.includes(card.id);

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${isOpen ? 'memory-card--open' : ''}`}
              onClick={() => handleCardClick(card)}
              aria-label={isOpen ? `Карточка ${card.emoji}` : 'Закрытая карточка'}
            >
              {isOpen ? card.emoji : '?'}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="game-message game-message--success">
          Все пары найдены!
          <span>Факт: игра на пары тренирует память и внимание.</span>
        </div>
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
