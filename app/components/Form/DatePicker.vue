<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
    FormControl,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const { name, formValues, setFieldValue } = defineProps<{ name: string; formValues: any; setFieldValue: any }>()

const df = new DateFormatter('de-DE', {
    dateStyle: 'medium',
})

const value = computed({
    get: () => formValues[name] ? parseDate(formValues[name]) : undefined,
    set: val => val,
})
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <FormControl>
                <Button variant="outline" :class="cn(
                    'w-[240px] ps-3 text-start font-normal',
                    !value && 'text-muted-foreground'
                )">
                    <span>{{ value ? df.format(toDate(value)) : "" }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden>
            </FormControl>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
            <Calendar v-model="value" initial-focus :min-value="new CalendarDate(1900, 1, 1)"
                :max-value="today(getLocalTimeZone())" @update:model-value="(v) => {
                    if (v) {
                        setFieldValue(name, v.toString())
                    }
                    else {
                        setFieldValue(name, undefined)
                    }

                }" />
        </PopoverContent>
    </Popover>
</template>