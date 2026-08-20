<template>
  <div
    class="base-modal"
    data-testid="modal-backdrop"
    @click.self="emit('close')"
  >
    <div
      ref="dialog"
      :aria-label="label"
      aria-modal="true"
      class="base-modal-dialog"
      data-testid="modal-dialog"
      role="dialog"
      :style="{ '--base-modal-max-width': maxWidth }"
      tabindex="-1"
    >
      <header
        v-if="$slots.header || closeable"
        class="base-modal-header"
      >
        <slot name="header" />

        <button
          v-if="closeable"
          aria-label="Close"
          class="base-modal-close"
          data-testid="modal-close"
          type="button"
          @click="emit('close')"
        >
          <CrossIcon />
        </button>
      </header>

      <div class="base-modal-body">
        <slot name="body" />
      </div>

      <footer
        v-if="$slots.footer"
        class="base-modal-footer"
      >
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CrossIcon from '@/icons/CrossIcon.vue'

const { closeable = true, maxWidth = '600px' } = defineProps<{
  label: string
  maxWidth?: string
  closeable?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)

let elementBeforeOpen: HTMLElement | null = null

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  elementBeforeOpen = document.activeElement as HTMLElement | null
  dialog.value?.focus()
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  elementBeforeOpen?.focus()
})
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.base-modal {
  align-items: center;
  background: rgb(0 0 0 / 40%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 10;

  .base-modal-dialog {
    background: $color-surface;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: var(--base-modal-max-width);
    overflow: hidden;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  .base-modal-header {
    align-items: center;
    border-bottom: 1px solid $color-border;
    display: flex;
    flex-shrink: 0;
    gap: 16px;
    justify-content: space-between;
    padding: 24px;
  }

  .base-modal-close {
    align-self: flex-start;
    background: none;
    border: 0;
    color: $color-icon-muted;
    cursor: pointer;
    display: flex;
    padding: 4px;

    &:focus-visible {
      outline: 2px solid $color-focus-ring;
      outline-offset: 2px;
    }
  }

  .base-modal-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
  }

  .base-modal-footer {
    border-top: 1px solid $color-border;
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    justify-content: flex-end;
    padding: 16px 24px;
  }
}
</style>
