<template>
  <article
    class="service-card"
    :class="{ 'is-summary': isSummary }"
    :data-testid="isSummary ? 'service-summary' : 'service-card'"
    :role="isSummary ? undefined : 'button'"
    :tabindex="isSummary ? undefined : 0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <div class="service-card-header">
      <p
        class="service-card-status"
        :class="`status-${status.key}`"
        data-testid="service-status"
      >
        <component :is="status.icon" />
        {{ status.label }}
      </p>
      <p
        v-if="!isSummary && versionCount"
        class="service-card-version-count"
        data-testid="service-version-count"
      >
        {{ versionCount }}
      </p>
    </div>
    <h2
      class="service-card-name"
      data-testid="service-name"
    >
      {{ service.name }}
    </h2>
    <p
      v-if="service.description"
      class="service-card-description"
      data-testid="service-description"
    >
      {{ service.description }}
    </p>
    <div class="flex-1" />
    <div class="service-card-header-meta">
      <p
        v-if="status.key === 'in-progress'"
        class="service-card-not-configured"
        data-testid="not-configured"
      >
        Not configured with runtime yet
      </p>
      <dl
        v-else
        class="service-card-metrics"
        data-testid="service-metrics"
      >
        <div data-testid="metric-latency">
          <dt>{{ metrics.latency }}</dt>
          <dd>Latency</dd>
        </div>
        <div data-testid="metric-uptime">
          <dt>{{ metrics.uptime }}</dt>
          <dd>Uptime</dd>
        </div>
        <div class="d-flex no-dot">
          <div data-testid="metric-requests">
            <dt>{{ metrics.requests }}</dt>
            <dd>Requests</dd>
          </div>
          ·
          <div
            class="no-dot"
            data-testid="metric-errors"
          >
            <dt>{{ metrics.errors }}</dt>
            <dd>Errors</dd>
          </div>
        </div>
      </dl>
      <DeveloperAvatars
        v-if="!isSummary"
        :versions="service.versions"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import DeveloperAvatars from '@/components/DeveloperAvatars.vue'
import useServiceSummary from '@/composables/useServiceSummary'
import type { Service } from '@/types'

const { service, variant = 'card' } = defineProps<{
  service: Service
  variant?: 'card' | 'summary'
}>()

const emit = defineEmits<{ select: [] }>()

const { status, metrics } = useServiceSummary(toRef(() => service))

const isSummary = computed((): boolean => variant === 'summary')

const activate = (): void => {
  if (!isSummary.value) {
    emit('select')
  }
}

const versionCount = computed((): string => {
  const count = service.versions.length
  if (status.value.key === 'in-progress' || count === 0) {
    return ''
  }
  return count === 1 ? '1 version' : `${count} versions`
})
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.flex-1 {
  flex: 1;
}

.service-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;

  &:focus-visible {
    outline: 2px solid $color-focus-ring;
    outline-offset: 2px;
  }

  &.is-summary {
    background: none;
    border: 0;
    border-radius: 0;
    cursor: default;
    padding: 0;
  }

  .service-card-header {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }

  .service-card-header-meta {
    align-items: end;
    display: flex;
    justify-content: space-between;
  }

  .service-card-status {
    align-items: center;
    color: $color-text-heading;
    display: flex;
    font-size: $font-size-small;
    font-weight: $font-weight-regular;
    gap: 4px;
    margin: 0;
  }

  .service-card-name {
    color: $color-text-heading;
    font-size: $font-size-card-title;
    font-weight: $font-weight-semibold;
    margin: 0;
  }

  .d-flex {
    align-items: center;
    display: flex;
  }

  .service-card-description {
    color: $color-text-body;
    font-size: $font-size-body-small;
    margin: 0;
  }

  .service-card-metrics div,
  .service-card-not-configured {
    align-items: center;
    display: flex;
    gap: 4px;

    &:not(.no-dot)::before {
      background: #42D782;
      border-radius: 50%;
      content: "";
      height: 6px;
      margin-right: 4px;
      width: 6px;
    }
  }

  .service-card-not-configured {
    color: $color-text-body;
    font-size: $font-size-small;
    margin: 0;

    &:not(.no-dot)::before {
      background: $color-text-body;
    }
  }

  .service-card-metrics {
    display: flex;
    flex-direction: column;
    gap: 8px 20px;
    margin: 0;

    dt {
      color: $color-text-heading;
      font-size: $font-size-small;
      font-weight: $font-weight-semibold;
    }

    dd {
      color: $color-text-body;
      font-size: $font-size-small;
      margin: 0;
    }
  }

  .service-card-version-count {
    background: $color-pill-bg;
    border-radius: 16px;
    color: $color-pill-text;
    font-size: $font-size-small;
    margin: 0;
    padding: 8px 16px;
  }
}
</style>
