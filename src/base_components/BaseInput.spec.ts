import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from './BaseInput.vue'
import '../../mocks/testUtils'

describe('<BaseInput />', () => {
  it('renders a visible label linked to the field', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Title', modelValue: '' },
    })

    const input = wrapper.find('input')
    expect(wrapper.find('label').text()).toBe('Title')
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))
  })

  it('adds the clear button only on a clearable field with a value', async () => {
    const plain = mount(BaseInput, { props: { label: 'Title', modelValue: 'Invoices' } })
    const clearable = mount(BaseInput, {
      props: { clearable: true, modelValue: '', placeholder: 'Search' },
    })

    expect(plain.findTestId('clear-input').exists()).toBe(false)
    expect(clearable.findTestId('clear-input').exists()).toBe(false)

    await clearable.setProps({ modelValue: 'Invoices' })

    expect(clearable.findTestId('clear-input').exists()).toBe(true)
  })

  it('takes its width from the width prop', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', placeholder: 'Search', width: '100%' },
    })

    expect(wrapper.get('.base-input').attributes('style')).toContain('width: 100%')
  })

  it('shows the progress bar only while loading', async () => {
    const wrapper = mount(BaseInput, {
      props: { loading: false, modelValue: '', placeholder: 'Search' },
    })

    expect(wrapper.findTestId('input-progress').exists()).toBe(false)

    await wrapper.setProps({ loading: true })

    expect(wrapper.findTestId('input-progress').exists()).toBe(true)
  })

  it('links the error message to the field and flags it as invalid', async () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Title', modelValue: '' },
    })

    expect(wrapper.findTestId('input-error').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()

    await wrapper.setProps({ error: 'Title is required' })

    const input = wrapper.find('input')
    const error = wrapper.findTestId('input-error')
    expect(error.text()).toBe('Title is required')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
  })

  it('renders a textarea when multiline', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Description', modelValue: '', multiline: true },
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })
})
