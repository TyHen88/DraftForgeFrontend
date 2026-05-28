// Mirrors the backend `Mode` enum (prompt_builder.py). Only the writing tasks that make
// sense as one-shot Mini App actions are surfaced here.
export interface ModeOption {
  value: string
  label: string
  placeholder: string
}

export const MODES: ModeOption[] = [
  { value: 'email', label: 'Email', placeholder: 'What should the email say?' },
  { value: 'reply', label: 'Reply', placeholder: 'Paste the message you are replying to.' },
  { value: 'improve', label: 'Improve', placeholder: 'Paste text to make clearer.' },
  { value: 'rewrite', label: 'Rewrite', placeholder: 'Paste text to paraphrase.' },
  { value: 'grammar', label: 'Grammar', placeholder: 'Paste text to fix.' },
  { value: 'explain', label: 'Explain', placeholder: 'Enter a term, word, or phrase.' },
  { value: 'idea', label: 'Ideas', placeholder: 'What topic do you need ideas for?' },
]

export const TONES = [
  'professional',
  'friendly',
  'academic',
  'marketing',
  'storytelling',
] as const

// Matches the backend default `MAX_INPUT_CHARS`.
export const MAX_INPUT_CHARS = 8000
