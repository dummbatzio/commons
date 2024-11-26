<script setup lang="ts">
import { TaskStatus } from '~/types/tasks';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-vue-next';
import type { Task } from '~/types';
import { useConfetti } from '~/composables/useConfetti';
import { toast } from '../ui/toast';

const { profile } = useUser();
const { page } = usePagination();
const limit = 100;
const { data, refresh } = await useAsyncData("my-tasks", async () => GqlGetMyPaginatedTasks({
    where: {
        parent: null,
        status: [TaskStatus.PLANNED]
    },
    skip: (page.value - 1) * limit,
    take: limit
}))
// const totalTasks = computed(() => data.value?.tasks.totalCount)
const myTasks = computed(() => data.value?.tasks.items)

const { fireCanon } = useConfetti()
const onComplete = async (task: Task) => {
    let taskId;
    if (task.type === "series") {
        const toBeDone = task.series?.filter(x => [TaskStatus.OPEN, TaskStatus.PLANNED].includes(x.status as TaskStatus))
        if (toBeDone?.length) {
            taskId = toBeDone.at(0)!.id;
        }
    } else {
        taskId = task.id
    }

    try {
        if (!taskId) {
            console.log('no task id given.')
            return;
        }
        const { completeTask } = await GqlCompleteTask({
            taskId
        });

        if (completeTask.status === TaskStatus.DONE) {
            fireCanon()
            toast({
                title: "Yay!",
                description: `Du hast ${task.title} abgeschlossen. Die entsprechenden Repro-Coins wurden dir gutgeschrieben.`
            })
            await refresh()
        }
    } catch (err) {
        console.log(err)
    }
}
const onResign = async (task: Task) => { }
</script>

<template>
    <div>
        <div v-if="myTasks?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TaskCard v-for="task in myTasks" :task="task">
                <template #actions v-if="profile">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                <EllipsisVertical class="h-4 w-4" />
                                <span class="sr-only">Kontextmenü</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-max max-w-64">
                            <DropdownMenuItem @click="onComplete(task)">Aufgabe abschließen</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="onResign(task)">
                                Von Aufgabe zurücktreten
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
            </TaskCard>
        </div>
        <p v-else class="text-sm">Du hast aktuell keine Aufgaben.</p>
    </div>
</template>