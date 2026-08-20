<template>
  <div
    aria-hidden="true"
    class="service-card-skeleton"
    data-testid="service-card-skeleton"
  >
    <div class="skeleton-block skeleton-title" />
    <div class="skeleton-block skeleton-line" />
    <div class="skeleton-block skeleton-line skeleton-line-short" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.service-card-skeleton {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;

  .skeleton-block {
    background: $color-surface-muted;
    border-radius: 4px;
  }

  .skeleton-title {
    height: 24px;
    width: 60%;
  }

  .skeleton-line {
    height: 16px;
    width: 100%;
  }

  .skeleton-line-short {
    width: 40%;
  }
}
</style>
