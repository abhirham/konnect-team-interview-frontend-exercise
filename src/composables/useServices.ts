import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import type { Service, ServicesError } from '@/types'

interface UseServices {
  services: Ref<Service[]>
  loading: Ref<boolean>
  initialLoading: Ref<boolean>
  error: Ref<ServicesError | null>
  searchQuery: Ref<string>
  resultsQuery: Ref<string>
  retry: () => Promise<void>
}

export const DEBOUNCE_MS = 300

const toServicesError = (cause: unknown): ServicesError => {
  const status = axios.isAxiosError(cause) ? cause.response?.status : undefined
  if (status === undefined || status >= 500) {
    return { status, retryable: true }
  }
  return { status, retryable: false }
}

// No Pinia: the catalog is the only consumer of this data and nothing outside it needs to read or mutate the list, so using a composable.
export default function useServices(): UseServices {
  const services = ref<Service[]>([])
  const loading = ref<boolean>(true)
  // Distinguishes the first load (skeletons) from a search refetch.
  const initialLoading = ref<boolean>(true)
  const error = ref<ServicesError | null>(null)
  const searchQuery = ref<string>('')
  const resultsQuery = ref<string>('')

  let inFlight: AbortController | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const getServices = async (): Promise<void> => {
    inFlight?.abort()
    const controller = new AbortController()
    inFlight = controller
    const query = searchQuery.value

    loading.value = true
    error.value = null

    try {
      const { data } = await axios.get<Service[]>('/api/services', {
        params: { q: query },
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      services.value = data
      resultsQuery.value = query
    } catch (cause) {
      if (controller.signal.aborted) return
      error.value = toServicesError(cause)
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false
        initialLoading.value = false
      }
    }
  }

  watch(searchQuery, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(getServices, DEBOUNCE_MS)
  })

  onBeforeMount(getServices)

  onUnmounted(() => {
    clearTimeout(debounceTimer)
    inFlight?.abort()
  })

  return {
    services,
    loading,
    initialLoading,
    error,
    searchQuery,
    resultsQuery,
    retry: getServices,
  }
}
