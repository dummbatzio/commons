<script setup lang="ts">
// const { user } = useUserSession();
// const { data, refresh } = await useAsyncGql("FindAssignmentsByUser", { userId: user.value!.id })
// const assignments = computed(() => data.value?.assignmentsByUser)
</script>

<template>
    <div>
        <p class="text-sm">Du hast aktuell keine Aufgaben.</p>
        <!-- <div v-if="assignments?.length">{{ assignments }}</div>
        <p v-else class="text-sm">Du hast aktuell keine Aufgaben.</p> -->
    </div>
</template>