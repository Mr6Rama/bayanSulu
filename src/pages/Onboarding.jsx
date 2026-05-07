import React from 'react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

const ages = ['7', '8', '9', '10', '11'];

function Onboarding({ completeOnboarding }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('7');

  const handleSubmit = (event) => {
    event.preventDefault();

    completeOnboarding({
      name: name.trim() || 'Дос',
      age,
    });
  };

  return (
    <section className="screen onboarding-screen">
      <Mascot
        mood="main"
        size="large"
        speech="Привет! Я КамБот. Давай отправимся в путешествие по Казахстану?"
      />

      <form className="stack" onSubmit={handleSubmit}>
        <Card className="stack">
          <h2 className="section-title">Твоё путешествие начинается</h2>
          <p className="muted">Выбери имя и возраст, чтобы КамБот запомнил твой прогресс.</p>
        </Card>

        <label>
          <span className="field-label">Имя</span>
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Например, Алия"
          />
        </label>

        <div>
          <span className="field-label">Возраст</span>
          <div className="age-grid">
            {ages.map((item) => (
              <button
                key={item}
                type="button"
                className={`age-chip ${age === item ? 'active' : ''}`}
                onClick={() => setAge(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit">Начать путешествие</Button>
      </form>

      <div className="ornament-strip" aria-hidden="true">
        <span>◆</span>
        <span>●</span>
        <span>◆</span>
        <span>●</span>
        <span>◆</span>
      </div>
    </section>
  );
}

export default Onboarding;
