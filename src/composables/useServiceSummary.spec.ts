import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import useServiceSummary from './useServiceSummary'
import CheckMark from '@/icons/CheckMark.vue'
import CrossIcon from '@/icons/CrossIcon.vue'
import InProgress from '@/icons/InProgress.vue'
import { createService } from '../../mocks/factories'

describe('useServiceSummary()', () => {
  describe('status', () => {
    it('is published when the service is configured and published', () => {
      const { status } = useServiceSummary(ref(createService()))

      expect(status.value).toEqual({ key: 'published', label: 'Published to portal', icon: CheckMark })
    })

    it('is unpublished when the service is configured but not published', () => {
      const { status } = useServiceSummary(ref(createService({ published: false })))

      expect(status.value).toEqual({ key: 'unpublished', label: 'Unpublished', icon: CrossIcon })
    })

    it('is in progress whenever the service is unconfigured, published or not', () => {
      const { status } = useServiceSummary(ref(createService({ configured: false, published: true })))

      expect(status.value).toEqual({ key: 'in-progress', label: 'In progress', icon: InProgress })
    })
  })

  describe('metrics', () => {
    it('formats latency, uptime, requests and errors for display', () => {
      const { metrics } = useServiceSummary(ref(createService()))

      expect(metrics.value).toEqual({
        latency: '0.46 ms',
        uptime: '96.43%',
        requests: '317.13K',
        errors: '8.65%',
      })
    })

    it('keeps trailing zeros on percentages and milliseconds', () => {
      const { metrics } = useServiceSummary(ref(createService({
        metrics: { latency: 1, uptime: 1, requests: 1000, errors: 0 },
      })))

      expect(metrics.value).toEqual({
        latency: '1.00 ms',
        uptime: '100.00%',
        requests: '1K',
        errors: '0.00%',
      })
    })

    it('is blank for a service with no metrics payload', () => {
      const { metrics } = useServiceSummary(ref(createService({ metrics: undefined })))

      expect(metrics.value).toEqual({ latency: '', uptime: '', requests: '', errors: '' })
    })
  })
})
