<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { LoadingButton } from '~/components/ui/button';
import type { FormError } from '~/components/Form/Errors.vue';

const { query } = useRoute()
const { fetch, session } = useUserSession()

const formSchema = toTypedSchema(z.object({
    email: z.string().email(),
    password: z.string().min(6)
}))

const form = useForm({
    validationSchema: formSchema,
    initialValues: query
})

const errors: Ref<FormError[]> = ref([])
const loading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
    loading.value = true

    try {
        errors.value = []
        await $fetch('/api/iam/sign-in', {
            method: "POST",
            body: values
        })

        await fetch();

        useGqlToken(session.value.accessToken);

        await navigateTo("/app/dashboard")
    } catch (err: any) {
        errors.value.push({
            title: err.statusMessage,
        })
    } finally {
        loading.value = false;
    }
})

onMounted(() => {
    if (import.meta.client && query?.email) {
        document.getElementById(`password`)?.focus();
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <FormErrors :errors="errors" class="text-sm mb-4" />
        <div class="grid gap-4">
            <FormField v-slot="{ componentField }" name="email">
                <FormItem class="grid gap">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input id="email" type="email" v-bind="componentField" :disabled="loading" tabindex="1" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
                <FormItem class="grid gap">
                    <div class="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <NuxtLink to="/auth/forgot-password" class="ml-auto inline-block text-sm underline"
                            tabindex="4">
                            Forgot your password?
                        </NuxtLink>
                    </div>
                    <FormControl>
                        <Input id="password" type="password" v-bind="componentField" :disabled="loading" tabindex="2" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
            </FormField>
            <LoadingButton type="submit" class="w-full" :disabled="loading" tabindex="3">Login</LoadingButton>
        </div>
    </form>
</template>