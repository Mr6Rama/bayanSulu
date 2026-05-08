import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';

const answers = [4, 5, 6];
const correctAnswer = 5;

function CandyToken({ filled = false }) {
  return <span className={`candy-token ${filled ? 'filled' : ''}`} aria-hidden="true" />;
}

function MathGame({ finishGame, goToScreen }) {
  const [status, setStatus] = useState('idle');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setStatus(answer === correctAnswer ? 'success' : 'hint');
  };

  return (
    <section className="screen">
      <Mascot
        mood="thinking"
        size="small"
        speech="Помоги мне посчитать сладости для пикника!"
      />

      <Card className="stack math-game-card">
        <span className="badge badge-muted">Астана • Счёт</span>
        <div className="math-equation" aria-label="2 конфеты плюс 3 конфеты равно вопрос">
          <div className="math-equation__group">
            <div className="candy-cluster" aria-hidden="true">
              <CandyToken filled />
              <CandyToken filled />
            </div>
            <span className="math-equation__label">2 конфеты</span>
          </div>
          <span className="math-equation__symbol" aria-hidden="true">
            +
          </span>
          <div className="math-equation__group">
            <div className="candy-cluster" aria-hidden="true">
              <CandyToken filled />
              <CandyToken filled />
              <CandyToken filled />
            </div>
            <span className="math-equation__label">3 конфеты</span>
          </div>
          <span className="math-equation__symbol math-equation__symbol--equals" aria-hidden="true">
            =
          </span>
          <span className="math-equation__result" aria-hidden="true">
            ?
          </span>
        </div>
      </Card>

      <div className="game-options math-options">
        {answers.map((answer) => (
          <button
            key={answer}
            type="button"
            className={`answer-option math-answer-option ${
              selectedAnswer === answer && status === 'success' ? 'correct' : ''
            } ${selectedAnswer === answer && status === 'hint' ? 'soft-wrong' : ''}`}
            onClick={() => handleAnswer(answer)}
          >
            <span className="math-answer-option__value">{answer}</span>
          </button>
        ))}
      </div>

      {status === 'hint' && (
        <Card className="info-card math-hint-card">Посмотри на обе кучки вместе.</Card>
      )}

      {status === 'success' && (
        <Card className="success-card math-success-card">
          <h3>Дұрыс! КамБот собрал сладости.</h3>
          <p>Теперь можно взять награду и идти дальше.</p>
        </Card>
      )}

      {status === 'success' && (
        <Button onClick={() => finishGame('math', 10)}>Получить 10 ботакоинов</Button>
      )}

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default MathGame;
