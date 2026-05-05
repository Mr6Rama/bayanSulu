import { useState } from 'react';
import Button from '../components/Button';

function Onboarding({ completeOnboarding }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

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
      <div className="hero card">
        <div className="hero__badge pill">Добро пожаловать</div>
        <h2 className="section-title">Начнём игру с уютного знакомства</h2>
        <p className="muted">
          Мы сохраним имя, возраст и прогресс в этом устройстве, чтобы приложение
          было быстрым и простым.
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

        <label>
          <span className="field-label">Возраст</span>
          <input
            className="input"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            inputMode="numeric"
            placeholder="Например, 7"
          />
        </label>

        <Button type="submit">Продолжить</Button>
      </form>
    </section>
  );
}

export default Onboarding;
