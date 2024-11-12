<script setup lang="ts">
import type { Task } from '~/types';

interface TaskListProps {
    tasks: Task[]
}
defineProps<TaskListProps>()
const emit = defineEmits(["refresh"])
</script>

<template>
    <ul class="divide-y-2">
        <li v-for="task in tasks">
            <TasksListItem :task="task" @success="emit('refresh')" />
        </li>
    </ul>
</template>