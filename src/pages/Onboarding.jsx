import { useState } from 'react';
import Button from '../components/Button';

const ages = ['7', '8', '9', '10', '11'];

function Onboarding({ completeOnboarding }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('7');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !age) {
      alert('Пожалуйста, укажи имя и возраст.');
      return;
    }

    completeOnboarding({
      name: name.trim(),
      age,
    });
  };

  return (
    <section className="stack">
      <div className="hero card onboarding-hero">
        <div className="kambot-avatar">🤖</div>
        <div className="hero__badge pill">КамБот рядом</div>
        <h2 className="section-title">Сәлем! Я КамБот.</h2>
        <p className="muted">
          Давай отправимся по городам Казахстана, будем играть, учиться и собирать
          ботакоины.
        </p>
      </div>

      <form className="card stack" onSubmit={handleSubmit}>
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
                className={`age-button ${age === item ? 'age-button--active' : ''}`}
                onClick={() => setAge(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit">Начать путешествие</Button>
      </form>
    </section>
  );
}

export default Onboarding;
