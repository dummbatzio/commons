<script setup lang="ts">
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../ui/button';
import type { Task } from '~/types';
import { toast } from '../ui/toast';
import { DateTime } from 'luxon';
import type { ComboboxItem } from '../Form/TagsCombobox.vue';

defineProps<{ task: Task }>()
const emit = defineEmits(["success"])

const loading = ref(false);
const open = ref(false);

const onSubmit = async (values: any, props: any) => {
    const { categories, due, ...taskData } = values
    const { resetForm } = props

    loading.value = true

    try {
        await GqlUpdateTask({
            input: {
                ...taskData,
                due: due ? DateTime.fromISO(due).endOf('day') : null,
                categoryIds: categories?.map((tc: ComboboxItem) => tc.value)
            }
        })

        await resetForm()

        toast({
            title: `${taskData.title}`,
            description: 'Erfolgreich bearbeitet.',
        });

        emit('success')
        open.value = false
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <Sheet v-model:open="open">
        <SheetTrigger as-child><Button variant="ghost" class="text-sm">bearbeiten</Button></SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Aufgabe bearbeiten</SheetTitle>
            </SheetHeader>
            <div class="mt-6">
                <TasksForm :task="task" :loading="loading" @submit="onSubmit" />
            </div>
        </SheetContent>
    </Sheet>
</template>