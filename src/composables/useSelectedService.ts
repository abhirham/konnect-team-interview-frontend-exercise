import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ComputedRef, Ref } from 'vue'
import type { Service } from '@/types'

interface UseSelectedService {
  selectedService: ComputedRef<Service | null>
  openService: (service: Service) => void
  closeService: () => void
}

export const SERVICE_QUERY_PARAM = 'service'

export default function useSelectedService(services: Ref<Service[]>): UseSelectedService {
  const route = useRoute()
  const router = useRouter()

  const selectedService = computed((): Service | null => {
    const id = route.query[SERVICE_QUERY_PARAM]
    if (typeof id !== 'string') return null
    return services.value.find((service) => service.id === id) ?? null
  })

  const openService = (service: Service): void => {
    // replacing the route so multiple service clicks dont clog up the browser history.
    router.replace({ query: { ...route.query, [SERVICE_QUERY_PARAM]: service.id } })
  }

  const closeService = (): void => {
    const query = { ...route.query }
    delete query[SERVICE_QUERY_PARAM]
    router.replace({ query })
  }

  return { selectedService, openService, closeService }
}
