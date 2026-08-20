<template>
  <div
    v-if="developers.length"
    class="developer-avatars"
    data-testid="developer-avatars"
  >
    <img
      v-for="(developer, index) in visibleDevelopers"
      :key="developer.id"
      :alt="developer.name"
      class="developer-avatars-face"
      data-testid="developer-avatar"
      :src="developer.avatar"
      :style="{ zIndex: visibleDevelopers.length - index }"
      :title="developer.name"
    >
    <span
      v-if="overflowCount"
      class="developer-avatars-overflow"
      data-testid="developer-overflow"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Developer, ServiceVersion } from '@/types'

const MAX_AVATARS = 2

const props = defineProps<{ versions: ServiceVersion[] }>()

const developers = computed((): Developer[] => {
  const newestFirst = [...props.versions].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )
  const seen = new Set<string>()
  const unique: Developer[] = []

  for (const version of newestFirst) {
    const { developer } = version
    if (!developer || seen.has(developer.id)) {
      continue
    }
    seen.add(developer.id)
    unique.push(developer)
  }

  return unique
})

const visibleDevelopers = computed((): Developer[] => developers.value.slice(0, MAX_AVATARS))

const overflowCount = computed((): number => developers.value.length - visibleDevelopers.value.length)
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.developer-avatars {
  align-items: center;
  display: flex;

  .developer-avatars-face {
    background: $color-surface-muted;
    border: 2px solid $color-surface;
    border-radius: 50%;
    height: 36px;
    object-fit: cover;
    position: relative;
    width: 36px;

    & + .developer-avatars-face {
      margin-left: -8px;
    }
  }

  .developer-avatars-overflow {
    align-items: center;
    background: $color-surface-muted;
    border: 2px solid $color-surface;
    border-radius: 50%;
    color: $color-text-body;
    display: flex;
    font-size: $font-size-small;
    height: 36px;
    justify-content: center;
    margin-left: -8px;
    position: relative;
    width: 36px;
    z-index: 0;
  }
}
</style>
