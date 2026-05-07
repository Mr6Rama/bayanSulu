import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import Onboarding from './pages/Onboarding';
import MapPage from './pages/MapPage';
import RewardPage from './pages/RewardPage';
import BotaStudioPage from './pages/BotaStudioPage';
import ShopPage from './pages/ShopPage';
import ParentModePage from './pages/ParentModePage';
import MathGame from './pages/games/MathGame';
import MemoryGame from './pages/games/MemoryGame';
import WordsGame from './pages/games/WordsGame';
import { collectibleByGameId, learningReceiptByGameId } from './data/collectibles';
import {
  loadApprovedCoupons,
  loadAppState,
  loadRewardRequests,
  loadScreen,
  saveApprovedCoupons,
  saveAppState,
  saveRewardRequests,
  saveScreen,
} from './utils/storage';

const defaultAppState = {
  name: '',
  age: '',
  coins: 0,
  completedGames: [],
  unlockedCollectibles: [],
  purchasedRewards: [],
  rewardRequests: [],
  approvedCoupons: [],
  screenTimeMinutes: 18,
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
  const unlockedCollectibles = Array.isArray(state.unlockedCollectibles)
    ? [...new Set(state.unlockedCollectibles)]
    : [];
  const purchasedRewards = Array.isArray(state.purchasedRewards)
    ? [...new Set(state.purchasedRewards)]
    : [];
  const rewardRequests = Array.isArray(state.rewardRequests) ? state.rewardRequests : [];
  const approvedCoupons = Array.isArray(state.approvedCoupons) ? state.approvedCoupons : [];

  return {
    ...state,
    completedGames,
    unlockedCollectibles,
    purchasedRewards,
    rewardRequests,
    approvedCoupons,
    screenTimeMinutes: Number.isFinite(state.screenTimeMinutes) ? state.screenTimeMinutes : 18,
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
  const [appState, setAppState] = useState(() => {
    const storedState = normalizeAppState(loadAppState(defaultAppState));
    return {
      ...storedState,
      rewardRequests: storedState.rewardRequests.length
        ? storedState.rewardRequests
        : loadRewardRequests([]),
      approvedCoupons: storedState.approvedCoupons.length
        ? storedState.approvedCoupons
        : loadApprovedCoupons([]),
    };
  });
  const [studioHighlightId, setStudioHighlightId] = useState(null);
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
    saveRewardRequests(appState.rewardRequests);
  }, [appState.rewardRequests]);

  useEffect(() => {
    saveApprovedCoupons(appState.approvedCoupons);
  }, [appState.approvedCoupons]);

  useEffect(() => {
    saveScreen(currentScreen);
  }, [currentScreen]);

  const actions = useMemo(() => ({
    goToScreen: (screen, options = {}) => {
      if (options?.newlyUnlocked) {
        setStudioHighlightId(options.newlyUnlocked);
      }

      setCurrentScreen(screenAliases[screen] || screen);
    },
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
    requestFamilyBonus: (reward) => {
      let result = {
        status: 'blocked',
        reward,
        missing: [],
      };

      setAppState((prev) => {
        const completedGames = Array.isArray(prev.completedGames) ? prev.completedGames : [];
        const unlockedCollectibles = Array.isArray(prev.unlockedCollectibles)
          ? prev.unlockedCollectibles
          : [];
        const pendingRequest = prev.rewardRequests.find(
          (request) => request.rewardId === reward.id && request.status === 'pending',
        );
        const approvedRequest = prev.rewardRequests.find(
          (request) => request.rewardId === reward.id && request.status === 'approved',
        );
        const missing = [];

        if (prev.coins < reward.cost) {
          missing.push(`Нужно ещё ${reward.cost - prev.coins} ботакоинов`);
        }

        if (completedGames.length < reward.requiredGames) {
          missing.push(`Осталось пройти ${reward.requiredGames - completedGames.length} образовательную игру`);
        }

        if (unlockedCollectibles.length < reward.requiredCollectibles) {
          missing.push(`Открой ещё ${reward.requiredCollectibles - unlockedCollectibles.length} предмет в Bota Studio`);
        }

        if (prev.screenTimeMinutes > reward.screenTimeLimit) {
          missing.push(`Экранное время: ${prev.screenTimeMinutes}/${reward.screenTimeLimit} минут`);
        }

        if (pendingRequest) {
          result = {
            status: 'pending',
            reward,
            missing: [],
            message: 'Запрос уже отправлен родителю',
          };
          return prev;
        }

        if (approvedRequest) {
          result = {
            status: 'approved',
            reward,
            missing: [],
            message: 'Этот семейный бонус уже одобрен',
          };
          return prev;
        }

        if (missing.length > 0) {
          result = {
            status: 'blocked',
            reward,
            missing,
          };
          return prev;
        }

        const request = {
          id: `request-${reward.id}-${Date.now()}`,
          rewardId: reward.id,
          title: reward.title,
          cost: reward.cost,
          status: 'pending',
          createdAt: new Date().toISOString(),
          completedGames: completedGames.length,
          unlockedCollectibles: unlockedCollectibles.length,
          screenTimeMinutes: prev.screenTimeMinutes,
          requiredGames: reward.requiredGames,
          requiredCollectibles: reward.requiredCollectibles,
          screenTimeLimit: reward.screenTimeLimit,
        };

        result = {
          status: 'pending',
          reward,
          missing: [],
          message: 'Запрос отправлен родителю',
          request,
        };

        return {
          ...prev,
          rewardRequests: [request, ...prev.rewardRequests],
        };
      });

      return result;
    },
    approveRewardRequest: (requestId) => {
      let result = null;

      setAppState((prev) => {
        const request = prev.rewardRequests.find((item) => item.id === requestId);

        if (!request || request.status !== 'pending') {
          result = null;
          return prev;
        }

        const couponCode = `BOTA-BALANCE-${request.cost}`;
        const approvedAt = new Date().toISOString();
        const approvedCoupon = {
          requestId,
          rewardId: request.rewardId,
          title: request.title,
          couponCode,
          status: 'approved',
          approvedAt,
        };

        result = {
          requestId,
          couponCode,
          status: 'approved',
          approvedCoupon,
        };

        return {
          ...prev,
          rewardRequests: prev.rewardRequests.map((item) =>
            item.id === requestId
              ? { ...item, status: 'approved', couponCode, approvedAt }
              : item,
          ),
          approvedCoupons: [
            approvedCoupon,
            ...prev.approvedCoupons.filter((item) => item.requestId !== requestId),
          ],
        };
      });

      return result;
    },
    declineRewardRequest: (requestId) => {
      setAppState((prev) => ({
        ...prev,
        rewardRequests: prev.rewardRequests.map((item) =>
          item.id === requestId ? { ...item, status: 'declined', declinedAt: new Date().toISOString() } : item,
        ),
      }));
    },
    finishGame: (gameId, coinsAmount) => {
      setAppState((prev) => {
        const alreadyCompleted = prev.completedGames.includes(gameId);
        const collectible = collectibleByGameId[gameId] || null;
        const alreadyUnlocked = collectible ? prev.unlockedCollectibles.includes(collectible.id) : false;
        const nextCompletedGames = alreadyCompleted
          ? prev.completedGames
          : [...prev.completedGames, gameId];
        const nextUnlockedCollectibles = collectible && !alreadyUnlocked
          ? [...new Set([...prev.unlockedCollectibles, collectible.id])]
          : prev.unlockedCollectibles;
        const rewardCoins = alreadyCompleted ? 0 : coinsAmount;
        const learningReceipt = {
          ...learningReceiptByGameId[gameId],
          collectibleId: collectible?.id || null,
          collectibleTitle: collectible?.title || null,
          collectibleIcon: collectible?.icon || null,
          collectibleLearning: collectible?.learning || null,
        };

        return {
          ...prev,
          coins: prev.coins + rewardCoins,
          completedGames: nextCompletedGames,
          unlockedCollectibles: nextUnlockedCollectibles,
          lastReward: {
            gameId,
          coins: rewardCoins,
          alreadyReceived: alreadyCompleted,
          badge: getBadge(nextCompletedGames, gameId),
          message: alreadyCompleted
            ? 'Награда уже получена'
            : `Ты получил ${coinsAmount} ботакоинов!`,
          collectibleId: collectible?.id || null,
          collectibleTitle: collectible?.title || null,
          collectibleIcon: collectible?.icon || null,
          collectibleLearning: collectible?.learning || null,
          collectibleAlreadyUnlocked: alreadyUnlocked || alreadyCompleted,
          learningReceipt,
        },
        };
      });
      setCurrentScreen('reward');
    },
    resetProfile: () => {
      setAppState(defaultAppState);
      setStudioHighlightId(null);
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
      {currentScreen === 'studio' && <BotaStudioPage {...screenProps} newlyUnlockedId={studioHighlightId} />}
      {currentScreen === 'shop' && <ShopPage {...screenProps} />}
      {currentScreen === 'parent' && <ParentModePage {...screenProps} />}
      {currentScreen === 'math' && <MathGame {...screenProps} />}
      {currentScreen === 'memory' && <MemoryGame {...screenProps} />}
      {currentScreen === 'words' && <WordsGame {...screenProps} />}
    </AppShell>
  );
}

export default App;
