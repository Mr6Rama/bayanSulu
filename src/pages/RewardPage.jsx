import Button from '../components/Button';
import { locations } from '../data/locations';

function RewardPage({ appState, goToScreen }) {
  const lastReward = appState.lastReward;
  const rewardLocation = lastReward
    ? locations.find((location) => location.id === lastReward.gameId)
    : null;

  return (
    <section className="stack">
      <div className="card stack reward-card">
        <div className="pill">🎁 Последняя награда</div>
        <h2 className="reward-title">Жарайсың!</h2>
        <p className="muted">
          {lastReward
            ? `${rewardLocation?.game || 'Игра завершена'}: ${lastReward.message}`
            : 'Пройди первую игру, чтобы получить ботакоины.'}
        </p>
      </div>

      <div className="card stack">
        <h3 className="section-title">Баланс наград</h3>
        <div className="stats">
          <div className="stat">
            <span className="stat__value">+{lastReward?.coins || 0}</span>
            <span className="stat__label">получено сейчас</span>
          </div>
          <div className="stat">
            <span className="stat__value">{appState.coins}</span>
            <span className="stat__label">общий баланс</span>
          </div>
        </div>
      </div>

      <Button onClick={() => goToScreen('map')}>
        Вернуться на карту
      </Button>
      <Button variant="secondary" onClick={() => goToScreen('shop')}>
        Открыть магазин
      </Button>
    </section>
  );
}

export default RewardPage;
