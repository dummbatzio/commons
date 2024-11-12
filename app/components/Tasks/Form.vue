<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod';
import type { Task } from '~/types';
import { Button } from '../ui/button';

interface TaskProps {
    task?: Task
    loading?: boolean,
}
const { task } = defineProps<TaskProps>()
const emit = defineEmits(['submit'])

const comboboxSchema =
    z.object({
        value: z.string().uuid(),
        label: z.string()
    })
const schema = toTypedSchema(
    z.object({
        id: z.string().uuid().optional(),
        title: z.string(),
        description: z.string().nullable(),
        expense: z.number().positive(),
        factor: z.number().positive(),
        due: z.string().nullable(),
        categories: z.array(comboboxSchema).optional(),
        type: z.string().nullable()
    })
)

const { values, setFieldValue, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: {
        ...task,
        due: null,
        categories: task?.categories?.map(c => ({ value: c.id, label: c.name }))
    }
})
const onSubmit = handleSubmit(async (values, props) => {
    emit('submit', values, props)
})

const createCategory = async (name: string) => {
    const { createTaskCategory } = await GqlCreateTaskCategory({ name })
    return {
        value: createTaskCategory.id,
        label: createTaskCategory.name
    }
}
</script>


<template>
    <form @submit="onSubmit">
        <input name="id" type="hidden" readonly />
        <div class="grid gap-4">
            <FormField v-slot="{ componentField }" name="title">
                <FormItem class="grid gap">
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                        <Input v-bind="componentField" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField name="description">
                <FormItem class="grid gap">
                    <FormLabel>Beschreibung</FormLabel>
                    <FormControl>
                        <FormTiptapEditor name="description" :form-values="values" :set-field-value="setFieldValue" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="expense">
                <FormItem class="grid gap">
                    <FormLabel>Aufwand</FormLabel>
                    <FormControl>
                        <Input v-bind="componentField" type="number" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="factor">
                <FormItem class="grid gap">
                    <FormLabel>Faktor</FormLabel>
                    <FormControl>
                        <Input v-bind="componentField" type="number" step=".01" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField name="due">
                <FormItem class="grid gap">
                    <FormLabel>Fälligkeit</FormLabel>
                    <FormDatePicker name="due" :form-values="values" :set-field-value="setFieldValue"
                        :disabled="loading" />
                    <FormDescription>End Of Day</FormDescription>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ value }" name="categories">
                <FormItem class="grid gap">
                    <FormLabel>Kategorien</FormLabel>
                    <FormTagsCombobox name="categories" :form-values="values" :set-field-value="setFieldValue"
                        placeholder="Kategorie..." :create="createCategory" :fetch-suggestions="async () => {
                            const { taskCategories } = await GqlGetTaskCategories()
                            return taskCategories.map(c => ({
                                value: c.id,
                                label: c.name
                            }))
                        }" :disabled="loading" />
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="type">
                <FormItem class="grid gap">
                    <FormLabel>Typ</FormLabel>
                    <Select v-bind="componentField">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Ist es eine wiederkehrende Aufgabe?" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="single">
                                    Einzelaufgabe
                                </SelectItem>
                                <SelectItem value="series">
                                    Serie
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
        </div>
        <div class="mt-6 flex items-center">
            <Button type="submit" :disabled="loading">Absenden</Button>
        </div>
    </form>
</template>