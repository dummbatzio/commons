<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod';
import type { Task } from '~/types';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

interface TaskProps {
    task?: Task
}
const { task } = defineProps<TaskProps>()
const emit = defineEmits(['success'])

const comboboxSchema =
    z.object({
        value: z.string().uuid(),
        label: z.string()
    })
const schema = toTypedSchema(
    z.object({
        title: z.string(),
        description: z.string().optional(),
        expense: z.number().positive(),
        factor: z.number().positive(),
        due: z.string().datetime().optional(),
        categories: z.array(comboboxSchema).optional(),
        type: z.string()
    })
)

const loading = ref(false);
const { values, setFieldValue, handleSubmit } = useForm({
    validationSchema: schema
})
const onSubmit = handleSubmit(async (values, props) => {
    const { categories, ...taskData } = values
    const { resetForm } = props

    loading.value = true

    try {
        await GqlCreateTask({
            input: {
                ...taskData,
                categoryIds: categories?.map(tc => tc.value)
            }
        })

        toast({
            title: `${taskData.title}`,
            description: 'Du hast eine neue Aufgabe erstellt.',
        });

        await resetForm()

        emit('success')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
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
            <div>TipTapDescription</div>
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
                        <Input v-bind="componentField" type="number" :disabled="loading" />
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