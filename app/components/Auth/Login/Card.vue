<template>
    <Card class="mx-auto max-w-sm">
        <CardHeader>
            <CardTitle class="text-2xl">
                Login
            </CardTitle>
            <CardDescription>
                Enter your email below to login to your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AuthLoginForm />
            <div class="mt-4 text-center text-sm">
                Don't have an account?
                <NuxtLink to="/auth/register" class="underline">
                    Sign up
                </NuxtLink>
            </div>
        </CardContent>
    </Card>
</template>