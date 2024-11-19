<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { DateTime, Duration } from 'luxon';
import { toast } from '../ui/toast';
import type { ComboboxItem } from '../Form/TagsCombobox.vue';
import type { Task } from '~/types';

const { task } = defineProps<{ open: boolean, task?: Task | null }>()
const emit = defineEmits(["close", "success"])

const form = ref();
const loading = ref(false);

const onSubmit = async (values: any, props: any) => {
    const { category, subcategories, due, expense, ...taskData } = values
    const { resetForm } = props

    loading.value = true

    try {
        await GqlCreateTask({
            input: {
                ...taskData,
                expense: Duration.fromObject({ hours: expense }).shiftTo("minutes").toObject().minutes,
                due: due ? DateTime.fromISO(`${due.date}T${due.time ?? '23:59:59'}`) : null,
                categoryIds: subcategories?.length || category ? [
                    ...subcategories?.map((tc: ComboboxItem) => tc.value) ?? [],
                    category?.value
                ] : undefined
            }
        })

        await resetForm()

        toast({
            title: `${taskData.title}`,
            description: task?.id ? 'Aufgabe bearbeitet.' : 'Du hast eine neue Aufgabe erstellt.',
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
    <Dialog :open="open" @update:open="emit('close')">
        <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>{{ task?.id ? 'Aufgabe bearbeiten' : 'Neue Aufgabe' }}</DialogTitle>
            </DialogHeader>

            <div class="py-4 overflow-y-auto px-6">
                <TasksForm ref="form" :task="task" :loading="loading" @submit="onSubmit" />
            </div>

            <DialogFooter class="p-6 pt-0">
                <Button type="submit" :disabled="loading" @click="form.doSubmit()">Absenden</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>