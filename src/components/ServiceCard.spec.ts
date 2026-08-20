import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceCard from './ServiceCard.vue'
import { createService, createVersion } from '../../mocks/factories'
import type { Service } from '@/types'
import '../../mocks/testUtils'

const mountCard = (props: Partial<{ service: Service, variant: 'card' | 'summary' }> = {}) =>
  mount(ServiceCard, { props: { service: createService(), ...props } })

describe('<ServiceCard />', () => {
  it('renders the name, description, status and metrics', () => {
    const wrapper = mountCard()

    expect(wrapper.findTestId('service-name').text()).toBe('Luxurious Concrete Soap')
    expect(wrapper.findTestId('service-description').text()).toBe('Function-based hybrid task-force')
    expect(wrapper.findTestId('service-status').text()).toBe('Published to portal')
    expect(wrapper.findTestId('metric-latency').text()).toBe('0.46 msLatency')
    expect(wrapper.findTestId('metric-uptime').text()).toBe('96.43%Uptime')
    expect(wrapper.findTestId('metric-requests').text()).toBe('317.13KRequests')
    expect(wrapper.findTestId('metric-errors').text()).toBe('8.65%Errors')
  })


  it('renders the not-configured message instead of the metrics and version count for a service in progress', () => {
    const wrapper = mountCard({ service: createService({ configured: false, metrics: undefined }) })

    expect(wrapper.findTestId('not-configured').text()).toBe('Not configured with runtime yet')
    expect(wrapper.findTestId('service-metrics').exists()).toBe(false)
    expect(wrapper.findTestId('service-version-count').exists()).toBe(false)
  })

  it('pluralises the version count', () => {
    expect(mountCard().findTestId('service-version-count').text()).toBe('1 version')

    const twoVersions = mountCard({ service: createService({ versions: [createVersion(), createVersion({ id: 'version-2', name: '2.0.0' })] }) })
    expect(twoVersions.findTestId('service-version-count').text()).toBe('2 versions')
  })

  it('omits the version count for a service with no versions', () => {
    const wrapper = mountCard({ service: createService({ versions: [] }) })

    expect(wrapper.findTestId('service-version-count').exists()).toBe(false)
  })

  describe('card variant', () => {

    it('emits select on click, Enter and Space', async () => {
      const wrapper = mountCard()

      await wrapper.trigger('click')
      await wrapper.trigger('keydown.enter')
      await wrapper.trigger('keydown.space')

      expect(wrapper.emitted('select')).toHaveLength(3)
    })

    it('renders the developer avatars', () => {
      expect(mountCard().findTestId('developer-avatars').exists()).toBe(true)
    })
  })

  describe('summary variant', () => {

    it('drops the version count and the developer avatars', () => {
      const wrapper = mountCard({ variant: 'summary' })

      expect(wrapper.findTestId('service-version-count').exists()).toBe(false)
      expect(wrapper.findTestId('developer-avatars').exists()).toBe(false)
    })

    it('keeps the name, status and metrics', () => {
      const wrapper = mountCard({ variant: 'summary' })

      expect(wrapper.findTestId('service-summary').exists()).toBe(true)
      expect(wrapper.findTestId('service-name').text()).toBe('Luxurious Concrete Soap')
      expect(wrapper.findTestId('service-status').text()).toBe('Published to portal')
      expect(wrapper.findTestId('metric-latency').text()).toBe('0.46 msLatency')
      expect(wrapper.findTestId('metric-uptime').text()).toBe('96.43%Uptime')
      expect(wrapper.findTestId('metric-requests').text()).toBe('317.13KRequests')
      expect(wrapper.findTestId('metric-errors').text()).toBe('8.65%Errors')
    })
  })
})
