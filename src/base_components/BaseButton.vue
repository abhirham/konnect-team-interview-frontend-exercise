<template>
  <button
    :class="['base-button', { rounded }]"
    :style="{ background, color }"
    :type="type ?? 'button'"
  >
    <component
      :is="prependIcon"
      v-if="prependIcon"
    />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  background?: string
  color?: string
  rounded?: boolean
  prependIcon?: Component
  type?: 'button' | 'submit'
}>()
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.base-button {
  background: #07a88d;
  border: 0;
  border-radius: 4px;
  color: $color-header-text;
  cursor: pointer;
  display: inline-flex;
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  gap: 6px;
  padding: 10px 16px;
  white-space: nowrap;

  &:hover {
    background: #068f77;
  }

  &:focus-visible {
    outline: 2px solid $color-focus-ring;
    outline-offset: 2px;
  }
}

.rounded {
  border-radius: 20px;
}
</style>
