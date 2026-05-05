import Header from './Header';

function AppShell({ currentScreen, onNavigate, appState, children }) {
  return (
    <div className="app-shell">
      <div className="app-bg-decoration" aria-hidden="true" />
      <Header currentScreen={currentScreen} onNavigate={onNavigate} appState={appState} />
      <main className="screen-content">{children}</main>
    </div>
  );
}

export default AppShell;
