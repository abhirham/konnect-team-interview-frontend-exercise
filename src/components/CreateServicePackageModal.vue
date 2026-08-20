<template>
  <BaseModal
    label="Create Service Package"
    max-width="480px"
    @close="emit('close')"
  >
    <template #header>
      <h2 class="create-package-title">
        Create Service Package
      </h2>
    </template>

    <template #body>
      <form
        id="create-package-form"
        class="create-package"
        data-testid="create-package"
        @submit.prevent="onSubmit"
      >
        <BaseInput
          v-model="title"
          data-testid="create-package-title"
          :error="errors.title"
          label="Title"
        />
        <BaseInput
          v-model="description"
          data-testid="create-package-description"
          :error="errors.description"
          label="Description"
          multiline
          rows="4"
        />
      </form>
    </template>

    <template #footer>
      <BaseButton
        background="var(--cancel-background)"
        class="create-package-cancel"
        color="var(--cancel-color)"
        data-testid="create-package-cancel"
        label="Cancel"
        @click="emit('close')"
      />
      <BaseButton
        data-testid="create-package-submit"
        form="create-package-form"
        label="Create"
        type="submit"
      />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from '@/base_components/BaseButton.vue'
import BaseInput from '@/base_components/BaseInput.vue'
import BaseModal from '@/base_components/BaseModal.vue'
import type { ServicePackageDraft } from '@/types'

const emit = defineEmits<{
  close: []
  submit: [draft: ServicePackageDraft]
}>()

const title = ref('')
const description = ref('')

const errors = reactive({
  title: '',
  description: '',
})

const onSubmit = (): void => {
  errors.title = title.value.trim() ? '' : 'Title is required'
  errors.description = description.value.trim() ? '' : 'Description is required'

  if (errors.title || errors.description) {
    return
  }

  emit('submit', { title: title.value, description: description.value })
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.create-package-title {
  color: $color-text-heading;
  font-size: $font-size-card-title;
  font-weight: $font-weight-semibold;
  margin: 0;
}

.create-package-cancel {
  --cancel-background: transparent;
  --cancel-color: #{$color-text-body};

  border: 1px solid $color-border;
}

.create-package {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  padding: 24px;
}
</style>
