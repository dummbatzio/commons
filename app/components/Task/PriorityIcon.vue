<script setup lang="ts">
import { ChevronsDown, ChevronsUp, ChevronUp, Flame } from 'lucide-vue-next';

interface TaskPriorityIconProps {
    priority: string;
}
const { priority } = defineProps<TaskPriorityIconProps>()

const priorityIcons = {
    low: ChevronsDown,
    medium: ChevronUp,
    high: ChevronsUp,
    urgent: Flame

}

const component = computed(() => {
    const index = Object.keys(priorityIcons).find(k => k === priority) as (keyof typeof priorityIcons);
    return index ? priorityIcons[index] : null
})
</script>

<template>
    <component v-if="component" :as="component" />
</template>