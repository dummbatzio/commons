<script setup lang="ts">
import { ClockIcon, RocketIcon, ListIcon, FlameIcon, Trash2Icon } from 'lucide-vue-next';
import type { Task } from '~/types';
import { TaskPriority } from '~/types/tasks';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

interface TaskListItemProps {
    task: Task
}
const { task } = defineProps<TaskListItemProps>()
const emit = defineEmits(["success"]);

const loading = ref(false);
const onDelete = async () => {
    const { id } = task
    try {
        await GqlDeleteTask({
            id
        })

        toast({
            title: `${task.title}`,
            description: 'Erfolgreich gelöscht.',
        });

        emit('success')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="py-4 px-2">
        <div class="flex flex-col gap-4 justify-between">
            <div>
                <span class="text-xs text-muted-foreground">{{ task.type }}</span>
                <h3 class="font-medium">{{ task.title }}</h3>
                <div v-if="task.description" class="prose prose-sm mt-4" v-html="task.description" />
            </div>
            <div class="flex items-center justify-between">
                <div class="flex gap-4 text-gray-600">
                    <div class="flex gap-2 items-center">
                        <ClockIcon class="w-3 h-3" />
                        <span class="text-sm">{{ task.expense }}</span>
                    </div>
                    <div class="flex gap-2 items-center">
                        <RocketIcon class="w-3 h-3" />
                        <span class="text-sm">{{ task.factor }}</span>
                    </div>
                    <div class="flex gap-2 items-center">
                        <FlameIcon class="w-3 h-3" />
                        <span class="text-sm">{{ Object.values(TaskPriority)[task.priority ?? 0] }}</span>
                    </div>
                    <div v-if="task.categories?.length" class="flex gap-2 items-center">
                        <ListIcon class="w-3 h-3" />
                        <span class="text-sm">{{ task.categories.map(c => c.name).join(", ") }}</span>
                    </div>
                </div>
                <div class="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" @click="onDelete">
                        <Trash2Icon class="text-destructive w-4 h-4" />
                    </Button>
                    <TasksEditSheet :task="task" @success="emit('success')" />
                </div>
            </div>
        </div>

    </div>
</template>