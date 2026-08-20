<template>
  <div
    class="catalog-error"
    data-testid="catalog-error"
  >
    <span
      aria-hidden="true"
      class="catalog-error-icon"
    >
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M12 8v5"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
        />
        <circle
          cx="12"
          cy="16.5"
          fill="currentColor"
          r="1.25"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </span>
    <p
      class="catalog-error-message"
      data-testid="catalog-error-message"
    >
      Something went wrong. Please try again.
    </p>
    <BaseButton
      data-testid="retry-button"
      label="Retry"
      @click="emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/base_components/BaseButton.vue'

const emit = defineEmits<{ retry: [] }>()
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.catalog-error {
  align-items: center;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  max-width: 440px;
  padding: 40px 32px;
  text-align: center;

  .catalog-error-icon {
    align-items: center;
    background: #fdeeea;
    border-radius: 50%;
    color: $color-danger;
    display: flex;
    height: 48px;
    justify-content: center;
    margin-bottom: 20px;
    width: 48px;
  }

  .catalog-error-message {
    color: $color-text-heading;
    font-size: $font-size-card-title;
    font-weight: $font-weight-semibold;
    line-height: 1.5;
    margin: 0 0 24px;
  }
}
</style>
