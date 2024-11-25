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
import { Button } from '../ui/button';
import { Dumbbell, HandCoins } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { toast } from '../ui/toast';

interface TaskCard {
    task: Task
}
const { task } = defineProps<TaskCard>()
const emit = defineEmits(["assigned"])

const { user, profile } = useUser()
const loading = ref(false);

const categories = computed(() => [
    ...task.categories?.filter(c => !c.parent) ?? [],
    ...task.categories?.filter(c => !!c.parent) ?? [],
])
const dueFormatted = computed(() => {
    if (task.type === "series" && task.series?.length && task.series?.at(0)?.due) {
        const nextDue = DateTime.fromISO(task.series!.at(0)!.due!.toString());
        return `Nächste Aufgabe fällig am ${nextDue.toLocaleString(DateTime.DATETIME_SHORT)}`
    }

    if (task.type === "single" && task.due) {
        const due = DateTime.fromISO(task.due.toString());
        return `Fällig am ${due.toLocaleString(DateTime.DATETIME_SHORT)}`
    }

    return null
})
const onAssign = async () => {
    if (!profile.value?.id || !task?.id) {
        return;
    }

    loading.value = true;

    try {
        await GqlAssignTask({
            input: {
                profileId: profile.value.id,
                taskId: task.id
            }
        })

        toast({
            title: "Woohoo! Danke, dass du ein Teil bist.",
            description: `Du hast die Aufgabe "${task.title}" übernommen. Weitere Informationen findest du in deinem Profil.`
        })
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }


}
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
                        <span>{{ useFormatReproduction(task.expense, true) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <HandCoins class="w-4 h-4" />
                        <span>{{ useFormatReproduction(task.expense * (task.factor ?? 1)) }}</span>
                    </div>
                </div>
                <div v-if="profile && task.status === 'open'">
                    <Button @click="onAssign" :disabled="loading">Annehmen</Button>
                </div>
            </div>
        </CardFooter>
    </Card>
</template>