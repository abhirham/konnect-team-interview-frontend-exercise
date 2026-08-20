<template>
  <div
    class="catalog-empty"
    data-testid="no-results"
  >
    <p class="catalog-empty-message">
      No services found
    </p>
    <p
      v-if="query"
      class="catalog-empty-hint"
    >
      Nothing in the catalog matches
      <span class="catalog-empty-query">"{{ query }}"</span>.
    </p>
    <p
      v-else
      class="catalog-empty-hint"
    >
      There are no services in this catalog yet.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ query: string }>()
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.catalog-empty {
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

  .catalog-empty-message {
    color: $color-text-heading;
    font-size: $font-size-card-title;
    font-weight: $font-weight-semibold;
    margin: 0 0 8px;
  }

  .catalog-empty-hint {
    color: $color-text-muted;
    font-size: $font-size-body;
    line-height: 1.5;
    margin: 0 0 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .catalog-empty-query {
    color: $color-text-heading;
    font-weight: $font-weight-semibold;
  }
}
</style>
