import Button from '../components/Button';

function ParentModePage({ appState, resetProfile, goToScreen }) {
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
            <span className="stat__value">{appState.completedGames}</span>
            <span className="stat__label">игр завершено</span>
          </div>
        </div>
      </div>

      <div className="empty-state">
        <p className="muted">
          Здесь позже появятся родительские настройки, статистика и управление
          прогрессом.
        </p>
      </div>

      <Button variant="secondary" onClick={() => goToScreen('map')}>
        Вернуться к карте
      </Button>
      <Button onClick={resetProfile}>Сбросить профиль</Button>
    </section>
  );
}

export default ParentModePage;
