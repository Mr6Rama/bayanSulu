import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';

const answers = [4, 5, 6];
const correctAnswer = 5;

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
        speech="Посчитай конфеты вместе со мной!"
      />

      <Card className="stack">
        <span className="badge badge-muted">Астана • Счёт</span>
        <p className="game-question">
          У КамБота было 2 конфеты. Он нашёл ещё 3. Сколько стало?
        </p>
      </Card>

      <div className="game-options">
        {answers.map((answer) => (
          <button
            key={answer}
            type="button"
            className={`answer-option ${
              selectedAnswer === answer && status === 'success' ? 'correct' : ''
            } ${selectedAnswer === answer && status === 'hint' ? 'wrong' : ''}`}
            onClick={() => handleAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>

      {status === 'hint' && (
        <Card className="info-card warning-card">Попробуй ещё раз — ты близко!</Card>
      )}

      {status === 'success' && (
        <Card className="success-card">
          <h3>Правильно! 2 + 3 = 5.</h3>
          <p>Счёт помогает быстро решать задачи в магазине и дома.</p>
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
