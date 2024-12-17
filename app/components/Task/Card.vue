<script setup lang="ts">
import type { Task } from '~/types';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '../ui/badge';
import { Dumbbell, HandCoins } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { TaskStatus } from '~/types/tasks';

interface TaskCard {
    task: Task
}
const { task } = defineProps<TaskCard>()

const categories = computed(() => [
    ...task.categories?.filter(c => !c.parent) ?? [],
    ...task.categories?.filter(c => !!c.parent) ?? [],
])
const dueFormatted = computed(() => {
    if (task.type === "series") {
        const toBeDone = task.series?.filter(x => [TaskStatus.OPEN, TaskStatus.PLANNED].includes(x.status as TaskStatus))
        if (toBeDone?.length && toBeDone.at(0)?.due) {
            const nextDue = DateTime.fromISO(toBeDone.at(0)!.due!.toString());
            return `Nächste Aufgabe fällig am ${nextDue.toLocaleString(DateTime.DATETIME_SHORT)}`
        }
    }

    if (task.type === "single" && task.due) {
        const due = DateTime.fromISO(task.due.toString());
        return `Fällig am ${due.toLocaleString(DateTime.DATETIME_SHORT)}`
    }

    return null
})
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center gap-1">
                <TaskPriorityIcon :priority="task.priority" />
                <span>{{ task.title }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-2">
            <div v-if="categories" class="flex gap-2 items-center">
                <template v-for="category in categories">
                    <Badge :variant="category.parent ? 'outline' : 'default'">{{ category.name }}</Badge>
                </template>
            </div>
            <div>
                <p class="font-medium">{{ task.type === 'series' ? "Aufgabenserie" : "Einzelaufgabe" }}</p>
                <p v-if="dueFormatted" class="text-sm">{{ dueFormatted }}</p>
            </div>
        </CardContent>
        <CardFooter>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <Dumbbell class="w-4 h-4" />
                        <span>{{ useFormatReproduction(task.expense, { showMinutes: true }) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <HandCoins class="w-4 h-4" />
                        <span>{{ useFormatReproduction(task.expense * (task.factor ?? 1), { showUnit: true }) }}</span>
                    </div>
                </div>
                <div v-if="$slots.actions">
                    <slot name="actions" />
                </div>
            </div>
        </CardFooter>
    </Card>
</template>