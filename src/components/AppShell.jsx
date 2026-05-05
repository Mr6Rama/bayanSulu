import Header from './Header';

function AppShell({ currentScreen, onNavigate, appState, children }) {
  return (
    <div className="app-frame">
      <div className="app-phone">
        <div className="app-page">
          <Header currentScreen={currentScreen} onNavigate={onNavigate} appState={appState} />
          <main className="app-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
