<script setup lang="ts">
import { CalendarIcon, FlameIcon } from 'lucide-vue-next';
import type { Task } from '~/types';
import { TaskStatus } from '~/types/tasks';

interface AssignmentListItemProps {
    task: Task
}
const { task } = defineProps<AssignmentListItemProps>()

const categories = computed(() => [
    ...task.categories?.filter(c => !c.parent) ?? [],
    ...task.categories?.filter(c => !!c.parent) ?? [],
])
const due = computed(() => {
    if (task.type === "series") {
        const next = nextTasks.value?.at(0);
        if (next?.due) {
            return next.due.toString()
        }
    }

    if (task.type === "single" && task.due) {
        return task.due.toString()
    }

    return null
})

const showNextTasks = ref(false)
const nextTasks = computed(() => {
    if (task.type !== "series" || !task.series?.length) {
        return null;
    }
    return task.series?.filter(x => [TaskStatus.OPEN, TaskStatus.PLANNED].includes(x.status as TaskStatus))
})
</script>

<template>
    <div class="relative flex gap-x-6 py-6 xl:static">
        <!-- <img :src="imageUrl" alt="" class="size-14 flex-none rounded-full" /> -->
        <div class="flex-auto">
            <!-- <div v-if="categories" class="flex gap-2 items-center -mx-1">
                <template v-for="category in categories">
                    <Badge :variant="category.parent ? 'outline' : 'default'">{{ category.name }}</Badge>
                </template>
</div> -->
            <h3 class="font-semibold text-gray-900 text-xl">{{ task.title }}</h3>
            <dl class="-mx-2 mt-2 flex flex-col text-gray-500 xl:flex-row xl:divide-x-2 xl:divide-gray-400">
                <div class="flex items-start gap-x-1 px-2">
                    <dt class="mt-0.5">
                        <span class="sr-only">Priorität</span>
                        <FlameIcon class="size-5 text-gray-400" aria-hidden="true" />
                    </dt>
                    <dd>
                        <span>{{ task.priority }}</span>
                    </dd>
                </div>
                <div v-if="due" class="flex items-start gap-x-1 px-2">
                    <dt class="mt-0.5">
                        <span class="sr-only">Date</span>
                        <CalendarIcon class="size-5 text-gray-400" aria-hidden="true" />
                    </dt>
                    <dd>
                        <time :datetime="due">{{ formatISODateTime(due) }}</time>
                    </dd>
                </div>
                <div class="flex items-center gap-2 px-2">
                    <span>{{ task.type === 'series' ? "Aufgabenserie" : "Einzelaufgabe" }}</span>
                    <span v-if="nextTasks">-</span>
                    <Dialog v-if="nextTasks">
                        <DialogTrigger>
                            Nächste Termine
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Weitere Termine</DialogTitle>
                            </DialogHeader>
                            <dl class="text-gray-500">
                                <template v-for="t in nextTasks.slice(1)">
                                    <div v-if="t.due" class="flex items-start gap-x-2">
                                        <dt class="mt-0.5">
                                            <span class="sr-only">Date</span>
                                            <CalendarIcon class="size-5 text-gray-400" aria-hidden="true" />
                                        </dt>
                                        <dd>
                                            <time :datetime="t.due.toString()">{{ formatISODateTime(t.due.toString())
                                                }}</time>
                                        </dd>
                                    </div>
                                </template>
                            </dl>
                        </DialogContent>
                    </Dialog>
                </div>
                <!-- <div
                    class="mt-2 flex items-start gap-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400/50 xl:pl-3.5">
                    <dt class="mt-0.5">
                        <span class="sr-only">Location</span>
                        <MapPinIcon class="size-5 text-gray-400" aria-hidden="true" />
                    </dt>
                    <dd>{{ task.location }}</dd>
                </div> -->
            </dl>
        </div>
        <div v-if="$slots.actions">
            <slot name="actions" />
        </div>
    </div>
</template>