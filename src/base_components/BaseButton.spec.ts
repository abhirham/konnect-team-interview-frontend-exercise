import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import BaseButton from './BaseButton.vue'
import '../../mocks/testUtils'

const StarIcon = { render: () => h('svg', { 'data-testid': 'star-icon' }) }

describe('<BaseButton />', () => {
  it('renders its label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Service Package' } })

    expect(wrapper.text()).toBe('Service Package')
  })

  it('defaults to type="button" so it never submits a surrounding form by accident', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Cancel' } })

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('takes type="submit" when asked', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Create', type: 'submit' } })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders the prepend icon before the label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Add', prependIcon: StarIcon } })

    expect(wrapper.findTestId('star-icon').exists()).toBe(true)
  })

  it('renders no icon when none is given', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Add' } })

    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('adds the rounded class only when rounded is set', () => {
    expect(mount(BaseButton).classes()).not.toContain('rounded')
    expect(mount(BaseButton, { props: { rounded: true } }).classes()).toContain('rounded')
  })

  it('applies the background and colour overrides as inline styles', () => {
    const wrapper = mount(BaseButton, { props: { background: 'transparent', color: '#3C4557' } })

    expect(wrapper.attributes('style')).toContain('background: transparent')
    expect(wrapper.attributes('style')).toContain('color: rgb(60, 69, 87)')
  })

  it('emits clicks to the parent', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Retry' } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
