const STATE_KEY = 'bayan-sulu-kids:state';
const SCREEN_KEY = 'bayan-sulu-kids:screen';

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function readString(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

function writeString(key, value) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, value);
}

export function loadAppState(fallback) {
  return readJson(STATE_KEY, fallback);
}

export function saveAppState(state) {
  writeJson(STATE_KEY, state);
}

export function loadScreen(fallback) {
  return readString(SCREEN_KEY, fallback);
}

export function saveScreen(screen) {
  writeString(SCREEN_KEY, screen);
}
