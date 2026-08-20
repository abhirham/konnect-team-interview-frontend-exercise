<template>
  <BaseModal
    :label="service.name"
    max-width="900px"
    @close="emit('close')"
  >
    <template #header>
      <ServiceCard
        :service="service"
        variant="summary"
      />
    </template>

    <template #body>
      <section
        class="service-details"
        data-testid="service-details"
      >
        <h3 class="service-details-versions-title">
          Versions ({{ service.versions.length }})
        </h3>

        <ul class="service-details-versions">
          <li
            v-for="version in service.versions"
            :key="version.id"
            class="service-details-version"
            data-testid="details-version"
          >
            <p
              class="service-details-version-name"
              data-testid="version-name"
            >
              v{{ version.name }}
            </p>
            <p
              class="service-details-version-description"
              data-testid="version-description"
            >
              {{ version.description }}
            </p>
            <p
              class="service-details-version-type"
              data-testid="version-type"
            >
              {{ service.type }}
            </p>
            <div class="service-details-version-shipper">
              <img
                v-if="version.developer"
                :alt="version.developer.name"
                class="service-details-version-avatar"
                data-testid="version-developer-avatar"
                :src="version.developer.avatar"
              >
              <div class="service-details-version-shipper-text">
                <p
                  v-if="version.developer"
                  class="service-details-version-developer"
                  data-testid="version-developer"
                >
                  {{ developerName(version.developer.name) }}
                </p>
                <p
                  class="service-details-version-updated"
                  data-testid="version-updated"
                  :title="exactTime(version.updated_at)"
                >
                  {{ relativeTime(version.updated_at) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'
import BaseModal from '@/base_components/BaseModal.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import type { Service } from '@/types'
import { developerName } from '@/utils/developerName'

dayjs.extend(dayjsRelativeTime)

defineProps<{ service: Service }>()

const emit = defineEmits<{ close: [] }>()

const relativeTime = (updatedAt: string): string => dayjs(updatedAt).fromNow()

const exactTime = (updatedAt: string): string => dayjs(updatedAt).format('D MMMM YYYY, h:mm A')

</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.service-details {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 24px 0;

  .service-details-versions-title {
    color: $color-text-heading;
    font-size: 16px;
    font-weight: $font-weight-semibold;
    margin: 0 0 16px;
    padding: 0 24px;
  }

  .service-details-versions {
    list-style: none;
    margin: 0;
    min-height: 0;
    overflow-y: auto;
    padding: 0;
  }

  .service-details-version {
    align-items: center;
    display: flex;
    gap: 16px;
    padding: 16px 24px;

    & + .service-details-version {
      border-top: 1px solid $color-border;
    }
  }

  .service-details-version-name {
    color: $color-text-heading;
    flex: 0 0 56px;
    font-size: $font-size-body;
    font-weight: $font-weight-semibold;
    margin: 0;
  }

  .service-details-version-description {
    color: $color-text-body;
    flex: 1;
    font-size: $font-size-body-small;
    margin: 0;
    min-width: 0;
  }

  .service-details-version-type {
    background: $color-pill-bg;
    border-radius: 4px;
    color: $color-pill-text;
    flex: 0 0 auto;
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    margin: 0;
    padding: 4px 8px;
  }

  .service-details-version-shipper {
    align-items: center;
    display: flex;
    flex: 0 0 168px;
    gap: 8px;
    justify-content: flex-end;
  }

  .service-details-version-avatar {
    background: $color-surface-muted;
    border-radius: 50%;
    flex-shrink: 0;
    height: 24px;
    object-fit: cover;
    width: 24px;
  }

  .service-details-version-developer {
    color: $color-text-heading;
    font-size: $font-size-body-small;
    font-weight: $font-weight-semibold;
    margin: 0;
  }

  .service-details-version-updated {
    color: $color-text-muted;
    font-size: $font-size-small;
    margin: 0;
  }
}

@media (max-width: #{$breakpoint-tablet - 1px}) {
  .service-details {
    .service-details-version {
      flex-wrap: wrap;
      gap: 8px;
    }

    .service-details-version-name {
      flex: 0 0 auto;
      order: 1;
    }

    .service-details-version-type {
      order: 2;
    }

    .service-details-version-description {
      flex: 0 0 100%;
      order: 3;
    }

    .service-details-version-shipper {
      flex: 0 0 100%;
      justify-content: flex-start;
      order: 4;
    }
  }
}
</style>
