import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import { locations } from '../data/locations';

function RewardPage({ appState, goToScreen }) {
  const lastReward = appState.lastReward;
  const rewardLocation = lastReward
    ? locations.find((location) => location.id === lastReward.gameId)
    : null;

  return (
    <section className="screen reward-screen">
      <Mascot
        mood="happy"
        size="large"
        speech="Жарайсың! Ты отлично справился!"
      />

      <Card className="reward-card">
        <div className="coin-burst" aria-hidden="true">
          <span>🪙</span>
          <span>✨</span>
          <span>🪙</span>
        </div>
        <h2 className="reward-title">Жарайсың!</h2>
        {lastReward ? (
          <>
            <p className="reward-subtitle">{rewardLocation?.subtitle || 'Игра завершена'}</p>
            <div className="reward-coin">+{lastReward.coins} ботакоинов</div>
            <p className="muted">Всего: {appState.coins} ботакоинов</p>
          </>
        ) : (
          <>
            <p className="muted">Пройди первую игру, чтобы получить ботакоины.</p>
            <p className="muted">Всего: {appState.coins} ботакоинов</p>
          </>
        )}
      </Card>

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
