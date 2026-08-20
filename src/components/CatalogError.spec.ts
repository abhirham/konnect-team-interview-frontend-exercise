import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogError from '@/components/CatalogError.vue'
import '../../mocks/testUtils'

describe('<CatalogError />', () => {
  it('shows error message', () => {
    const wrapper = mount(CatalogError)

    expect(wrapper.findTestId('catalog-error-message').text()).toBe('Something went wrong. Please try again.')
  })

  it('emits retry when the retry button is clicked', async () => {
    const wrapper = mount(CatalogError)

    await wrapper.findTestId('retry-button').trigger('click')

    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
