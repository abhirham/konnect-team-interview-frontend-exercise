import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import axios from 'axios'
import useServices, { DEBOUNCE_MS } from './useServices'
import { createService } from '../../mocks/factories'
import type { Service } from '@/types'
import '../../mocks/testUtils'

vi.mock('axios', () => import('../../mocks/axios'))

const mockedGet = vi.mocked(axios.get)

const service = (id: string): Service => createService({ id })

const mountHarness = () => {
  let api!: ReturnType<typeof useServices>
  const wrapper = mount({
    setup() {
      api = useServices()
      return () => h('div')
    },
  })
  return { wrapper, api }
}

const settleDebounce = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(DEBOUNCE_MS)
  await flushPromises()
}

describe('useServices()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockedGet.mockReset()
    mockedGet.mockResolvedValue({ data: [service('a')] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches the catalog before mount and clears both loading flags when it lands', async () => {
    const { api } = mountHarness()

    expect(api.loading.value).toBe(true)
    expect(api.initialLoading.value).toBe(true)

    await flushPromises()

    expect(mockedGet).toHaveBeenCalledWith('/api/services', expect.objectContaining({ params: { q: '' } }))
    expect(api.services.value).toHaveLength(1)
    expect(api.loading.value).toBe(false)
    expect(api.initialLoading.value).toBe(false)
  })

  it('issues one request carrying the final query once typing stops', async () => {
    const { api } = mountHarness()
    await flushPromises()
    mockedGet.mockClear()

    api.searchQuery.value = 'p'
    api.searchQuery.value = 'pa'
    api.searchQuery.value = 'pay'
    await flushPromises()
    expect(mockedGet).not.toHaveBeenCalled()

    await settleDebounce()

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(mockedGet.mock.calls[0][1]).toMatchObject({ params: { q: 'pay' } })
  })

  it('aborts the in-flight request when a newer one starts', async () => {
    const { api } = mountHarness()
    await flushPromises()

    mockedGet.mockReturnValueOnce(new Promise(() => {}))
    api.searchQuery.value = 'pay'
    await settleDebounce()

    api.searchQuery.value = 'payments'
    await settleDebounce()

    const staleRequest = mockedGet.mock.calls.at(-2)?.[1]
    expect(staleRequest?.signal?.aborted).toBe(true)
  })

  it('does not let a superseded response overwrite the newer results', async () => {
    const { api } = mountHarness()
    await flushPromises()

    let resolveStale: (value: { data: Service[] }) => void = () => {}
    mockedGet.mockReturnValueOnce(new Promise((resolve) => {
      resolveStale = resolve
    }))

    api.searchQuery.value = 'pay'
    await settleDebounce()

    mockedGet.mockResolvedValue({ data: [service('fresh')] })
    api.searchQuery.value = 'payments'
    await settleDebounce()

    resolveStale({ data: [service('stale')] })
    await flushPromises()

    expect(api.services.value.map((item) => item.id)).toEqual(['fresh'])
  })

  it('abandons the pending debounce and request when the consumer unmounts', async () => {
    const { wrapper, api } = mountHarness()
    await flushPromises()
    mockedGet.mockClear()

    api.searchQuery.value = 'pay'
    await nextTick()
    wrapper.unmount()

    await settleDebounce()

    expect(mockedGet).not.toHaveBeenCalled()
  })
})
