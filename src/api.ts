const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export interface GenerateBody {
  mode: string
  text: string
  tone?: string
  length?: string
  signature?: string
  template?: string
}

export interface GenerateResult {
  result: string
  mode: string
  tone: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (typeof data?.detail === 'string') return data.detail
  } catch {
    /* not JSON */
  }
  return res.statusText || `Request failed (${res.status})`
}

export async function generate(
  body: GenerateBody,
  initData: string,
): Promise<GenerateResult> {
  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initData}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    if (res.status === 429) {
      const retry = res.headers.get('Retry-After')
      throw new ApiError(
        429,
        `Rate limit reached${retry ? ` — try again in ${retry}s.` : '.'}`,
      )
    }
    throw new ApiError(res.status, await parseError(res))
  }

  try {
    return (await res.json()) as GenerateResult
  } catch {
    // A 200 with a non-JSON body usually means the request hit the web host instead of
    // the API — i.e. VITE_API_BASE_URL isn't pointing at the backend.
    throw new ApiError(
      res.status,
      'Unexpected response from the server. Check that VITE_API_BASE_URL points to the backend API.',
    )
  }
}
