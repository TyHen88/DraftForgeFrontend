import { useCallback, useMemo, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { ApiError, generate } from './api'
import { MAX_INPUT_CHARS, TONES, TOOLS } from './config'
import { getInitData, insideTelegram, tapHaptic, useAppearance } from './telegram'

export default function App() {
  const appearance = useAppearance()
  const inTelegram = insideTelegram()

  const [toolId, setToolId] = useState(TOOLS[0].id)
  const [tone, setTone] = useState(TONES[0].value)
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const current = useMemo(
    () => TOOLS.find((t) => t.id === toolId) ?? TOOLS[0],
    [toolId],
  )

  const mutation = useMutation({
    mutationFn: () => {
      const initData = getInitData()
      if (!initData) {
        throw new ApiError(401, 'Open this app from the Telegram bot to generate.')
      }
      return generate(
        { mode: current.mode, text: text.trim(), tone, template: current.template },
        initData,
      )
    },
  })

  const len = text.length
  const tooLong = len > MAX_INPUT_CHARS
  const pct = Math.min(100, (len / MAX_INPUT_CHARS) * 100)
  const canSubmit = text.trim().length > 0 && !tooLong && !mutation.isPending

  const meterClass = tooLong ? 'over' : pct > 85 ? 'warn' : ''

  const submit = useCallback(() => {
    if (text.trim().length === 0 || text.length > MAX_INPUT_CHARS) return
    tapHaptic('medium')
    setCopied(false)
    mutation.mutate()
  }, [mutation, text])

  const pick = useCallback((setter: (v: string) => void, value: string) => {
    tapHaptic('light')
    setter(value)
  }, [])

  const copy = useCallback(async () => {
    if (!mutation.data) return
    try {
      await navigator.clipboard.writeText(mutation.data.result)
      tapHaptic('light')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }, [mutation.data])

  return (
    <div className="app" data-appearance={appearance}>
      <div className="blobs" aria-hidden>
        <span />
        <span />
      </div>

      <div className="shell">
        <header className="hero">
          <div className="logo" aria-hidden>
            ⚡
          </div>
          <div>
            <h1>
              DraftForge<span> AI</span>
            </h1>
            <p>Craft anything, beautifully.</p>
          </div>
        </header>

        <nav className="chip-row" aria-label="Tool">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip${t.id === toolId ? ' is-active' : ''}`}
              aria-pressed={t.id === toolId}
              onClick={() => pick(setToolId, t.id)}
            >
              <span className="emoji" aria-hidden>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </nav>

        <section className="card">
          <label className="field-label" htmlFor="text">
            {current.label} · your text
          </label>
          <textarea
            id="text"
            className="input"
            placeholder={current.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="meter" aria-hidden>
            <div className={`meter-fill ${meterClass}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="meter-row">
            <span className={`count${tooLong ? ' over' : ''}`}>
              {len.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}
            </span>
          </div>

          <div className="tone-block">
            <label className="field-label">Tone</label>
            <div className="chip-row" aria-label="Tone">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`chip tone${t.value === tone ? ' is-active' : ''}`}
                  aria-pressed={t.value === tone}
                  onClick={() => pick(setTone, t.value)}
                >
                  <span className="emoji" aria-hidden>
                    {t.icon}
                  </span>
                  {t.value}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button type="button" className="cta" disabled={!canSubmit} onClick={submit}>
          {mutation.isPending ? (
            <span className="label">
              <span className="spinner" /> Generating…
            </span>
          ) : (
            <span className="label">✨ Generate</span>
          )}
        </button>

        {mutation.isError && (
          <div className="alert" role="alert">
            <span className="alert-icon" aria-hidden>
              ⚠️
            </span>
            <span>
              <b>Couldn’t generate</b>
              {(mutation.error as ApiError).message}
            </span>
          </div>
        )}

        {mutation.data && !mutation.isPending && (
          <section className="card result">
            <div className="result-head">
              <span className="tag">{mutation.data.mode}</span>
              <span className="tag ghost">{mutation.data.tone}</span>
            </div>
            <div className="result-text">{mutation.data.result}</div>
            <div className="result-actions">
              <button
                type="button"
                className={`btn${copied ? ' done' : ''}`}
                onClick={copy}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button type="button" className="btn" disabled={!canSubmit} onClick={submit}>
                ↻ Regenerate
              </button>
            </div>
          </section>
        )}

        {!inTelegram && (
          <p className="hint">Open this app from the Telegram bot to start generating.</p>
        )}
      </div>
    </div>
  )
}
