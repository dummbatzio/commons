<script setup lang="ts">
import type { Task } from '~/types';
import { TaskStatus } from '~/types/tasks';
import { toast } from '../ui/toast';
import { Button } from '../ui/button';

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

const { user } = useUser()
const loading = ref(false);
const onAssign = async (task: Task) => {
    if (!user.value?.id || !task?.id) {
        return;
    }

    loading.value = true;

    try {
        await GqlAssignTask({
            input: {
                userId: user.value.id,
                taskId: task.id
            }
        })

        toast({
            title: "Woohoo! Danke, dass du ein Teil bist.",
            description: `Du hast die Aufgabe "${task.title}" übernommen. Weitere Informationen findest du in deinem Profil.`
        })

        await refresh()
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div v-if="tasks?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TaskCard v-for="task in tasks" :task="task">
            <template #actions v-if="user && task.status === 'open'">
                <Button @click="onAssign(task)" :disabled="loading">Annehmen</Button>
            </template>
        </TaskCard>
    </div>
    <div v-else>
        <p class="font-light">Gerade sind keine offenen Aufgaben gepflegt.</p>
    </div>
</template>