<script setup lang="ts">
const { refetch } = useUser();
await refetch()
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>