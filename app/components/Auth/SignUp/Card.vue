<template>
    <Card class="mx-auto max-w-sm">
        <CardHeader>
            <CardTitle class="text-2xl">
                Sign Up
            </CardTitle>
            <CardDescription>
                Enter your information to create an account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AuthSignUpForm />
            <div class="mt-4 text-center text-sm">
                Already have an account?
                <NuxtLink to="/auth/login" class="underline">
                    Sign in
                </NuxtLink>
            </div>
        </CardContent>
    </Card>
</template>