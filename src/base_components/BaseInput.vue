<template>
  <div
    class="base-input"
    :style="{ width }"
  >
    <label
      v-if="label"
      class="base-input-label"
      :for="fieldId"
    >
      {{ label }}
    </label>

    <div class="base-input-control">
      <component
        :is="prependIcon"
        v-if="prependIcon"
        class="base-input-icon"
      />
      <textarea
        v-if="multiline"
        :id="fieldId"
        v-bind="$attrs"
        v-model="model"
        :aria-describedby="error ? errorId : undefined"
        :aria-invalid="error ? true : undefined"
        :aria-label="label ? undefined : placeholder"
        class="base-input-field is-multiline"
        :class="{ 'has-error': error }"
        :placeholder="placeholder"
      />
      <input
        v-else
        :id="fieldId"
        v-bind="$attrs"
        v-model="model"
        :aria-describedby="error ? errorId : undefined"
        :aria-invalid="error ? true : undefined"
        :aria-label="label ? undefined : placeholder"
        class="base-input-field"
        :class="{ 'has-prepend-icon': prependIcon, 'has-clear-button': clearable, 'has-error': error }"
        :placeholder="placeholder"
      >
      <button
        v-if="clearable && model"
        :aria-label="`Clear ${fieldName}`"
        class="base-input-clear"
        data-testid="clear-input"
        type="button"
        @click="model = ''"
      >
        <CrossIcon />
      </button>
      <span
        v-if="loading"
        aria-hidden="true"
        class="base-input-progress"
        data-testid="input-progress"
      />
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="base-input-error"
      data-testid="input-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import type { Component } from 'vue'
import CrossIcon from '@/icons/CrossIcon.vue'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  label?: string
  prependIcon?: Component
  clearable?: boolean
  placeholder?: string
  multiline?: boolean
  error?: string
  loading?: boolean
  width?: string
}>()

defineOptions({
  inheritAttrs: false,
})

const fieldId = useId()
const errorId = `${fieldId}-error`

const fieldName = computed((): string => props.label ?? props.placeholder ?? '')
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.base-input {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .base-input-label {
    color: $color-text-heading;
    font-size: $font-size-body;
    font-weight: $font-weight-semibold;
  }

  .base-input-control {
    align-items: center;
    display: flex;
    position: relative;
  }

  .base-input-icon {
    left: 10px;
    pointer-events: none;
    position: absolute;
  }

  .base-input-field {
    border: 1px solid $color-border;
    border-radius: 4px;
    box-sizing: border-box;
    color: $color-text-heading;
    font-family: $font-family-base;
    font-size: $font-size-body;
    padding: 10px;
    width: 100%;

    &.has-prepend-icon {
      padding-left: 34px;
    }

    &.has-clear-button {
      padding-right: 34px;
    }

    &.is-multiline {
      resize: vertical;
    }

    &:focus-visible {
      outline: 2px solid $color-focus-ring;
    }

    &.has-error {
      border-color: $color-danger;
    }
  }

  .base-input-progress {
    bottom: 1px;
    height: 2px;
    left: 1px;
    overflow: hidden;
    position: absolute;
    right: 1px;

    &::after {
      animation: base-input-progress-slide 1200ms ease-in-out infinite;
      background: #0044f4;
      content: '';
      display: block;
      height: 100%;
      width: 40%;
    }
  }

  @keyframes base-input-progress-slide {
    from {
      transform: translateX(-100%);
    }

    to {
      transform: translateX(250%);
    }
  }

  .base-input-error {
    color: $color-danger;
    font-size: $font-size-body;
    margin: 0;
  }

  .base-input-clear {
    align-items: center;
    background: none;
    border: none;
    border-radius: 4px;
    color: $color-icon-muted;
    cursor: pointer;
    display: flex;
    padding: 2px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);

    &:focus-visible {
      outline: 2px solid $color-focus-ring;
    }
  }
}
</style>
