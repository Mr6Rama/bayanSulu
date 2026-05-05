import Button from '../components/Button';

function RewardPage({ appState, goToScreen }) {
  return (
    <section className="stack">
      <div className="card stack">
        <div className="pill">🎁 Последняя награда</div>
        <h2 className="section-title">{appState.lastReward || 'Пока награда не выбрана'}</h2>
        <p className="muted">
          Здесь будет показываться последняя полученная награда и статус прогресса.
        </p>
      </div>

      <div className="card stack">
        <h3 className="section-title">Прогресс</h3>
        <div className="stats">
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

      <Button variant="secondary" onClick={() => goToScreen('shop')}>
        Перейти в магазин
      </Button>
    </section>
  );
}

export default RewardPage;
