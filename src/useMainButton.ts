import { useEffect } from 'react'

import { mainButton } from '@telegram-apps/sdk-react'

interface MainButtonParams {
  text: string
  visible: boolean
  enabled: boolean
  loading: boolean
  onClick: () => void
}

/**
 * Drive Telegram's native MainButton. Returns whether it is available — when false (e.g.
 * outside Telegram), render your own button instead.
 */
export function useMainButton({
  text,
  visible,
  enabled,
  loading,
  onClick,
}: MainButtonParams): boolean {
  const available = mainButton.mount.isAvailable()

  useEffect(() => {
    if (!available) return
    mainButton.mount()
    return () => {
      try {
        mainButton.unmount()
      } catch {
        /* ignore */
      }
    }
  }, [available])

  useEffect(() => {
    if (!available || !mainButton.setParams.isAvailable()) return
    mainButton.setParams({
      text,
      isVisible: visible,
      isEnabled: enabled,
      isLoaderVisible: loading,
    })
  }, [available, text, visible, enabled, loading])

  useEffect(() => {
    if (!available || !mainButton.onClick.isAvailable()) return
    return mainButton.onClick(onClick)
  }, [available, onClick])

  return available
}
