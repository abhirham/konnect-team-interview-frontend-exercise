import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogEmpty from './CatalogEmpty.vue'
import '../../mocks/testUtils'

describe('<CatalogEmpty />', () => {
  it('names the query that matched nothing', () => {
    const wrapper = mount(CatalogEmpty, { props: { query: 'payments' } })

    expect(wrapper.text()).toContain('No services found')
    expect(wrapper.text()).toContain('Nothing in the catalog matches')
    expect(wrapper.text()).toContain('"payments"')
  })

  it('says the catalog is empty when there is no query', () => {
    const wrapper = mount(CatalogEmpty, { props: { query: '' } })

    expect(wrapper.text()).toContain('There are no services in this catalog yet.')
    expect(wrapper.text()).not.toContain('Nothing in the catalog matches')
  })
})
