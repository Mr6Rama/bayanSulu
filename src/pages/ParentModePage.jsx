import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import ProgressBar from '../components/ProgressBar';
import { locations } from '../data/locations';
import { learningUnits } from '../data/learningUnits';
import { rewards } from '../data/rewards';

const badgeLabels = {
  memory: 'Мастер памяти',
  math: 'Юный математик',
  words: 'Знаток казахских слов',
};

const allGameIds = ['math', 'memory', 'words'];

function ParentModePage({ appState, resetProfile, goToScreen }) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const hasAllGames = allGameIds.every((gameId) => appState.completedGames.includes(gameId));
  const badges = [
    ...appState.completedGames.map((gameId) => badgeLabels[gameId]).filter(Boolean),
    ...(hasAllGames ? ['Исследователь Казахстана'] : []),
  ];
  const purchasedCoupons = rewards.filter((reward) => appState.purchasedRewards.includes(reward.id));

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
          <span className="badge badge-muted">Родительский доступ</span>
          <h2 className="section-title">Введите PIN</h2>
          <input
            className="input pin-input"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            inputMode="numeric"
            maxLength="4"
            placeholder="PIN"
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
          <div className="stat">
            <span className="stat__value">{Math.min(appState.completedGames.length, learningUnits.length)}/{learningUnits.length}</span>
            <span className="stat__label">фактов изучено</span>
          </div>
          <div className="stat">
            <span className="stat__value">18/30</span>
            <span className="stat__label">минут сегодня</span>
          </div>
        </div>
        <ProgressBar
          value={appState.completedGames.length}
          max={locations.length}
          label={`Пройдено игр ${appState.completedGames.length} из ${locations.length}`}
        />
      </Card>

      <Card className="stack">
        <h3 className="section-title">Навыки и бейджи</h3>
        <div className="pill-row">
          <span className="pill">⏱️ 30 минут в день</span>
          <span className="pill">🧠 память</span>
          <span className="pill">➕ счёт</span>
          <span className="pill">🇰🇿 казахский язык</span>
          <span className="pill">🗺️ знания о Казахстане</span>
          {badges.map((badge) => (
            <span key={badge} className="pill">🏅 {badge}</span>
          ))}
        </div>
      </Card>

      <Card className="info-card">
        Ботакоины выдаются только за образовательные задания, не за время в приложении.
      </Card>

      <Card className="stack">
        <h3 className="section-title">Что ребёнок изучает</h3>
        <div className="stack">
          {learningUnits.map((unit) => (
            <div key={unit.id} className="learning-unit">
              <strong>{unit.title}</strong>
              <span className="muted">{unit.category}</span>
              <p className="muted">{unit.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="stack">
        <h3 className="section-title">Купоны и бонусы</h3>
        {purchasedCoupons.length > 0 ? (
          <div className="stack">
            {purchasedCoupons.map((reward) => (
              <div key={reward.id} className="learning-unit">
                <strong>{reward.title}</strong>
                <span className="muted">Демо-код: BOTA-{reward.id.toUpperCase()}</span>
                <p className="muted">Купон активирует родитель.</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Купонов пока нет. Они появятся после обмена ботакоинов в магазине.</p>
        )}
      </Card>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться к карте
      </Button>
      <Button onClick={resetProfile}>Сбросить профиль</Button>
    </section>
  );
}

export default ParentModePage;
