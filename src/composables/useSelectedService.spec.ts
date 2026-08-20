import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import type { Ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'
import useSelectedService from './useSelectedService'
import { createService } from '../../mocks/factories'
import type { Service } from '@/types'
import '../../mocks/testUtils'

const service = (id: string): Service => createService({ id })

interface Harness {
  selected: ReturnType<typeof useSelectedService>
  router: Router
}

const mountHarness = async (services: Ref<Service[]>, path = '/'): Promise<Harness> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => h('div') } }],
  })
  await router.replace(path)
  await router.isReady()

  let selected!: ReturnType<typeof useSelectedService>
  mount(
    {
      setup() {
        selected = useSelectedService(services)
        return () => h('div')
      },
    },
    { global: { plugins: [router] } },
  )

  return { selected, router }
}

describe('useSelectedService()', () => {

  it('selects the service named in the URL on load', async () => {
    const { selected } = await mountHarness(ref([service('a'), service('b')]), '/?service=b')

    expect(selected.selectedService.value?.id).toBe('b')
  })

  it('selects nothing for an id that is not in the list', async () => {
    const { selected } = await mountHarness(ref([service('a')]), '/?service=missing')

    expect(selected.selectedService.value).toBeNull()
  })

  it('writes the id to the URL when a service is opened', async () => {
    const { selected, router } = await mountHarness(ref([service('a'), service('b')]))

    selected.openService(service('b'))
    await flushPromises()

    expect(router.currentRoute.value.query.service).toBe('b')
    expect(selected.selectedService.value?.id).toBe('b')
  })
})
