<template>
    <Container>
        <div class="flex flex-col gap-6">
            <Button variant="outline" as-child>
                <NuxtLink to="/app/assignments">Assignments</NuxtLink>
            </Button>
            <Button variant="outline" as-child>
                <NuxtLink to="/app/resources">Resources</NuxtLink>
            </Button>
            <Button variant="outline" as-child>
                <NuxtLink to="/app/qualifications">Qualifications</NuxtLink>
            </Button>
        </div>
    </Container>
</template>