<script setup lang="ts">
const route = useRoute();
const { p } = route.query
const limit = 25;

const { data, refresh } = await useAsyncGql("GetPaginatedTasks", { skip: 0, take: 25 })
const tasks = computed(() => data.value?.tasks.items)
</script>

<template>
    <Container>
        <Headline>Tasks
            <template #actions>
                <TasksAddSheet @success="refresh" />
            </template>
        </Headline>
        <TasksList :tasks="tasks" />
    </Container>
</template>
