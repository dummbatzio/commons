<script setup lang="ts">
import { Button } from '~/components/ui/button';
import type { Task } from '~/types';

const route = useRoute();
const { p } = route.query
const limit = 25;

const page = computed(() => {
    const pAsInt = parseInt(p as string)
    return isNaN(pAsInt) ? 1 : pAsInt;
})
const { data, refresh } = await useAsyncGql("GetPaginatedTasks", { skip: (page.value - 1) * limit, take: limit })
const tasks = computed(() => data.value?.tasks.items)

const dialogData: Ref<{ open: boolean; task: Task | null }> = ref({
    open: false,
    task: null
})

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
        <TasksDataTable :tasks="tasks" @edit="onEdit" @copy="onCopy" @refresh="refresh" />
    </Container>
    <TasksEditDialog :open="dialogData.open" :task="dialogData.task" @close="onClose" @success="onSuccess" />
</template>
