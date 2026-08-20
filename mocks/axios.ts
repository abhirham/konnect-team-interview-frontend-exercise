import { vi } from 'vitest'

export default {
  get: vi.fn(),
  isAxiosError: (cause: unknown): boolean => Boolean((cause as { isAxiosError?: boolean })?.isAxiosError),
}
