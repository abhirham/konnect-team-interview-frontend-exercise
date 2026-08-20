import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import BaseModal from './BaseModal.vue'
import '../../mocks/testUtils'

const slots = {
  header: () => h('h2', 'Title'),
  body: () => h('p', 'Body'),
  footer: () => h('p', 'Footer'),
}

interface ModalProps {
  label: string
  maxWidth: string
  closeable: boolean
}

const mountModal = (props: Partial<ModalProps> = {}) =>
  mount(BaseModal, { props: { label: 'Service details', ...props }, slots })

describe('<BaseModal />', () => {
  it('renders a labelled dialog', () => {
    const dialog = mountModal().findTestId('modal-dialog')

    expect(dialog.attributes('role')).toBe('dialog')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('Service details')
  })

  it('renders the header, body and footer slots', () => {
    const wrapper = mountModal()

    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('Footer')
  })

  it('emits close from the close button', async () => {
    const wrapper = mountModal()

    await wrapper.findTestId('modal-close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('hides the close button when the modal is not closeable', () => {
    const wrapper = mountModal({ closeable: false })

    expect(wrapper.findTestId('modal-close').exists()).toBe(false)
  })

  it('emits close on a backdrop click but not on a click inside the dialog', async () => {
    const wrapper = mountModal()

    await wrapper.findTestId('modal-dialog').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.findTestId('modal-backdrop').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('applies the max width as a custom property', () => {
    const wrapper = mountModal({ maxWidth: '900px' })

    expect(wrapper.findTestId('modal-dialog').attributes('style')).toContain('--base-modal-max-width: 900px')
  })
})
