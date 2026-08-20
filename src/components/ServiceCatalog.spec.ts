import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'
import axios from 'axios'
import ServiceCatalog from './ServiceCatalog.vue'
import servicesData from '../../mocks/services'
import { DEBOUNCE_MS } from '@/composables/useServices'
import type { Service } from '@/types'
import '../../mocks/testUtils'

vi.mock('axios', () => import('../../mocks/axios'))

const mockedGet = vi.mocked(axios.get)

const services: Service[] = servicesData

let router: Router

const createTestRouter = (): Router => createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: ServiceCatalog }],
})

const mountCatalog = (): VueWrapper => {
  router = createTestRouter()
  return mount(ServiceCatalog, { global: { plugins: [router] } })
}

const mountCatalogAt = async (path: string): Promise<VueWrapper> => {
  router = createTestRouter()
  await router.replace(path)
  await router.isReady()
  const wrapper = mount(ServiceCatalog, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

const manyServices = (count: number): Service[] =>
  Array.from({ length: count }, (_, index) => ({
    ...services[0],
    id: `service-${index}`,
    name: `Service ${index}`,
  }))

const cardNames = (wrapper: VueWrapper): string[] =>
  wrapper.findAllTestId('service-name').map((name) => name.text())

const settleDebounce = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)
  await flushPromises()
}

describe('<ServiceCatalog />', () => {
  beforeEach(() => {
    mockedGet.mockReset()
    mockedGet.mockResolvedValue({ data: services })
  })

  it('replaces the skeleton cards with real cards once the data is fetched', async () => {
    let resolveRequest: (value: { data: Service[] }) => void = () => {}
    mockedGet.mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve
    }))

    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findAllTestId('service-card-skeleton').length).toBeGreaterThan(0)
    expect(wrapper.findTestId('service-card').exists()).toBe(false)

    resolveRequest({ data: services })
    await flushPromises()

    expect(wrapper.findTestId('service-card-skeleton').exists()).toBe(false)
    expect(wrapper.findAllTestId('service-card')).toHaveLength(services.length)
  })

  it('renders the no-results message when the API returns no services', async () => {
    mockedGet.mockResolvedValue({ data: [] })

    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findTestId('no-results').isVisible()).toBe(true)
  })

  it('renders the error message and retries the request when Retry is clicked', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mountCatalog()
    await flushPromises()

    expect(wrapper.findTestId('catalog-error').exists()).toBe(true)
    expect(mockedGet).toHaveBeenCalledTimes(1)

    await wrapper.findTestId('retry-button').trigger('click')
    await flushPromises()

    expect(mockedGet).toHaveBeenCalledTimes(2)
    expect(wrapper.findTestId('catalog-error').exists()).toBe(false)
    expect(wrapper.findAllTestId('service-card')).toHaveLength(services.length)
  })

  describe('pagination', () => {
    it('renders the next nine services when next is clicked', async () => {
      mockedGet.mockResolvedValue({ data: manyServices(20) })

      const wrapper = mountCatalog()
      await flushPromises()

      await wrapper.findTestId('pagination-next').trigger('click')

      expect(cardNames(wrapper)[0]).toBe('Service 9')
      expect(cardNames(wrapper)[8]).toBe('Service 17')
    })

    it('hides the footer when the result set fits on one page', async () => {
      const wrapper = mountCatalog()
      await flushPromises()

      expect(wrapper.findTestId('pagination-count').exists()).toBe(false)
    })

    describe('with search', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('counts the search result set, not the whole catalog, and returns to the first page', async () => {
        mockedGet.mockResolvedValue({ data: manyServices(20) })

        const wrapper = mountCatalog()
        await flushPromises()

        await wrapper.findTestId('pagination-next').trigger('click')
        expect(wrapper.findTestId('pagination-count').text()).toBe('10 to 18 of 20 services')

        mockedGet.mockResolvedValue({ data: manyServices(12) })
        await wrapper.findTestId('search-input').setValue('service')
        await settleDebounce()

        expect(wrapper.findTestId('pagination-count').text()).toBe('1 to 9 of 12 services')
        expect(cardNames(wrapper)[0]).toBe('Service 0')
      })
    })
  })

  describe('details modal', () => {
    const openFirstCard = async (wrapper: VueWrapper): Promise<void> => {
      await wrapper.findAllTestId('service-card')[0].trigger('click')
      await flushPromises()
    }

    it('opens the modal for the card that was clicked', async () => {
      const wrapper = mountCatalog()
      await flushPromises()

      expect(wrapper.findTestId('service-details').exists()).toBe(false)

      await openFirstCard(wrapper)

      expect(wrapper.getTestId('service-summary').getTestId('service-name').text())
        .toBe(services[0].name)
    })
  })

  describe('service id in the URL', () => {
    const openCard = async (wrapper: VueWrapper, index: number): Promise<void> => {
      await wrapper.findAllTestId('service-card')[index].trigger('click')
      await flushPromises()
    }

    const close = async (wrapper: VueWrapper): Promise<void> => {
      await wrapper.findTestId('modal-close').trigger('click')
      await flushPromises()
    }

    it('writes the service id when a card is opened and removes it on modal close', async () => {
      const wrapper = mountCatalog()
      await flushPromises()

      await openCard(wrapper, 1)

      expect(router.currentRoute.value.query.service).toBe(services[1].id)

      await close(wrapper)

      expect(router.currentRoute.value.query.service).toBeUndefined()
    })

    it('opens the modal for a service id already in the URL on mount', async () => {
      const wrapper = await mountCatalogAt(`/?service=${services[1].id}`)

      expect(wrapper.findTestId('service-details').exists()).toBe(true)
      expect(wrapper.getTestId('service-summary').getTestId('service-name').text())
        .toBe(services[1].name)
    })
  })

  describe('create service package modal', () => {
    const openCreateForm = async (wrapper: VueWrapper): Promise<void> => {
      await wrapper.findTestId('create-service-package').trigger('click')
    }

    it('opens a form with a title field and a description field', async () => {
      const wrapper = mountCatalog()
      await flushPromises()

      expect(wrapper.findTestId('create-package').exists()).toBe(false)

      await openCreateForm(wrapper)

      expect(wrapper.findTestId('create-package').exists()).toBe(true)
      expect(wrapper.findTestId('create-package-title').exists()).toBe(true)
      expect(wrapper.findTestId('create-package-description').exists()).toBe(true)
    })

    it('closes on submit', async () => {
      const wrapper = mountCatalog()
      await flushPromises()
      await openCreateForm(wrapper)

      await wrapper.findTestId('create-package-title').setValue('Billing')
      await wrapper.findTestId('create-package-description').setValue('Invoices')
      await wrapper.findTestId('create-package').trigger('submit')

      expect(wrapper.findTestId('create-package').exists()).toBe(false)
    })
  })
})
