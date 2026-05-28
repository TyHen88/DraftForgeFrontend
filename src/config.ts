// Mirrors the backend `Mode` enum (prompt_builder.py). Only the writing tasks that make
// sense as one-shot Mini App actions are surfaced here.
export interface ModeOption {
  value: string
  label: string
  icon: string
  placeholder: string
}

export const MODES: ModeOption[] = [
  { value: 'email', label: 'Email', icon: '✉️', placeholder: 'What should the email say?' },
  { value: 'reply', label: 'Reply', icon: '💬', placeholder: 'Paste the message you are replying to…' },
  { value: 'improve', label: 'Improve', icon: '✨', placeholder: 'Paste text to make clearer…' },
  { value: 'rewrite', label: 'Rewrite', icon: '🔁', placeholder: 'Paste text to paraphrase…' },
  { value: 'grammar', label: 'Grammar', icon: '✅', placeholder: 'Paste text to fix…' },
  { value: 'explain', label: 'Explain', icon: '💡', placeholder: 'Enter a term, word, or phrase…' },
  { value: 'idea', label: 'Ideas', icon: '🧠', placeholder: 'What topic do you need ideas for?' },
]

export interface ToneOption {
  value: string
  icon: string
}

export const TONES: ToneOption[] = [
  { value: 'professional', icon: '💼' },
  { value: 'friendly', icon: '😊' },
  { value: 'academic', icon: '🎓' },
  { value: 'marketing', icon: '📣' },
  { value: 'storytelling', icon: '📖' },
]

// Matches the backend default `MAX_INPUT_CHARS`.
export const MAX_INPUT_CHARS = 8000
