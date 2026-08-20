import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeveloperAvatars from './DeveloperAvatars.vue'
import { createDeveloper, createVersion } from '../../mocks/factories'
import type { Developer, ServiceVersion } from '@/types'
import '../../mocks/testUtils'

const version = (name: string, updatedAt: string, developer?: Developer): ServiceVersion =>
  createVersion({ id: `version-${name}`, name, developer, updated_at: updatedAt })

const ada = createDeveloper()
const grace = createDeveloper({
  id: 'dev-grace',
  name: 'Grace Hopper',
  email: 'grace.hopper@example.com',
  avatar: 'https://avatars.example.com/dev-grace',
})
const alan = createDeveloper({
  id: 'dev-alan',
  name: 'Alan Turing',
  email: 'alan.turing@example.com',
  avatar: 'https://avatars.example.com/dev-alan',
})

describe('<DeveloperAvatars />', () => {
  it('renders the developer of the newest version first', () => {
    const wrapper = mount(DeveloperAvatars, {
      props: {
        versions: [
          version('1.0.0', '2023-01-01T00:00:00.000Z', ada),
          version('2.0.0', '2023-06-01T00:00:00.000Z', grace),
        ],
      },
    })

    const avatars = wrapper.findAllTestId('developer-avatar')
    expect(avatars).toHaveLength(2)
    expect(avatars[0].attributes('alt')).toBe(grace.name)
    expect(avatars[1].attributes('alt')).toBe(ada.name)
  })

  it('renders developers deduped', () => {
    const wrapper = mount(DeveloperAvatars, {
      props: {
        versions: [
          version('1.0.0', '2023-01-01T00:00:00.000Z', ada),
          version('2.0.0', '2023-06-01T00:00:00.000Z', ada),
        ],
      },
    })

    const avatars = wrapper.findAllTestId('developer-avatar')
    expect(avatars).toHaveLength(1)
    expect(avatars[0].attributes('alt')).toBe(ada.name)
    expect(wrapper.findTestId('developer-overflow').exists()).toBe(false)
  })

  it('renders two avatars then the overflow count for three distinct developers', () => {
    const wrapper = mount(DeveloperAvatars, {
      props: {
        versions: [
          version('1.0.0', '2023-01-01T00:00:00.000Z', alan),
          version('2.0.0', '2023-06-01T00:00:00.000Z', grace),
          version('3.0.0', '2023-09-01T00:00:00.000Z', ada),
        ],
      },
    })

    const avatars = wrapper.findAllTestId('developer-avatar')
    expect(avatars).toHaveLength(2)
    expect(avatars[0].attributes('alt')).toBe(ada.name)
    expect(avatars[1].attributes('alt')).toBe(grace.name)
    expect(wrapper.findTestId('developer-overflow').text()).toBe('+1')
  })

  it('counts deduplicated developers in the overflow, not versions', () => {
    const wrapper = mount(DeveloperAvatars, {
      props: {
        versions: [
          version('1.0.0', '2023-01-01T00:00:00.000Z', alan),
          version('2.0.0', '2023-02-01T00:00:00.000Z', alan),
          version('3.0.0', '2023-06-01T00:00:00.000Z', grace),
          version('4.0.0', '2023-09-01T00:00:00.000Z', ada),
        ],
      },
    })

    expect(wrapper.findTestId('developer-overflow').text()).toBe('+1')
  })

  it('renders no avatars when there are no versions', () => {
    const wrapper = mount(DeveloperAvatars, { props: { versions: [] } })

    expect(wrapper.findTestId('developer-avatars').exists()).toBe(false)
    expect(wrapper.findTestId('developer-avatar').exists()).toBe(false)
  })

  it('renders no avatar for a version without a developer', () => {
    const wrapper = mount(DeveloperAvatars, {
      props: {
        versions: [
          version('1.0.0', '2023-01-01T00:00:00.000Z'),
          version('2.0.0', '2023-06-01T00:00:00.000Z', ada),
        ],
      },
    })

    const avatars = wrapper.findAllTestId('developer-avatar')
    expect(avatars).toHaveLength(1)
    expect(avatars[0].attributes('alt')).toBe(ada.name)
  })
})
