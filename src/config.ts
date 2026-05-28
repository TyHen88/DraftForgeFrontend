// Mirrors the backend `Mode` enum (prompt_builder.py) and templates (templates.py) so the
// Mini App offers the same toolset as the bot. Each tool sends either a `mode` or, for
// templates, `mode: 'template'` + a `template` key (the API uses the template when present).
export interface Tool {
  id: string
  label: string
  icon: string
  placeholder: string
  mode: string
  template?: string
}

export const TOOLS: Tool[] = [
  // Write tasks
  { id: 'email', label: 'Email', icon: '✉️', mode: 'email', placeholder: 'What should the email say?' },
  { id: 'reply', label: 'Reply', icon: '💬', mode: 'reply', placeholder: "Paste the message you're replying to…" },
  { id: 'improve', label: 'Improve', icon: '✨', mode: 'improve', placeholder: 'Paste text to make clearer…' },
  { id: 'rewrite', label: 'Rewrite', icon: '🔁', mode: 'rewrite', placeholder: 'Paste text to paraphrase…' },
  { id: 'grammar', label: 'Grammar', icon: '✅', mode: 'grammar', placeholder: 'Paste text to fix…' },
  { id: 'explain', label: 'Explain', icon: '💡', mode: 'explain', placeholder: 'Enter a term, word, or phrase…' },
  { id: 'idea', label: 'Ideas', icon: '🧠', mode: 'idea', placeholder: 'What topic do you need ideas for?' },
  // Quick style rewrites
  { id: 'shorten', label: 'Shorten', icon: '✂️', mode: 'shorten', placeholder: 'Paste text to shorten…' },
  { id: 'polish', label: 'Polish', icon: '💎', mode: 'polish', placeholder: 'Paste text to polish…' },
  { id: 'normal', label: 'Normal', icon: '📝', mode: 'normal', placeholder: 'Paste text to rewrite neutrally…' },
  { id: 'friendly', label: 'Friendly', icon: '🤝', mode: 'friendly', placeholder: 'Paste text to warm up…' },
  { id: 'professional', label: 'Professional', icon: '👔', mode: 'professional', placeholder: 'Paste text to make formal…' },
  // Templates
  { id: 'blog_post', label: 'Blog Post', icon: '📰', mode: 'template', template: 'blog_post', placeholder: 'Topic + audience + key points…' },
  { id: 'product_description', label: 'Product', icon: '🛍️', mode: 'template', template: 'product_description', placeholder: "Product + who it's for + top benefits…" },
  { id: 'email_reply_template', label: 'Email Reply', icon: '📧', mode: 'template', template: 'email_reply_template', placeholder: 'The email you received + what to reply…' },
  { id: 'social_caption', label: 'Caption', icon: '📱', mode: 'template', template: 'social_caption', placeholder: 'Product/topic + platform + vibe…' },
]

export interface ToneOption {
  value: string
  label: string
  icon: string
}

// Tone is optional — "Auto" (value 'default') applies no specific tone, which the backend
// treats as "no preference". The tools themselves already imply a style.
export const TONES: ToneOption[] = [
  { value: 'default', label: 'Auto', icon: '🎚️' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'friendly', label: 'Friendly', icon: '😊' },
  { value: 'academic', label: 'Academic', icon: '🎓' },
  { value: 'marketing', label: 'Marketing', icon: '📣' },
  { value: 'storytelling', label: 'Storytelling', icon: '📖' },
]

// Matches the backend default `MAX_INPUT_CHARS`.
export const MAX_INPUT_CHARS = 8000
