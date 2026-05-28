import { type ChangeEvent, useCallback, useMemo, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import {
  AppRoot,
  Banner,
  Button,
  Caption,
  Section,
  Select,
  Spinner,
  Textarea,
} from '@telegram-apps/telegram-ui'

import { ApiError, generate } from './api'
import { MAX_INPUT_CHARS, MODES, TONES } from './config'
import { getInitData, insideTelegram, useAppearance } from './telegram'
import { useMainButton } from './useMainButton'

export default function App() {
  const appearance = useAppearance()
  const inTelegram = insideTelegram()

  const [mode, setMode] = useState(MODES[0].value)
  const [tone, setTone] = useState<string>(TONES[0])
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const placeholder = useMemo(
    () => MODES.find((m) => m.value === mode)?.placeholder ?? 'Enter your text.',
    [mode],
  )

  const mutation = useMutation({
    mutationFn: () => {
      const initData = getInitData()
      if (!initData) {
        throw new ApiError(401, 'Open this app from the Telegram bot to generate.')
      }
      return generate({ mode, text: text.trim(), tone }, initData)
    },
  })

  const tooLong = text.length > MAX_INPUT_CHARS
  const canSubmit = text.trim().length > 0 && !tooLong && !mutation.isPending

  const submit = useCallback(() => {
    if (text.trim().length === 0 || text.length > MAX_INPUT_CHARS) return
    setCopied(false)
    mutation.mutate()
  }, [mutation, text])

  const mainButtonAvailable = useMainButton({
    text: 'Generate',
    visible: true,
    enabled: canSubmit,
    loading: mutation.isPending,
    onClick: submit,
  })

  const copy = useCallback(async () => {
    if (!mutation.data) return
    try {
      await navigator.clipboard.writeText(mutation.data.result)
      setCopied(true)
    } catch {
      /* clipboard unavailable */
    }
  }, [mutation.data])

  return (
    <AppRoot appearance={appearance}>
      <div style={{ padding: '16px 0 32px' }}>
        <Section header="Writer AI" footer="AI writing assistant">
          <Select
            header="Mode"
            value={mode}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>

          <Select
            header="Tone"
            value={tone}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Textarea
            header="Your text"
            placeholder={placeholder}
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            status={tooLong ? 'error' : 'default'}
          />
          <div style={{ padding: '4px 22px 0' }}>
            <Caption
              level="1"
              style={{ color: tooLong ? 'var(--tgui--destructive_text_color)' : undefined }}
            >
              {text.length} / {MAX_INPUT_CHARS}
            </Caption>
          </div>
        </Section>

        {!inTelegram && (
          <Banner
            type="section"
            header="Outside Telegram"
            description="Open this app from the Telegram bot to generate — it needs Telegram to sign you in."
          />
        )}

        {!mainButtonAvailable && (
          <div style={{ padding: '0 16px' }}>
            <Button
              size="l"
              stretched
              disabled={!canSubmit}
              loading={mutation.isPending}
              onClick={submit}
            >
              Generate
            </Button>
          </div>
        )}

        {mutation.isError && (
          <Banner
            type="section"
            header="Could not generate"
            description={(mutation.error as ApiError).message}
          />
        )}

        {mutation.isPending && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Spinner size="m" />
          </div>
        )}

        {mutation.data && !mutation.isPending && (
          <Section header="Result">
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '12px 22px',
              }}
            >
              {mutation.data.result}
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
              <Button size="m" mode="bezeled" stretched onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                size="m"
                mode="bezeled"
                stretched
                onClick={submit}
                disabled={!canSubmit}
              >
                Regenerate
              </Button>
            </div>
          </Section>
        )}
      </div>
    </AppRoot>
  )
}
