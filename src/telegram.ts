import {
  init,
  isTMA,
  miniApp,
  retrieveRawInitData,
  themeParams,
  useSignal,
  viewport,
} from '@telegram-apps/sdk-react'

let started = false

/**
 * Initialize the Telegram Mini App SDK. No-op (returns false) when not running inside
 * Telegram — e.g. a plain browser during local dev — so the app still renders.
 */
export function initTelegram(): boolean {
  if (started) return insideTelegram()
  started = true

  if (!insideTelegram()) return false

  init()

  // Each mount/bind is guarded: an unsupported client shouldn't crash the app.
  try {
    themeParams.mountSync()
    themeParams.bindCssVars()
  } catch {
    /* ignore */
  }
  try {
    miniApp.mountSync()
    miniApp.bindCssVars()
  } catch {
    /* ignore */
  }
  try {
    void viewport.mount()
  } catch {
    /* ignore */
  }
  try {
    miniApp.ready()
  } catch {
    /* ignore */
  }
  return true
}

export function insideTelegram(): boolean {
  try {
    return isTMA()
  } catch {
    return false
  }
}

/** Raw initData string for the `Authorization: tma <initData>` header, or undefined. */
export function getInitData(): string | undefined {
  try {
    return retrieveRawInitData()
  } catch {
    return undefined
  }
}

/** Reactive appearance derived from the Telegram theme (defaults to light outside TG). */
export function useAppearance(): 'light' | 'dark' {
  const dark = useSignal(miniApp.isDark)
  return dark ? 'dark' : 'light'
}
