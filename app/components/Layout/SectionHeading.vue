<template>
    <div class="mb-6">
        <div class="space-y-1 mb-2">
            <h3 class="text-lg font-medium">
                <slot />
            </h3>
            <div v-if="$slots.description" class="text-sm text-muted-foreground">
                <slot name="description" />
            </div>
        </div>
        <Separator />
    </div>
</template>