<script setup lang="ts">
import type { Task } from '~/types';

interface TaskListProps {
    tasks: Task[]
}
defineProps<TaskListProps>()
const emit = defineEmits(["refresh"])
</script>

<template>
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="task in tasks">
            <TasksListItem :task="task" @success="emit('refresh')" />
        </li>
    </ul>
</template>