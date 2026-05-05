import { useState } from 'react';
import Button from '../components/Button';

function ParentModePage({ appState, resetProfile, goToScreen }) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin === '1234') {
      setIsUnlocked(true);
      setError('');
      return;
    }

    setError('Неверный PIN');
  };

  if (!isUnlocked) {
    return (
      <section className="stack">
        <form className="card stack" onSubmit={handleSubmit}>
          <div className="pill">🔒 Режим для родителей</div>
          <h2 className="section-title">Введите PIN</h2>
          <input
            className="input pin-input"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            inputMode="numeric"
            maxLength="4"
            placeholder="1234"
          />
          {error && <div className="game-message game-message--hint">{error}</div>}
          <Button type="submit">Открыть</Button>
        </form>

        <Button variant="secondary" onClick={() => goToScreen('map')}>
          Вернуться к карте
        </Button>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill">🔒 Режим для родителей</div>
        <h2 className="section-title">Данные профиля</h2>
        <div className="stats">
          <div className="stat">
            <span className="stat__value">{appState.name || '—'}</span>
            <span className="stat__label">имя</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.age || '—'}</span>
            <span className="stat__label">возраст</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">монет</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.completedGames.length}</span>
            <span className="stat__label">игр завершено</span>
          </div>
        </div>
      </div>

      <div className="card stack">
        <h3 className="section-title">Настройки MVP</h3>
        <div className="pill-row">
          <span className="pill">⏱️ 30 минут в день</span>
          <span className="pill">➕ счёт</span>
          <span className="pill">🧠 память</span>
          <span className="pill">🇰🇿 казахский язык</span>
        </div>
      </div>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться к карте
      </Button>
      <Button onClick={resetProfile}>Сбросить профиль</Button>
    </section>
  );
}

export default ParentModePage;
