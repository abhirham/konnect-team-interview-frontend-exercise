
export interface Developer {
  id: string
  name: string
  email: string
  avatar: string
}

export interface ServiceVersion {
  id: string
  name: string
  description: string
  developer?: Developer
  updated_at: string
}

export interface ServiceMetrics {
  latency: number
  uptime: number
  requests: number
  errors: number
}

export interface Service {
  id: string
  name: string
  description: string
  type: string
  published: boolean
  configured: boolean
  versions: ServiceVersion[]
  metrics?: ServiceMetrics
}

export interface ServicePackageDraft {
  title: string
  description: string
}

export interface ServicesError {
  status?: number
  retryable: boolean
}
