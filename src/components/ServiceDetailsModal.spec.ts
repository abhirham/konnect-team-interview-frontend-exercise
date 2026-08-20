import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import ServiceDetailsModal from './ServiceDetailsModal.vue'
import { createService, createVersion } from '../../mocks/factories'
import type { Service } from '@/types'
import '../../mocks/testUtils'

const NOW = new Date('2024-01-10T12:00:00.000Z')

const mountDetails = (overrides: Partial<Service> = {}) =>
  mount(ServiceDetailsModal, { props: { service: createService(overrides) } })

describe('<ServiceDetailsModal />', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the service as a summary card in the header', () => {
    const wrapper = mountDetails()

    expect(wrapper.findTestId('service-summary').exists()).toBe(true)
    expect(wrapper.findTestId('service-name').text()).toBe('Luxurious Concrete Soap')
  })

  it('counts the versions in the section heading', () => {
    const wrapper = mountDetails({ versions: [createVersion(), createVersion({ id: 'version-2', name: '2.0.0' })] })

    expect(wrapper.text()).toContain('Versions (2)')
  })

  it('renders every version with its name, description and the service type', () => {
    const wrapper = mountDetails({ versions: [createVersion(), createVersion({ id: 'version-2', name: '2.0.0' })] })

    const rows = wrapper.findAllTestId('details-version')
    expect(rows).toHaveLength(2)
    expect(rows[0].getTestId('version-name').text()).toBe('v1.0.0')
    expect(rows[0].getTestId('version-description').text())
      .toBe('Multi-tiered 5th generation process improvement')
    expect(rows[0].getTestId('version-type').text()).toBe('REST')
  })

  it('shortens the developer name and renders their avatar', () => {
    const wrapper = mountDetails()

    expect(wrapper.findTestId('version-developer').text()).toBe('Ada L.')
    expect(wrapper.findTestId('version-developer-avatar').attributes('src'))
      .toBe('https://avatars.example.com/ada')
  })

  it('omits the developer and avatar of a version that has none', () => {
    const wrapper = mountDetails({ versions: [createVersion({ developer: undefined })] })

    expect(wrapper.findTestId('details-version').exists()).toBe(true)
    expect(wrapper.findTestId('version-developer').exists()).toBe(false)
    expect(wrapper.findTestId('version-developer-avatar').exists()).toBe(false)
  })

  it('shows how long ago a version was updated', () => {
    const wrapper = mountDetails()

    expect(wrapper.findTestId('version-updated').text()).toBe('2 hours ago')
  })

  it('exposes the exact timestamp on hover', () => {
    const wrapper = mountDetails()

    const exact = dayjs('2024-01-10T10:00:00.000Z').format('D MMMM YYYY, h:mm A')
    expect(wrapper.findTestId('version-updated').attributes('title')).toBe(exact)
  })

  it('emits close when the modal asks to close', async () => {
    const wrapper = mountDetails()

    await wrapper.findTestId('modal-close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
