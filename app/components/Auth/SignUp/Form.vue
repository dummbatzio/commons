<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { LoadingButton } from '~/components/ui/button';
import type { FormError } from '~/components/Form/Errors.vue';
import { useToast } from '~/components/ui/toast';

const { toast } = useToast();

const formSchema = toTypedSchema(z.object({
    username: z.string().trim().regex(/^[\S]+$/gm, "Keine Leerzeichen erlaubt"),
    email: z.string().email(),
    password: z.string().min(6)
}))

const form = useForm({
    validationSchema: formSchema,
})

const errors: Ref<FormError[]> = ref([])
const loading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
    loading.value = true;
    errors.value = [];

    try {
        const result = await $fetch("/api/iam/sign-up", {
            method: "POST",
            body: values
        })

        toast({
            title: "Konto angelegt",
            description: "Dein Konto ist erfolgreich angelegt. Melde dich mit deiner E-Mail-Adresse und Passwort an, dann geht es weiter..."
        })

        await navigateTo({
            path: "/auth/login",
            query: {
                email: result?.email
            }
        })
    } catch (err: any) {
        errors.value.push({
            title: err.statusMessage,
        })
    } finally {
        loading.value = false;
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <div class="grid gap-4">
            <FormField v-slot="{ componentField }" name="username">
                <FormItem class="grid gap">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input id="username" v-bind="componentField" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
                <FormItem class="grid gap">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input id="email" type="email" v-bind="componentField" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
                <FormItem class="grid gap">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input id="password" type="password" v-bind="componentField" :disabled="loading" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <LoadingButton type="submit" class="w-full" :disabled="loading">Sign Up</LoadingButton>
        </div>
    </form>
</template>