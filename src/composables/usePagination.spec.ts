import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import usePagination, { PAGE_SIZE } from './usePagination'

const numbers = (count: number): number[] => Array.from({ length: count }, (_, index) => index)

describe('usePagination()', () => {
  it('starts on the first page and slices it off the front', () => {
    const { page, pageItems } = usePagination(ref(numbers(20)))

    expect(page.value).toBe(1)
    expect(pageItems.value).toHaveLength(PAGE_SIZE)
    expect(pageItems.value[0]).toBe(0)
    expect(pageItems.value.at(-1)).toBe(PAGE_SIZE - 1)
  })

  it('renders page count correctly', () => {
    expect(usePagination(ref(numbers(20))).pageCount.value).toBe(3)
    expect(usePagination(ref(numbers(18))).pageCount.value).toBe(2)
    expect(usePagination(ref(numbers(1))).pageCount.value).toBe(1)
    expect(usePagination(ref(numbers(0))).pageCount.value).toBe(0)
  })

  it('reports the range on screen, stopping at the last item', () => {
    const { rangeStart, rangeEnd, goToNext } = usePagination(ref(numbers(20)))

    expect([rangeStart.value, rangeEnd.value]).toEqual([1, 9])

    goToNext()
    expect([rangeStart.value, rangeEnd.value]).toEqual([10, 18])

    goToNext()
    expect([rangeStart.value, rangeEnd.value]).toEqual([19, 20])
  })

  it('walks forwards and backwards a page at a time', () => {
    const { page, pageItems, goToNext, goToPrevious } = usePagination(ref(numbers(20)))

    goToNext()
    expect(page.value).toBe(2)
    expect(pageItems.value[0]).toBe(PAGE_SIZE)

    goToPrevious()
    expect(page.value).toBe(1)
    expect(pageItems.value[0]).toBe(0)
  })

  it('doesnt allow a illegal page', () => {
    const { page, goToPrevious, goToNext } = usePagination(ref(numbers(20)))

    goToPrevious()
    expect(page.value).toBe(1)

    goToNext()
    goToNext()
    goToNext()
    expect(page.value).toBe(3)
  })

  it('returns to the first page when the items are replaced', async () => {
    const items = ref(numbers(20))
    const { page, goToNext } = usePagination(items)

    goToNext()
    expect(page.value).toBe(2)

    items.value = numbers(12)
    await nextTick()

    expect(page.value).toBe(1)
  })
})
