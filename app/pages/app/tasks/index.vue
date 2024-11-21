<script setup lang="ts">
import { Button } from '~/components/ui/button';
import type { Task } from '~/types';

const { page, limit } = usePagination();
const { data, refresh } = await useAsyncData("tasks-result", async () => GqlGetPaginatedTasks({
    skip: (page.value - 1) * limit,
    take: limit
}))
const totalTasks = computed(() => data.value?.tasks.totalCount)
const tasks = computed(() => data.value?.tasks.items)

const dialogData: Ref<{ open: boolean; task: Task | null }> = ref({
    open: false,
    task: null
})

const route = useRoute();
watch(() => route.query, () => refresh())

const onEdit = (task: Task) => {
    dialogData.value = { open: true, task };
}
const onCopy = (task: Task) => {
    const { id, ...taskCopy } = task
    dialogData.value = {
        open: true,
        task: {
            ...taskCopy,
            title: `${taskCopy.title} - KOPIE`
        }
    };
}

const onClose = () => {
    dialogData.value = { open: false, task: null };
}
const onSuccess = () => {
    onClose();
    refresh();
}
</script>

<template>
    <Container>
        <Headline>Tasks
            <template #actions>
                <Button @click="dialogData = { open: true, task: null }">Aufgabe hinzufügen</Button>
            </template>
        </Headline>
        <TasksDataTable :tasks="tasks" :total="totalTasks" @edit="onEdit" @copy="onCopy" @refresh="refresh" />
    </Container>
    <TasksEditDialog :open="dialogData.open" :task="dialogData.task" @close="onClose" @success="onSuccess" />
</template>
