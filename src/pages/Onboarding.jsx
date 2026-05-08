import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';

const ages = ['7', '8', '9', '10', '11'];
const languages = ['Қазақша', 'Русский'];

function Onboarding({ completeOnboarding }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('7');
  const [language, setLanguage] = useState('Русский');

  const handleSubmit = (event) => {
    event.preventDefault();

    completeOnboarding({
      name: name.trim() || 'Дос',
      age,
    });
  };

  return (
    <section className="screen onboarding-screen">
      <div className="onboarding-scene" aria-hidden="true">
        <span className="onboarding-sun" />
        <span className="onboarding-cloud onboarding-cloud--1" />
        <span className="onboarding-cloud onboarding-cloud--2" />
        <span className="onboarding-hill onboarding-hill--back" />
        <span className="onboarding-hill onboarding-hill--front" />
      </div>

      <Card className="stack onboarding-hero">
        <div className="onboarding-hero__copy">
          <span className="badge badge-muted">Kazakhstan Adventure</span>
          <h2 className="hero-title">Сәлем! Я КамБот.</h2>
          <p className="muted">Пойдём в путешествие по Казахстану?</p>
        </div>

        <Mascot
          mood="main"
          size="large"
          speech="Выбирай имя и возраст — и поехали!"
        />

        <div className="onboarding-lang-toggle" role="group" aria-label="Выбор языка">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              className={`onboarding-lang-toggle__btn ${language === item ? 'active' : ''}`}
              onClick={() => setLanguage(item)}
              aria-pressed={language === item}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      <form className="stack" onSubmit={handleSubmit}>
        <Card className="stack onboarding-form-card">
          <label className="onboarding-field">
            <span className="field-label">Имя</span>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Например, Алия"
              aria-label="Имя ребёнка"
            />
          </label>

          <div>
            <span className="field-label">Возраст</span>
            <div className="age-grid onboarding-age-grid">
              {ages.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`age-chip ${age === item ? 'active' : ''}`}
                  onClick={() => setAge(item)}
                  aria-pressed={age === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Button type="submit">В путь!</Button>
      </form>
    </section>
  );
}

export default Onboarding;
