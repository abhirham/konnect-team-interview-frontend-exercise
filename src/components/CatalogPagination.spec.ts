import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogPagination from './CatalogPagination.vue'
import '../../mocks/testUtils'

const defaultProps = {
  rangeStart: 1,
  rangeEnd: 9,
  total: 20,
  hasPrevious: false,
  hasNext: true,
}

const mountPagination = (props: Partial<typeof defaultProps> = {}) =>
  mount(CatalogPagination, { props: { ...defaultProps, ...props } })

describe('<CatalogPagination />', () => {
  it('shows correct page and total count', () => {
    const wrapper = mountPagination({ rangeStart: 10, rangeEnd: 18, total: 20 })

    expect(wrapper.findTestId('pagination-count').text()).toBe('10 to 18 of 20 services')
  })

  it('disables previous when on 1st page', () => {
    const wrapper = mountPagination({ hasPrevious: false })

    expect(wrapper.findTestId('pagination-previous').attributes('disabled')).toBeDefined()
  })

  it('disables next when on last page', () => {
    const wrapper = mountPagination({ hasNext: false })

    expect(wrapper.findTestId('pagination-next').attributes('disabled')).toBeDefined()
  })

  it('emits previous and next when the arrows are clicked', async () => {
    const wrapper = mountPagination({ hasPrevious: true, hasNext: true })

    await wrapper.findTestId('pagination-previous').trigger('click')
    await wrapper.findTestId('pagination-next').trigger('click')

    expect(wrapper.emitted('previous')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })
})
