import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import Onboarding from './pages/Onboarding';
import MapPage from './pages/MapPage';
import RewardPage from './pages/RewardPage';
import ShopPage from './pages/ShopPage';
import ParentModePage from './pages/ParentModePage';
import { loadAppState, loadScreen, saveAppState, saveScreen } from './utils/storage';

const defaultAppState = {
  name: '',
  age: '',
  coins: 0,
  completedGames: 0,
  lastReward: '',
};

function App() {
  const [appState, setAppState] = useState(() => loadAppState(defaultAppState));
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedScreen = loadScreen('onboarding');
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
    goToScreen: setCurrentScreen,
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
    setLastReward: (reward) => {
      setAppState((prev) => ({
        ...prev,
        lastReward: reward,
      }));
    },
    incrementCompletedGames: () => {
      setAppState((prev) => ({
        ...prev,
        completedGames: prev.completedGames + 1,
      }));
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
    </AppShell>
  );
}

export default App;
