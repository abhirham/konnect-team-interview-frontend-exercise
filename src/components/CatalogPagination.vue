<template>
  <nav
    aria-label="Service pages"
    class="catalog-pagination"
  >
    <button
      aria-label="Previous page"
      class="pagination-button"
      data-testid="pagination-previous"
      :disabled="!hasPrevious"
      type="button"
      @click="$emit('previous')"
    >
      <ArrowLeft />
    </button>

    <p
      class="pagination-count"
      data-testid="pagination-count"
    >
      <span class="pagination-range">{{ rangeStart }} to {{ rangeEnd }}</span>
      of {{ total }} services
    </p>

    <button
      aria-label="Next page"
      class="pagination-button"
      data-testid="pagination-next"
      :disabled="!hasNext"
      type="button"
      @click="$emit('next')"
    >
      <ArrowRight />
    </button>
  </nav>
</template>

<script setup lang="ts">
import ArrowLeft from '@/icons/ArrowLeft.vue'
import ArrowRight from '@/icons/ArrowRight.vue'

defineProps<{
  rangeStart: number
  rangeEnd: number
  total: number
  hasPrevious: boolean
  hasNext: boolean
}>()

defineEmits<{
  previous: []
  next: []
}>()
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.catalog-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 40px 0 8px;

  .pagination-button {
    align-items: center;
    background: transparent;
    border: 1px solid #a6c6ff;
    border-radius: 50%;
    color: #0044f4;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 40px;

    &:disabled {
      border-color: $color-border;
      color: #b6b6bd;
      cursor: default;
    }

    &:focus-visible {
      outline: 2px solid $color-focus-ring;
      outline-offset: 2px;
    }
  }

  .pagination-count {
    color: $color-text-muted;
    font-size: $font-size-body;
    margin: 0;
  }

  .pagination-range {
    color: $color-text-heading;
    font-weight: $font-weight-semibold;
  }
}
</style>
