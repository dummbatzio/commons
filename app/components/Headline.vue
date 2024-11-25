<script setup lang="ts">
interface HeadlineProps {
    description?: string
    hideSeparator?: boolean
}
defineProps<HeadlineProps>()
</script>

<template>
    <div class="flex items-end justify-between">
        <div class="space-y-1">
            <h3 class="text-lg font-medium">
                <slot />
            </h3>
            <p v-if="description" class="text-sm text-muted-foreground" v-html="description" />
        </div>
        <div v-if="$slots.actions">
            <slot name="actions" />
        </div>
    </div>
    <Separator v-if="!hideSeparator" class="mt-2 mb-6" />
</template>