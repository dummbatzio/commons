<script setup lang="ts">
import { TaskStatus } from '~/types/tasks';

const { page, limit } = usePagination();
const { data, refresh } = await useAsyncData("tasks-result", async () => GqlGetPaginatedTasks({
    where: {
        parent: null,
        status: [TaskStatus.OPEN]
    },
    skip: (page.value - 1) * limit,
    take: limit
}))
// const totalTasks = computed(() => data.value?.tasks.totalCount)
const tasks = computed(() => data.value?.tasks.items)

const route = useRoute();
watch(() => route.query, () => refresh())
</script>

<template>
    <Container>
        <LayoutSectionHeading>Tasks</LayoutSectionHeading>
        <div v-if="tasks?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TaskCard v-for="task in tasks" :task="task" @assigned="refresh()" />
        </div>
        <div v-else>
            <p class="font-light">Gerade sind keine offenen Aufgaben gepflegt.</p>
        </div>
    </Container>
</template>
