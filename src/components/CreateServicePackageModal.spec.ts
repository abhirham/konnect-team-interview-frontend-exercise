import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateServicePackageModal from './CreateServicePackageModal.vue'
import '../../mocks/testUtils'

describe('<CreateServicePackageModal />', () => {
  it('emits the typed values on submit', async () => {
    const wrapper = mount(CreateServicePackageModal)

    await wrapper.findTestId('create-package-title').setValue('Billing')
    await wrapper.findTestId('create-package-description').setValue('Invoices and refunds')
    await wrapper.findTestId('create-package').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([
      [{ title: 'Billing', description: 'Invoices and refunds' }],
    ])
  })

  it('blocks submit and shows errors when fields are blank', async () => {
    const wrapper = mount(CreateServicePackageModal)

    await wrapper.findTestId('create-package').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Title is required')
    expect(wrapper.text()).toContain('Description is required')
  })

  it('treats whitespace-only input as empty', async () => {
    const wrapper = mount(CreateServicePackageModal)

    await wrapper.findTestId('create-package-title').setValue('   ')
    await wrapper.findTestId('create-package-description').setValue('Invoices')
    await wrapper.findTestId('create-package').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Title is required')
    expect(wrapper.text()).not.toContain('Description is required')
  })

  it('clears the error once a valid value is entered', async () => {
    const wrapper = mount(CreateServicePackageModal)

    await wrapper.findTestId('create-package').trigger('submit')
    await wrapper.findTestId('create-package-title').setValue('Billing')
    await wrapper.findTestId('create-package-description').setValue('Invoices')
    await wrapper.findTestId('create-package').trigger('submit')

    expect(wrapper.text()).not.toContain('is required')
    expect(wrapper.emitted('submit')).toEqual([
      [{ title: 'Billing', description: 'Invoices' }],
    ])
  })
})
