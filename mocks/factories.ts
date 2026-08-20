import type { Developer, Service, ServiceVersion } from '@/types'


export const createDeveloper = (overrides: Partial<Developer> = {}): Developer => ({
  id: 'dev-ada',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  avatar: 'https://avatars.example.com/ada',
  ...overrides,
})

export const createVersion = (overrides: Partial<ServiceVersion> = {}): ServiceVersion => ({
  id: 'version-1',
  name: '1.0.0',
  description: 'Multi-tiered 5th generation process improvement',
  developer: createDeveloper(),
  updated_at: '2024-01-10T10:00:00.000Z',
  ...overrides,
})

export const createService = (overrides: Partial<Service> = {}): Service => ({
  id: 'service-1',
  name: 'Luxurious Concrete Soap',
  description: 'Function-based hybrid task-force',
  type: 'REST',
  published: true,
  configured: true,
  versions: [createVersion()],
  metrics: { latency: 0.46, uptime: 0.9643, requests: 317133, errors: 0.0865 },
  ...overrides,
})
