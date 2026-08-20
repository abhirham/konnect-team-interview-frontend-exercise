import { DOMWrapper, VueWrapper, enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

enableAutoUnmount(afterEach)

const testIdSelector = (testId: string): string => `[data-testid="${testId}"]`


function findTestId(this: VueWrapper | DOMWrapper<Node>, testId: string) {
  return this.find(testIdSelector(testId))
}


function getTestId(this: VueWrapper | DOMWrapper<Node>, testId: string) {
  return this.get(testIdSelector(testId))
}

function findAllTestId(this: VueWrapper | DOMWrapper<Node>, testId: string) {
  return this.findAll(testIdSelector(testId))
}

VueWrapper.prototype.getTestId = getTestId
VueWrapper.prototype.findAllTestId = findAllTestId
DOMWrapper.prototype.findTestId = findTestId
DOMWrapper.prototype.getTestId = getTestId
DOMWrapper.prototype.findAllTestId = findAllTestId


declare module '@vue/test-utils' {
  export class VueWrapper {
    getTestId<K extends keyof HTMLElementTagNameMap>(testId: string): DOMWrapper<HTMLElementTagNameMap[K]>
    findAllTestId<K extends keyof HTMLElementTagNameMap>(testId: string): Array<DOMWrapper<HTMLElementTagNameMap[K]>>
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMWrapper<NodeType extends Node> {
    findTestId<K extends keyof HTMLElementTagNameMap>(testId: string): DOMWrapper<HTMLElementTagNameMap[K]>
    getTestId<K extends keyof HTMLElementTagNameMap>(testId: string): DOMWrapper<HTMLElementTagNameMap[K]>
    findAllTestId<K extends keyof HTMLElementTagNameMap>(testId: string): Array<DOMWrapper<HTMLElementTagNameMap[K]>>
  }
}
