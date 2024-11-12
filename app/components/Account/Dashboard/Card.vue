<script setup lang="ts">
import { Card, CardHeader } from '~/components/ui/card';

defineProps<{
    title: string;
}>()
</script>

<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
                {{ title }}
            </CardTitle>
            <slot name="card-icon" />
        </CardHeader>
        <CardContent>
            <slot />
        </CardContent>
    </Card>
</template>
