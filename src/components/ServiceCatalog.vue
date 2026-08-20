<template>
  <div class="service-catalog">
    <header class="catalog-header">
      <div class="catalog-heading">
        <h1 class="catalog-title">
          Service Hub
        </h1>
        <p class="catalog-subtitle">
          Organize services, manage and track versioning and API service
          documentation.
        </p>
      </div>
      <div class="catalog-actions">
        <BaseInput
          v-model="searchQuery"
          clearable
          data-testid="search-input"
          :loading="loading && !initialLoading"
          placeholder="Search"
          :prepend-icon="SearchIcon"
          width="100%"
        />
        <BaseButton
          data-testid="create-service-package"
          label="Service Package"
          :prepend-icon="PlusIcon"
          rounded
          @click="createPackageOpen = true"
        />
      </div>
    </header>

    <CatalogError
      v-if="error"
      @retry="retry"
    />

    <div
      v-else-if="initialLoading || services.length"
      class="catalog-grid"
    >
      <template v-if="initialLoading">
        <ServiceCardSkeleton
          v-for="index in SKELETON_CARD_COUNT"
          :key="index"
        />
      </template>
      <template v-else>
        <ServiceCard
          v-for="service in pageServices"
          :key="service.id"
          :service="service"
          @select="openService(service)"
        />
      </template>
    </div>

    <CatalogEmpty
      v-else
      :query="resultsQuery"
    />

    <CatalogPagination
      v-if="!error && pageCount > 1"
      :has-next="hasNext"
      :has-previous="hasPrevious"
      :range-end="rangeEnd"
      :range-start="rangeStart"
      :total="services.length"
      @next="goToNext"
      @previous="goToPrevious"
    />

    <ServiceDetailsModal
      v-if="selectedService"
      :service="selectedService"
      @close="closeService"
    />

    <CreateServicePackageModal
      v-if="createPackageOpen"
      @close="createPackageOpen = false"
      @submit="onCreatePackage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/base_components/BaseButton.vue'
import BaseInput from '@/base_components/BaseInput.vue'
import CatalogEmpty from '@/components/CatalogEmpty.vue'
import CatalogError from '@/components/CatalogError.vue'
import CatalogPagination from '@/components/CatalogPagination.vue'
import CreateServicePackageModal from '@/components/CreateServicePackageModal.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import ServiceCardSkeleton from '@/components/ServiceCardSkeleton.vue'
import ServiceDetailsModal from '@/components/ServiceDetailsModal.vue'
import usePagination from '@/composables/usePagination'
import useSelectedService from '@/composables/useSelectedService'
import useServices from '@/composables/useServices'
import PlusIcon from '@/icons/PlusIcon.vue'
import SearchIcon from '@/icons/SearchIcon.vue'
import type { ServicePackageDraft } from '@/types'

const SKELETON_CARD_COUNT = 6

const { services, loading, initialLoading, error, searchQuery, resultsQuery, retry } = useServices()

const {
  page,
  pageItems: pageServices,
  pageCount,
  rangeStart,
  rangeEnd,
  hasPrevious,
  hasNext,
  goToPrevious,
  goToNext,
} = usePagination(services)

watch(page, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const { selectedService, openService, closeService } = useSelectedService(services)

const createPackageOpen = ref(false)

const onCreatePackage = (draft: ServicePackageDraft): void => {
  console.info('Create service package', draft)
  createPackageOpen.value = false
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.service-catalog {
  margin: 0 auto;
  max-width: 1366px;
  padding: 0 20px 40px;

  .catalog-header {
    align-items: flex-start;
    display: flex;
    gap: 24px;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .catalog-title {
    color: $color-text-heading;
    font-size: 32px;
    font-weight: $font-weight-bold;
    margin: 0 0 8px;
  }

  .catalog-subtitle {
    color: $color-text-muted;
    font-size: $font-size-body;
    margin: 0;
  }

  .catalog-actions {
    align-items: center;
    display: flex;
    gap: 16px;
  }

  .catalog-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1023px) {
    .catalog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: #{$breakpoint-tablet - 1px}) {
    .catalog-header {
      flex-direction: column;
      gap: 16px;
    }

    .catalog-actions {
      align-items: flex-end;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .catalog-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
