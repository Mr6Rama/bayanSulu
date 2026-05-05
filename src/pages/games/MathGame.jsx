import { useState } from 'react';
import Button from '../../components/Button';

const answers = [4, 5, 6];
const correctAnswer = 5;

function MathGame({ finishGame, goToScreen }) {
  const [status, setStatus] = useState('idle');

  const handleAnswer = (answer) => {
    setStatus(answer === correctAnswer ? 'success' : 'hint');
  };

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill">Астана</div>
        <h2 className="section-title">Счёт с КамБотом</h2>
        <p className="game-question">
          У КамБота было 2 конфеты. Он нашёл ещё 3. Сколько стало?
        </p>
      </div>

      <div className="game-options">
        {answers.map((answer) => (
          <button
            key={answer}
            type="button"
            className="answer-button"
            onClick={() => handleAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>

      {status === 'hint' && (
        <div className="game-message game-message--hint">Попробуй ещё раз</div>
      )}

      {status === 'success' && (
        <div className="game-message game-message--success">
          Правильно! 2 + 3 = 5.
          <span>Факт: счёт помогает быстро делить сладости поровну.</span>
        </div>
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
