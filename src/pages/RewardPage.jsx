import Button from '../components/Button';
import Card from '../components/Card';
import Mascot from '../components/Mascot';
import { locations } from '../data/locations';
import { learningUnits } from '../data/learningUnits';

const badgeLabels = {
  memory: 'Мастер памяти',
  math: 'Юный математик',
  words: 'Знаток казахских слов',
};

const allGameIds = ['math', 'memory', 'words'];
const rewardLearningMap = {
  math: ['astana', 'yurt'],
  memory: ['charyn', 'apple'],
  words: ['camel', 'apple'],
};

function RewardPage({ appState, goToScreen }) {
  const lastReward = appState.lastReward;
  const rewardLocation = lastReward
    ? locations.find((location) => location.id === lastReward.gameId)
    : null;
  const hasAllGames = allGameIds.every((gameId) => appState.completedGames.includes(gameId));
  const badge = hasAllGames
    ? 'Исследователь Казахстана'
    : badgeLabels[lastReward?.gameId] || 'Исследователь Казахстана';
  const learningIds = rewardLearningMap[lastReward?.gameId] || [];
  const rewardLearningUnits = learningUnits.filter((unit) => learningIds.includes(unit.id));

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
            <span className="badge badge-success">{badge}</span>
            <div className="reward-coin">
              {lastReward.alreadyReceived ? 'Награда уже получена' : `+${lastReward.coins} ботакоинов`}
            </div>
            <p className="muted">
              {lastReward.alreadyReceived
                ? `Эта игра уже завершена. Всего: ${appState.coins} ботакоинов`
                : `Всего: ${appState.coins} ботакоинов`}
            </p>
          </>
        ) : (
          <>
            <p className="muted">Пройди первую игру, чтобы получить ботакоины.</p>
            <p className="muted">Всего: {appState.coins} ботакоинов</p>
          </>
        )}
      </Card>

      {lastReward && rewardLearningUnits.length > 0 && (
        <Card className="stack">
          <h3 className="section-title">Что ребёнок изучает</h3>
          <div className="stack">
            {rewardLearningUnits.map((unit) => (
              <div key={unit.id} className="learning-unit">
                <strong>{unit.title}</strong>
                <p className="muted">{unit.note}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

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
