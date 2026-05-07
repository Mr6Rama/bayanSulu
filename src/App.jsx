import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import Onboarding from './pages/Onboarding';
import MapPage from './pages/MapPage';
import RewardPage from './pages/RewardPage';
import ShopPage from './pages/ShopPage';
import ParentModePage from './pages/ParentModePage';
import MathGame from './pages/games/MathGame';
import MemoryGame from './pages/games/MemoryGame';
import WordsGame from './pages/games/WordsGame';
import { loadAppState, loadScreen, saveAppState, saveScreen } from './utils/storage';

const defaultAppState = {
  name: '',
  age: '',
  coins: 0,
  completedGames: [],
  purchasedRewards: [],
  lastReward: null,
};

const screenAliases = {
  mathGame: 'math',
  memoryGame: 'memory',
  wordsGame: 'words',
};

const badgeByGame = {
  memory: 'Мастер памяти',
  math: 'Юный математик',
  words: 'Знаток казахских слов',
};

const allGameIds = ['math', 'memory', 'words'];

function normalizeAppState(state) {
  const completedGames = Array.isArray(state.completedGames) ? [...new Set(state.completedGames)] : [];
  const purchasedRewards = Array.isArray(state.purchasedRewards)
    ? [...new Set(state.purchasedRewards)]
    : [];

  return {
    ...state,
    completedGames,
    purchasedRewards,
    lastReward: typeof state.lastReward === 'object' ? state.lastReward : null,
  };
}

function getBadge(completedGames, gameId) {
  const normalizedGames = Array.isArray(completedGames) ? completedGames : [];

  if (allGameIds.every((id) => normalizedGames.includes(id))) {
    return 'Исследователь Казахстана';
  }

  return badgeByGame[gameId] || 'Исследователь Казахстана';
}

function App() {
  const [appState, setAppState] = useState(() => normalizeAppState(loadAppState(defaultAppState)));
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedScreen = screenAliases[loadScreen('onboarding')] || loadScreen('onboarding');
    const hasProfile = loadAppState(defaultAppState).name;

    if (hasProfile && savedScreen === 'onboarding') {
      return 'map';
    }

    return savedScreen;
  });

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    saveScreen(currentScreen);
  }, [currentScreen]);

  const actions = useMemo(() => ({
    goToScreen: (screen) => setCurrentScreen(screenAliases[screen] || screen),
    completeOnboarding: (values) => {
      setAppState((prev) => ({
        ...prev,
        name: values.name,
        age: values.age,
      }));
      setCurrentScreen('map');
    },
    addCoins: (amount) => {
      setAppState((prev) => ({
        ...prev,
        coins: Math.max(0, prev.coins + amount),
      }));
    },
    purchaseReward: (reward) => {
      let result = {
        status: 'not-enough',
        reward,
        missingCoins: reward.cost,
      };

      setAppState((prev) => {
        const alreadyPurchased = prev.purchasedRewards.includes(reward.id);
        const hasEnoughCoins = prev.coins >= reward.cost;

        if (!hasEnoughCoins) {
          result = {
            status: 'not-enough',
            reward,
            missingCoins: reward.cost - prev.coins,
          };
          return prev;
        }

        if (alreadyPurchased) {
          result = {
            status: 'already-owned',
            reward,
            missingCoins: 0,
          };
          return prev;
        }

        result = {
          status: 'purchased',
          reward,
          missingCoins: 0,
        };

        return {
          ...prev,
          coins: prev.coins - reward.cost,
          purchasedRewards: [...prev.purchasedRewards, reward.id],
        };
      });

      return result;
    },
    finishGame: (gameId, coinsAmount) => {
      setAppState((prev) => ({
        ...prev,
        coins: prev.completedGames.includes(gameId) ? prev.coins : prev.coins + coinsAmount,
        completedGames: prev.completedGames.includes(gameId)
          ? prev.completedGames
          : [...prev.completedGames, gameId],
        lastReward: {
          gameId,
          coins: prev.completedGames.includes(gameId) ? 0 : coinsAmount,
          alreadyReceived: prev.completedGames.includes(gameId),
          badge: getBadge(
            prev.completedGames.includes(gameId)
              ? prev.completedGames
              : [...prev.completedGames, gameId],
            gameId,
          ),
          message: prev.completedGames.includes(gameId)
            ? 'Награда уже получена'
            : `Ты получил ${coinsAmount} ботакоинов!`,
        },
      }));
      setCurrentScreen('reward');
    },
    resetProfile: () => {
      setAppState(defaultAppState);
      setCurrentScreen('onboarding');
    },
  }), []);

  const screenProps = {
    appState,
    currentScreen,
    ...actions,
  };

  return (
    <AppShell currentScreen={currentScreen} onNavigate={actions.goToScreen} appState={appState}>
      {currentScreen === 'onboarding' && <Onboarding {...screenProps} />}
      {currentScreen === 'map' && <MapPage {...screenProps} />}
      {currentScreen === 'reward' && <RewardPage {...screenProps} />}
      {currentScreen === 'shop' && <ShopPage {...screenProps} />}
      {currentScreen === 'parent' && <ParentModePage {...screenProps} />}
      {currentScreen === 'math' && <MathGame {...screenProps} />}
      {currentScreen === 'memory' && <MemoryGame {...screenProps} />}
      {currentScreen === 'words' && <WordsGame {...screenProps} />}
    </AppShell>
  );
}

export default App;
