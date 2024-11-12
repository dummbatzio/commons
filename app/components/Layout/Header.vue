<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
    <header class="shadow-md">
        <Container>
            <nav class="flex items-center justify-between py-4">
                <Button variant="link" as-child>
                    <NuxtLink :to="loggedIn ? '/app' : '/'">
                        <Logo class="w-6" />
                    </NuxtLink>
                </Button>
                <div>
                    <Button v-if="!loggedIn" variant="ghost" as-child>
                        <NuxtLink to="/auth/login">
                            Login
                        </NuxtLink>
                    </Button>
                    <UserNavigation v-else />
                </div>
            </nav>
        </Container>
    </header>
</template>