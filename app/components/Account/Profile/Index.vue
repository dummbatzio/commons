<script setup lang="ts">
const { profile } = useUser()
</script>

<template>
    <div>
        <LayoutSectionHeading>
            Profile
        </LayoutSectionHeading>
        <div>
            {{ profile }}
        </div>
    </div>
</template>