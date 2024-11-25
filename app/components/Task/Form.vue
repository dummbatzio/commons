<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod';
import type { Task } from '~/types';
import { Separator } from '../ui/separator';
import { Clock } from 'lucide-vue-next';
import { Checkbox } from '../ui/checkbox';
import { TaskPriority, TaskRepeat } from '~/types/tasks';
import { DateTime, Duration } from 'luxon';
import type { ComboboxItem } from '../Form/Combobox.vue';
import { linkListSchema } from '../Form/schema';

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
        description: z.string().nullable().optional(),
        priority: z.string().default(TaskPriority.NONE),
        expense: z.number().positive(),
        factor: z.number().positive(),
        due: z.object({
            date: z.string().nullable(),
            time: z.string().nullable()
        }),
        category: comboboxSchema.optional(),
        subcategories: z.array(comboboxSchema).optional(),
        type: z.string().default("single").nullable(),
        repeat: z.nativeEnum(TaskRepeat).optional(),
        links: z.array(linkListSchema).optional(),
    }).superRefine((data, ctx) => {
        if (data.type === "series") {
            if (!data.repeat) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Pflichtfeld für sich wiederholende Aufgaben.",
                    path: ["repeat"],
                });
            }
            if (!data.due.date) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Pflichtfeld",
                    path: ["due.date"],
                });
            }
            if (!data.due.time) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Pflichtfeld",
                    path: ["due.time"],
                });
            }
        }
    })
)

const initialDueDate = task?.due ? DateTime.fromISO(task!.due!.toString()).toLocal() : null;
const initialDue = initialDueDate ? {
    date: initialDueDate.toISODate(),
    time: `${initialDueDate.hour < 10 ? '0' + initialDueDate.hour : initialDueDate.hour}:${initialDueDate.minute < 10 ? '0' + initialDueDate.minute : initialDueDate.minute}`
} : {
    date: null,
    time: null
};
const initialCategory = task?.categories?.find(c => !c.parent);
const { values, setFieldValue, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: {
        ...task,
        expense: Duration.fromObject({ minutes: task?.expense }).shiftTo("hours").toObject().hours,
        due: initialDue,
        category: initialCategory ? {
            value: initialCategory.id,
            label: initialCategory.name
        } : undefined,
        subcategories: task?.categories?.filter(c => c.parent).map(c => ({ label: c.name, value: c.id })),
    }
})
const onSubmit = handleSubmit(async (values, props) => {
    emit('submit', values, props)
})


const onCategorySelected = (item: ComboboxItem) => {
    // reset subcategories
    setFieldValue('subcategories', []);
}

const createCategory = async (name: string) => {
    const { createTaskCategory } = await GqlCreateTaskCategory({ name })
    return {
        value: createTaskCategory.id,
        label: createTaskCategory.name
    }
}
const createSubcategory = async (name: string) => {
    const { category } = values;
    if (!category) {
        throw new Error("no parent category");
    }
    const { createTaskCategory } = await GqlCreateTaskCategory({ name, parentId: category.value })
    return {
        value: createTaskCategory.id,
        label: createTaskCategory.name
    }
}

defineExpose({
    doSubmit: onSubmit
})
</script>


<template>
    <form @submit="onSubmit">
        <input name="id" type="hidden" readonly />
        <div class="grid grid-cols-6 gap-x-2 gap-y-4">
            <div class="col-span-full">
                <FormField v-slot="{ componentField }" name="title">
                    <FormItem class="grid gap">
                        <FormLabel>Titel</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" :disabled="loading" />
                        </FormControl>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <Separator class="col-span-full my-2" />

            <div class="col-span-full">
                <FormField v-slot="{ value, handleChange }" name="type" type="checkbox" value="series"
                    unchecked-value="single">
                    <FormItem class="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl class="mt-0.5">
                            <Checkbox :checked="value === 'series'" @update:checked="handleChange" />
                        </FormControl>
                        <FormLabel class="text-sm font-normal">
                            Wiederkehrende Aufgabe
                        </FormLabel>
                    </FormItem>
                    <FormMessage class="text-xs" />
                </FormField>
            </div>

            <div class="col-span-full lg:col-span-3">
                <FormField name="due.date">
                    <FormItem class="grid gap">
                        <FormLabel>{{ values.type === 'series' ? "Serienstart" : "Fälligkeit" }}</FormLabel>
                        <FormDatePicker name="due.date" placeholder="Datum" :form-values="values"
                            :set-field-value="setFieldValue" :disabled="loading" />
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <div class="col-span-full lg:col-span-3">
                <FormField v-slot="{ componentField }" name="due.time">
                    <FormItem class="grid gap">
                        <FormLabel>&nbsp;</FormLabel>
                        <FormControl>
                            <div class="relative w-full items-center">
                                <Input v-bind="componentField" placeholder="Uhrzeit" v-maska="'##:##'" class="pl-8"
                                    :disabled="loading" />
                                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                                    <Clock class="size-4 text-muted-foreground opacity-50" />
                                </span>
                            </div>
                        </FormControl>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <div v-if="values.type === 'series'" class="col-span-full">
                <FormField v-slot="{ componentField }" name="repeat">
                    <FormItem>
                        <FormLabel>Wiederholung</FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="weekly">
                                        wöchentlich
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        monatlich
                                    </SelectItem>
                                    <SelectItem value="quarterly">
                                        quartalsweise
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <div v-if="task?.id && task?.type === 'series'" class="col-span-full">
                <p class="text-destructive text-sm">
                    Änderung des Serienstarts oder der Wiederholung kann zu Neugenerierung der Folgetermine führen.
                </p>
            </div>

            <Separator class="col-span-full my-2" />

            <div class="col-span-full">
                <FormField v-slot="{ value }" name="category">
                    <FormItem class="grid gap">
                        <FormLabel>Kategorie</FormLabel>
                        <FormCombobox name="category" :form-values="values" :set-field-value="setFieldValue"
                            placeholder="Kategorie..." :create="createCategory" :fetch-suggestions="async () => {
                                const { taskCategories } = await GqlGetTaskCategories({
                                    parentId: null
                                })
                                return taskCategories.map(c => ({
                                    value: c.id,
                                    label: c.name
                                }))
                            }" :disabled="loading" @selected="onCategorySelected" />
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <div class="col-span-full">
                <FormField v-slot="{ value }" name="subcategories">
                    <FormItem class="grid gap">
                        <FormLabel>Unterkategorien</FormLabel>
                        <FormTagsCombobox :key="values.category?.value" name="subcategories" :form-values="values"
                            :set-field-value="setFieldValue" placeholder="Unterkategorie..." :create="createSubcategory"
                            :fetch-suggestions="async () => {
                                if (!values.category) {
                                    return []
                                }

                                const { taskCategories } = await GqlGetTaskCategories({
                                    parentId: values.category?.value
                                })
                                return taskCategories.map(c => ({
                                    value: c.id,
                                    label: c.name
                                }))
                            }" :disabled="!values.category || loading" />
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <Separator class="col-span-full my-2" />

            <div class="col-span-full lg:col-span-3">
                <FormField v-slot="{ componentField }" name="expense">
                    <FormItem class="grid gap">
                        <FormLabel>Aufwand (h)</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="number" :disabled="loading" />
                        </FormControl>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>
            <div class="col-span-full lg:col-span-3">
                <FormField v-slot="{ componentField }" name="factor">
                    <FormItem class="grid gap">
                        <FormLabel>Faktor</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="number" step=".01" :disabled="loading" />
                        </FormControl>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <div class="col-span-full">
                <FormField v-slot="{ componentField }" name="priority">
                    <FormItem>
                        <FormLabel>Priorität</FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem :value="TaskPriority.NONE">
                                        keine
                                    </SelectItem>
                                    <SelectItem :value="TaskPriority.LOW">
                                        niedrig
                                    </SelectItem>
                                    <SelectItem :value="TaskPriority.MEDIUM">
                                        medium
                                    </SelectItem>
                                    <SelectItem :value="TaskPriority.HIGH">
                                        hoch
                                    </SelectItem>
                                    <SelectItem :value="TaskPriority.URGENT">
                                        dringend
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage class="text-xs" />
                    </FormItem>
                </FormField>
            </div>

            <Separator class="col-span-full my-2" />

            <div class="col-span-full">
                <h5 class="text-sm font-medium leading-none">Links</h5>
                <FormLinkList name="links" :form-values="values" :set-field-value="setFieldValue" />
            </div>
            <!-- <FormField name="description">
                        <FormItem class="grid gap">
                            <FormLabel>Beschreibung</FormLabel>
                            <FormControl>
                                <FormTiptapEditor name="description" :form-values="values" :set-field-value="setFieldValue" />
                            </FormControl>
                            <FormMessage class="text-xs" />
                        </FormItem>
                    </FormField> -->
        </div>
    </form>
</template>