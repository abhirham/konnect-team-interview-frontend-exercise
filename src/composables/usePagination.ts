import { computed, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

interface UsePagination<T> {
  page: Ref<number>
  pageItems: ComputedRef<T[]>
  pageCount: ComputedRef<number>
  rangeStart: ComputedRef<number>
  rangeEnd: ComputedRef<number>
  hasPrevious: ComputedRef<boolean>
  hasNext: ComputedRef<boolean>
  goToPrevious: () => void
  goToNext: () => void
}

export const PAGE_SIZE = 9

export default function usePagination<T>(items: Ref<T[]>): UsePagination<T> {
  const page = ref<number>(1)

  const pageCount = computed((): number => Math.ceil(items.value.length / PAGE_SIZE))

  const pageItems = computed((): T[] => {
    const start = (page.value - 1) * PAGE_SIZE
    return items.value.slice(start, start + PAGE_SIZE)
  })

  const rangeStart = computed((): number => (page.value - 1) * PAGE_SIZE + 1)
  const rangeEnd = computed((): number => Math.min(page.value * PAGE_SIZE, items.value.length))

  const hasPrevious = computed((): boolean => page.value > 1)
  const hasNext = computed((): boolean => page.value < pageCount.value)

  const goToPrevious = (): void => {
    if (hasPrevious.value) page.value -= 1
  }

  const goToNext = (): void => {
    if (hasNext.value) page.value += 1
  }

  watch(items, () => {
    page.value = 1
  })

  return {
    page,
    pageItems,
    pageCount,
    rangeStart,
    rangeEnd,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
  }
}
