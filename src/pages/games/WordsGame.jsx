import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';

const questions = [
  {
    kazakh: 'түйе',
    answer: 'верблюд',
    options: ['верблюд', 'гора', 'яблоко'],
    hint: 'ТҮЙ',
    hintText: 'Животное с горбами.',
  },
  {
    kazakh: 'тау',
    answer: 'гора',
    options: ['река', 'гора', 'домбра'],
    hint: 'ТАУ',
    hintText: 'Высокая часть земли.',
  },
  {
    kazakh: 'алма',
    answer: 'яблоко',
    options: ['яблоко', 'юрта', 'конфета'],
    hint: 'АЛМ',
    hintText: 'Круглый сладкий фрукт.',
  },
];

function WordsGame({ finishGame, goToScreen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [finishedQuiz, setFinishedQuiz] = useState(false);
  const advanceTimerRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const progressLabel = `Слово ${currentIndex + 1} из ${questions.length}`;
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(
    () => () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    },
    [],
  );

  const handleAnswer = (answer) => {
    if (status === 'success') return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      setStatus('success');
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }

      if (isLastQuestion) {
        setFinishedQuiz(true);
        return;
      }

      advanceTimerRef.current = window.setTimeout(() => {
        setCurrentIndex((value) => value + 1);
        setStatus('idle');
        setSelectedAnswer(null);
      }, 850);
      return;
    }

    setStatus('hint');
  };

  const handleNext = () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }

    setCurrentIndex((value) => value + 1);
    setStatus('idle');
    setSelectedAnswer(null);
  };

  const handleFinish = () => {
    finishGame('words', 10);
  };

  return (
    <section className="screen">
      <Mascot
        mood="thinking"
        size="small"
        speech="Три слова. По одному."
      />

      <Card className="stack words-hero-card">
        <span className="badge badge-muted">Казахские слова</span>
        <div className="words-progress-row">
          <span className="words-progress">{progressLabel}</span>
          <span className="words-progress words-progress--accent">3 слова</span>
        </div>
        <div className="words-question-card">
          <span className="words-question-card__hint" aria-hidden="true">
            {currentQuestion.hint}
          </span>
          <div className="words-question-card__body">
            <span className="words-question-card__label">Что значит слово</span>
            <h2 className="game-question">“{currentQuestion.kazakh}”</h2>
          </div>
        </div>
      </Card>

      <Card className="words-hint-card">
        <p className="words-hint-card__text">{currentQuestion.hintText}</p>
      </Card>

      <div className="game-options words-options">
        {currentQuestion.options.map((answer) => (
          <button
            key={answer}
            type="button"
            className={`answer-option words-answer-option ${
              selectedAnswer === answer && status === 'success' ? 'correct' : ''
            } ${selectedAnswer === answer && status === 'hint' ? 'soft-wrong' : ''}`}
            onClick={() => handleAnswer(answer)}
          >
            <span className="words-answer-option__text">{answer}</span>
          </button>
        ))}
      </div>

      {status === 'hint' && (
        <Card className="info-card words-hint-feedback">Подумай ещё раз.</Card>
      )}

      {status === 'success' && !finishedQuiz && (
        <Card className="success-card words-success-card">
          <h3>Дұрыс!</h3>
          <p>{isLastQuestion ? 'Ты выучил 3 слова на казахском!' : 'Отлично.'}</p>
        </Card>
      )}

      {status === 'success' && !finishedQuiz && !isLastQuestion && (
        <Button onClick={handleNext}>Дальше</Button>
      )}

      {finishedQuiz && (
        <>
          <Card className="success-card words-success-card">
            <h3>Ты выучил 3 слова на казахском!</h3>
            <p>КамБот гордится тобой.</p>
          </Card>
          <Button onClick={handleFinish}>Получить 10 ботакоинов</Button>
        </>
      )}

      {!finishedQuiz && (
        <Button variant="secondary" className="words-back-button" onClick={() => goToScreen('map')}>
          Назад на карту
        </Button>
      )}
    </section>
  );
}

export default WordsGame;
