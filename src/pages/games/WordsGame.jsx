import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';

const answers = ['Верблюд', 'Гора', 'Конфета'];
const correctAnswer = 'Верблюд';

function WordsGame({ finishGame, goToScreen }) {
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
        speech="Давай выучим казахское слово!"
      />

      <Card className="stack">
        <span className="badge badge-muted">Туркестан • Қазақша</span>
        <p className="game-question">Что означает слово “түйе”?</p>
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
        <Card className="info-card warning-card">
          Подумай ещё немного. КамБот подсказывает: это животное пустыни.
        </Card>
      )}

      {status === 'success' && (
        <Card className="success-card">
          <h3>Дұрыс! “Түйе” означает “верблюд”.</h3>
          <p>“Түйе” — это верблюд. КамБот тоже маленький верблюжонок.</p>
        </Card>
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
