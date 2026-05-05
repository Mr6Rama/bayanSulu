import { useState } from 'react';
import Button from '../../components/Button';

const answers = ['Верблюд', 'Гора', 'Конфета'];
const correctAnswer = 'Верблюд';

function WordsGame({ finishGame, goToScreen }) {
  const [status, setStatus] = useState('idle');

  const handleAnswer = (answer) => {
    setStatus(answer === correctAnswer ? 'success' : 'hint');
  };

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill">Туркестан</div>
        <h2 className="section-title">Қазақша сөздер</h2>
        <p className="game-question">Что означает слово “түйе”?</p>
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
          Дұрыс! “Түйе” означает “верблюд”.
          <span>Факт: верблюд долго живёт в степи и пустыне без воды.</span>
        </div>
      )}

      {status === 'success' && (
        <Button onClick={() => finishGame('words', 10)}>Получить 10 ботакоинов</Button>
      )}

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Назад на карту
      </Button>
    </section>
  );
}

export default WordsGame;
