import { computed } from 'vue'
import type { ComputedRef, Component, Ref } from 'vue'
import CheckMark from '@/icons/CheckMark.vue'
import Cross from '@/icons/CrossIcon.vue'
import InProgress from '@/icons/InProgress.vue'
import type { Service } from '@/types'

export interface ServiceStatus {
  key: 'published' | 'unpublished' | 'in-progress'
  label: string
  icon: Component
}

export interface ServiceMetricsText {
  latency: string
  uptime: string
  requests: string
  errors: string
}

interface UseServiceSummary {
  status: ComputedRef<ServiceStatus>
  metrics: ComputedRef<ServiceMetricsText>
}

const requestFormat = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

export default function useServiceSummary(service: Ref<Service>): UseServiceSummary {
  const status = computed((): ServiceStatus => {
    if (!service.value.configured) {
      return { key: 'in-progress', label: 'In progress', icon: InProgress }
    }
    if (service.value.published) {
      return { key: 'published', label: 'Published to portal', icon: CheckMark }
    }
    return { key: 'unpublished', label: 'Unpublished', icon: Cross }
  })

  const metrics = computed((): ServiceMetricsText => {
    const values = service.value.metrics
    if (!values) {
      return { latency: '', uptime: '', requests: '', errors: '' }
    }
    return {
      latency: `${values.latency.toFixed(2)} ms`,
      uptime: `${(values.uptime * 100).toFixed(2)}%`,
      requests: requestFormat.format(values.requests),
      errors: `${(values.errors * 100).toFixed(2)}%`,
    }
  })

  return { status, metrics }
}
