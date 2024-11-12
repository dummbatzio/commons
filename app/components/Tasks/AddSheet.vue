<script setup lang="ts">
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../ui/button';

const emit = defineEmits(["success"])

const open = ref(false);

const onSuccess = () => {
    emit('success');
    open.value = false
}
</script>

<template>
    <Sheet v-model:open="open">
        <SheetTrigger as-child><Button>Aufgabe hinzufügen</Button></SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Neue Aufgabe hinzufügen</SheetTitle>
            </SheetHeader>
            <div class="mt-6">
                <TasksForm @success="onSuccess" />
            </div>
        </SheetContent>
    </Sheet>
</template>