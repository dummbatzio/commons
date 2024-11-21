<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import type { Task } from '~/types';
import { ScrollArea } from '../ui/scroll-area';
import { DateTime } from 'luxon';

interface SeriesDialogProps {
    task: Task
}
const { task } = defineProps<SeriesDialogProps>()

const page = ref(1)
const series = computed(() => task.series?.filter(x => x.status === "open").slice(0, page.value * 10))
</script>

<template>
    <Dialog v-if="task">
        <DialogTrigger as-child>
            <Button variant="outline" size="xs" class="text-xs font-normal rounded-full">
                Termine
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ task.title }} - Serientermine</DialogTitle>
            </DialogHeader>
            <ScrollArea class="max-h-[60vh]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Termin
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="s in series">
                            <TableCell>{{ s.due ?
                                DateTime.fromISO(s.due.toString()).toLocaleString(DateTime.DATETIME_SHORT) :
                                "n/a" }}</TableCell>
                            <TableCell>{{ s.status }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>