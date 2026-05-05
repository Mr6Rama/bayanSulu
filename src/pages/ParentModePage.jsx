import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { locations } from '../data/locations';

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
      <section className="screen">
        <Mascot
          mood="parent"
          size="medium"
          speech="Родительский режим защищён PIN-кодом."
        />

        <form className="stack" onSubmit={handleSubmit}>
          <Card className="stack">
          <span className="badge badge-muted">PIN: 1234</span>
          <h2 className="section-title">Введите PIN</h2>
          <input
            className="input pin-input"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            inputMode="numeric"
            maxLength="4"
            placeholder="1234"
          />
          {error && <div className="soft-error">{error}</div>}
          </Card>
          <Button type="submit">Войти</Button>
        </form>

        <Button variant="secondary" onClick={() => goToScreen('map')}>
          Вернуться к карте
        </Button>
      </section>
    );
  }

  return (
    <section className="screen">
      <Card className="stack">
        <h2 className="section-title">Прогресс ребёнка</h2>
        <div className="parent-stat-grid">
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
            <span className="stat__value">{appState.completedGames.length}/3</span>
            <span className="stat__label">игр пройдено</span>
          </div>
        </div>
        <ProgressBar
          value={appState.completedGames.length}
          max={locations.length}
          label={`Пройдено игр ${appState.completedGames.length} из ${locations.length}`}
        />
      </Card>

      <Card className="stack">
        <h3 className="section-title">Настройки MVP</h3>
        <div className="pill-row">
          <span className="pill">⏱️ 30 минут в день</span>
          <span className="pill">➕ счёт</span>
          <span className="pill">🧠 память</span>
          <span className="pill">🇰🇿 казахский язык</span>
        </div>
      </Card>

      <Card className="info-card">
        Ботакоины начисляются только за развивающие задания, а не за время в приложении.
      </Card>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться к карте
      </Button>
      <Button onClick={resetProfile}>Сбросить профиль</Button>
    </section>
  );
}

export default ParentModePage;
