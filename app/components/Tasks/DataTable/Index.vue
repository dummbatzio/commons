<script setup lang="ts">
import DataTable from '~/components/ui/DataTable.vue';
import type { Task } from '~/types';
import { columns } from './columns';

interface TaskListProps {
    tasks: Task[]
}
defineProps<TaskListProps>()
const emit = defineEmits(["edit", "copy", "refresh"])

const onEdit = (task: Task) => emit("edit", task);
const onCopy = (task: Task) => emit("copy", task);
const onDelete = () => emit("refresh");
</script>

<template>
    <div>
        <DataTable :columns="columns({ onEdit, onCopy, onDelete })" :data="tasks ?? []" />
    </div>
</template>